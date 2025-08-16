'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft, Trophy, Users, Vote } from 'lucide-react';
import Link from 'next/link';

interface ResultData {
  results: {
    [position: string]: {
      id: string;
      name: string;
      studentId: string;
      class: string;
      photo?: string;
      motto: string;
      votes: number;
    }[];
  };
  voteCounts: { [position: string]: number };
}

export default function ElectionResults({ params }: { params: { electionId: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [results, setResults] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const userRole = (session.user as any)?.role;
      if (userRole !== 'admin') {
        router.push('/');
        return;
      }
      fetchResults();
    }
  }, [session, params.electionId]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/results/${params.electionId}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
        console.log('Results fetched:', data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Results Not Found</h2>
          <Button asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button asChild variant="outline" className="mb-4">
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Election Results</h1>
          </div>
        </div>

        <div className="space-y-8">
          {Object.entries(results.results).map(([position, candidates]) => {
            const winner = candidates[0];
            const totalVotes = results.voteCounts[position] || 0;
            
            const chartData = candidates.map((candidate, index) => ({
              name: candidate.name,
              votes: candidate.votes,
              color: COLORS[index % COLORS.length]
            }));

            return (
              <div key={position} className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold text-gray-900">{position}</h2>
                  <Badge variant="outline">{totalVotes} total votes</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Winner Card */}
                  <Card className="border-2 border-yellow-200 bg-yellow-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-600" />
                        Winner: {position}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {winner ? (
                        <div className="text-center">
                          <div className="w-20 h-20 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-yellow-700" />
                          </div>
                          <h3 className="text-xl font-bold mb-1">{winner.name}</h3>
                          <p className="text-gray-600 mb-2">ID: {winner.studentId} • Class: {winner.class}</p>
                          <p className="text-sm italic text-gray-700 mb-3">&quot;{winner.motto}&quot;</p>
                          <div className="text-3xl font-bold text-yellow-600">{winner.votes} votes</div>
                          <div className="text-sm text-gray-600">
                            {totalVotes > 0 ? Math.round((winner.votes / totalVotes) * 100) : 0}% of total votes
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-600">No candidates for this position</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Vote Distribution Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Vote Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, votes }) => `${name}: ${votes}`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="votes"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* All Candidates */}
                <Card>
                  <CardHeader>
                    <CardTitle>All Candidates - {position}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {candidates.map((candidate, index) => (
                        <div
                          key={candidate.id}
                          className={`flex items-center justify-between p-4 rounded-lg ${
                            index === 0 
                              ? 'bg-yellow-50 border-2 border-yellow-200' 
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {index === 0 && <Trophy className="h-5 w-5 text-yellow-600" />}
                              <span className="text-lg font-bold">#{index + 1}</span>
                            </div>
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">{candidate.name}</h3>
                              <p className="text-sm text-gray-600">
                                ID: {candidate.studentId} • Class: {candidate.class}
                              </p>
                              <p className="text-sm italic text-gray-700">&quot;{candidate.motto}&quot;</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{candidate.votes}</div>
                            <div className="text-sm text-gray-600">
                              {totalVotes > 0 ? Math.round((candidate.votes / totalVotes) * 100) : 0}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {candidates.length === 0 && (
                      <div className="text-center py-8 text-gray-600">
                        No candidates for this position
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Bar Chart */}
                {candidates.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Vote Comparison - {position}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="votes" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(results.results).length === 0 && (
          <div className="text-center py-12">
            <Vote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Yet</h2>
            <p className="text-gray-600">Results will appear once voting begins</p>
          </div>
        )}
      </div>
    </div>
  );
}