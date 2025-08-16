'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';

export default function CreateElection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    positions: ['Head Boy', 'Head Girl'],
    startDate: '',
    endDate: '',
    eligibleClasses: [] as string[]
  });
  const [newPosition, setNewPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const availableClasses = ['9', '10', '11', '12'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/elections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin');
      } else {
        setError(data.message || 'Failed to create election');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addPosition = () => {
    if (newPosition.trim() && !formData.positions.includes(newPosition.trim())) {
      setFormData(prev => ({
        ...prev,
        positions: [...prev.positions, newPosition.trim()]
      }));
      setNewPosition('');
    }
  };

  const removePosition = (position: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.filter(p => p !== position)
    }));
  };

  const toggleClass = (className: string) => {
    setFormData(prev => ({
      ...prev,
      eligibleClasses: prev.eligibleClasses.includes(className)
        ? prev.eligibleClasses.filter(c => c !== className)
        : [...prev.eligibleClasses, className]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Election</h1>
          <p className="text-gray-600 mt-2">Set up a new election for student leadership positions</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Election Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Election Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g. Student Council Elections 2024"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the election..."
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label>Leadership Positions</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add new position"
                      value={newPosition}
                      onChange={(e) => setNewPosition(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPosition())}
                    />
                    <Button type="button" onClick={addPosition} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.positions.map(position => (
                      <div
                        key={position}
                        className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {position}
                        <button
                          type="button"
                          onClick={() => removePosition(position)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date & Time</Label>
                    <Input
                      id="startDate"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date & Time</Label>
                    <Input
                      id="endDate"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Eligible Classes</Label>
                  <div className="grid grid-cols-4 gap-4">
                    {availableClasses.map(className => (
                      <div key={className} className="flex items-center space-x-2">
                        <Checkbox
                          id={`class-${className}`}
                          checked={formData.eligibleClasses.includes(className)}
                          onCheckedChange={() => toggleClass(className)}
                        />
                        <Label htmlFor={`class-${className}`}>Class {className}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-4">
                <Button asChild type="button" variant="outline">
                  <Link href="/admin">Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Election'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}