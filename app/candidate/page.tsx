'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Users, Plus, CheckCircle, Clock, Trophy } from 'lucide-react';

interface Election {
  _id: string;
  title: string;
  positions: string[];
  isActive: boolean;
}

interface CandidateApplication {
  _id: string;
  position: string;
  motto: string;
  manifesto: string;
  isApproved: boolean;
  electionId: { title: string };
}

export default function CandidateDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  const [applications, setApplications] = useState<CandidateApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    electionId: '',
    position: '',
    motto: '',
    manifesto: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole === 'admin') {
        router.push('/admin');
        return;
      } else if (userRole === 'voter') {
        router.push('/voter');
        return;
      }
      fetchData();
    } else if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      const [electionsRes, candidatesRes] = await Promise.all([
        fetch('/api/elections'),
        fetch('/api/candidates')
      ]);

      if (electionsRes.ok) {
        const electionsData = await electionsRes.json();
        const activeElections = electionsData.filter((e: Election) => e.isActive);
        setElections(activeElections);
      }

      if (candidatesRes.ok) {
        const candidatesData = await candidatesRes.json();
        const myApplications = candidatesData.filter(
          (c: any) => c.userId._id === (session?.user as any)?.id
        );
        setApplications(myApplications);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Application submitted successfully!');
        setShowForm(false);
        setFormData({ electionId: '', position: '', motto: '', manifesto: '' });
        fetchData();
      } else {
        alert(data.message || 'Failed to submit application');
      }
    } catch (error) {
      alert('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedElection = elections.find(e => e._id === formData.electionId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Vote className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Candidate Dashboard</h1>
                <p className="text-gray-600">Welcome, {session?.user?.name}</p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? 'Cancel' : 'Apply for Position'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Application Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Apply for Leadership Position</CardTitle>
              <CardDescription>
                Fill out this form to apply for a student leadership position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="election">Select Election</Label>
                    <Select
                      value={formData.electionId}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, electionId: value, position: '' }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose an election" />
                      </SelectTrigger>
                      <SelectContent>
                        {elections.map((election) => (
                          <SelectItem key={election._id} value={election._id}>
                            {election.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
                      disabled={!formData.electionId}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a position" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedElection?.positions.map((position) => (
                          <SelectItem key={position} value={position}>
                            {position}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="motto">Campaign Motto</Label>
                  <Input
                    id="motto"
                    type="text"
                    placeholder="A short inspiring motto for your campaign"
                    value={formData.motto}
                    onChange={(e) => setFormData(prev => ({ ...prev, motto: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manifesto">Manifesto</Label>
                  <Textarea
                    id="manifesto"
                    placeholder="Describe your vision, plans, and why students should vote for you..."
                    value={formData.manifesto}
                    onChange={(e) => setFormData(prev => ({ ...prev, manifesto: e.target.value }))}
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* My Applications */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>

          {applications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
                <p className="text-gray-600 mb-4">You haven&#39;t applied for any positions yet</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {applications.map((application) => (
                <Card key={application._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{application.position}</CardTitle>
                        <CardDescription>{application.electionId.title}</CardDescription>
                      </div>
                      <Badge variant={application.isApproved ? 'default' : 'secondary'}>
                        {application.isApproved ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {application.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Motto:</p>
                        <p className="italic text-blue-700">&quot;{application.motto}&quot;</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Manifesto:</p>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {application.manifesto.substring(0, 200)}
                          {application.manifesto.length > 200 && '...'}
                        </p>
                      </div>
                      {application.isApproved ? (
                        <Alert className="border-green-200 bg-green-50">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            Your application has been approved! You&#39;re now officially running for {application.position}.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert>
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            Your application is under review by the election administrators.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Campaign Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              Campaign Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Creating a Strong Manifesto:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Be specific about your plans and goals</li>
                  <li>• Address real issues students face</li>
                  <li>• Show your leadership experience</li>
                  <li>• Be authentic and honest</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Campaign Best Practices:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Engage with fellow students respectfully</li>
                  <li>• Focus on positive messaging</li>
                  <li>• Follow school campaign guidelines</li>
                  <li>• Be prepared to answer questions about your plans</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}