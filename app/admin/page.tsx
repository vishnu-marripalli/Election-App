'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Vote, Users, Trophy, Settings, Plus, Power, PowerOff } from 'lucide-react';
import Link from 'next/link';

interface Election {
  _id: string;
  title: string;
  description: string;
  positions: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdBy: { name: string };
  eligibleClasses: string[];
}

interface Candidate {
  _id: string;
  userId: { name: string; studentId: string; class: string };
  position: string;
  motto: string;
  isApproved: boolean;
  electionId: { title: string };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole !== 'admin') {
        router.push('/');
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

      if (electionsRes.ok && candidatesRes.ok) {
        const electionsData = await electionsRes.json();
        const candidatesData = await candidatesRes.json();
        setElections(electionsData);
        setCandidates(candidatesData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleElection = async (electionId: string) => {
    try {
      const res = await fetch(`/api/elections/${electionId}/toggle`, {
        method: 'PUT'
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error toggling election:', error);
    }
  };

  const toggleCandidate = async (candidateId: string) => {
    try {
      const res = await fetch(`/api/candidates/${candidateId}/approve`, {
        method: 'PUT'
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error toggling candidate:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const activeElections = elections.filter(e => e.isActive);
  const pendingCandidates = candidates.filter(c => !c.isApproved);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Vote className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Welcome, {session?.user?.name}</p>
              </div>
            </div>
             <Button asChild>
              <Link href="/admin/voters">
                {/* <Plus className="h-4 w-4 mr-2" /> */}
                Manage Voters
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/elections/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Election
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <Vote className="h-8 w-8 text-blue-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Elections</p>
                <p className="text-2xl font-bold">{elections.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Power className="h-8 w-8 text-green-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Elections</p>
                <p className="text-2xl font-bold">{activeElections.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Users className="h-8 w-8 text-purple-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                <p className="text-2xl font-bold">{candidates.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-6">
              <Settings className="h-8 w-8 text-orange-600 mr-4" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold">{pendingCandidates.length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="elections" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="elections">Elections</TabsTrigger>
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
          </TabsList>

          <TabsContent value="elections">
            <Card>
              <CardHeader>
                <CardTitle>All Elections</CardTitle>
                <CardDescription>
                  Manage and monitor all school elections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {elections.map((election) => (
                    <div
                      key={election._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{election.title}</h3>
                          <Badge variant={election.isActive ? 'default' : 'secondary'}>
                            {election.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{election.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Positions: {election.positions.length}</span>
                          <span>Classes: {election.eligibleClasses.join(', ')}</span>
                          <span>
                            {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleElection(election._id)}
                        >
                          {election.isActive ? (
                            <PowerOff className="h-4 w-4 mr-1" />
                          ) : (
                            <Power className="h-4 w-4 mr-1" />
                          )}
                          {election.isActive ? 'Stop' : 'Start'}
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/results/${election._id}`}>
                            <Trophy className="h-4 w-4 mr-1" />
                            Results
                          </Link>
                        </Button>
                         <Button asChild variant="outline" size="sm">
                          <Link href={`/admin/count/${election._id}`}>
                            <Trophy className="h-4 w-4 mr-1" />
                            count
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {elections.length === 0 && (
                    <div className="text-center py-8">
                      <Vote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No elections yet</h3>
                      <p className="text-gray-600 mb-4">Get started by creating your first election</p>
                      <Button asChild>
                        <Link href="/admin/elections/create">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Election
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <CardTitle>Candidate Management</CardTitle>
                <CardDescription>
                  Review and approve candidate applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold">{candidate.userId.name}</h3>
                          <Badge variant={candidate.isApproved ? 'default' : 'secondary'}>
                            {candidate.isApproved ? 'Approved' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Student ID: {candidate.userId.studentId} • Class: {candidate.userId.class}</p>
                          <p>Position: {candidate.position}</p>
                          <p>Election: {candidate.electionId.title}</p>
                          <p className="italic">&quot;{candidate.motto}&quot;</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={candidate.isApproved ? 'destructive' : 'default'}
                          size="sm"
                          onClick={() => toggleCandidate(candidate._id)}
                        >
                          {candidate.isApproved ? 'Revoke' : 'Approve'}
                        </Button>
                      </div>
                    </div>
                  ))}

                  {candidates.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates yet</h3>
                      <p className="text-gray-600">Candidates will appear here once they apply</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}