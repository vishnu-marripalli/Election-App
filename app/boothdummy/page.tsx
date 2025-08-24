// Booth.tsx
"use client";
import { useEffect, useState } from "react";
// import io, { Socket } from "socket.io-client";
import io, { Socket } from "socket.io-client";


import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/public/logo.png';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Vote, Users, CheckCircle, Clock, Trophy, Calendar, UserCheck, Sparkles, Award } from 'lucide-react';
interface Voter {
  _id: string;
  studentId: string;
  name: string;
  class: string;
  section?: string;
  role: string;
}

interface Election {
  _id: string;
  title: string;
  description: string;
  positions: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
}

interface Candidate {
  _id: string;
  userId: {
    name: string;
    studentId: string;
    class: string;
    photo?: string;
  };
  position: string;
  motto: string;
  manifesto: string;
  isApproved: boolean;
  votes: number;
}


let socket: Socket;


export default function Booth() {
  const  boothId  = "booth3";
  const [unlocked, setUnlocked] = useState(true);
  const [studentId, setStudentId] = useState<string | null>("Khs-01-A1-01");
const { data: session, status } = useSession();
  const router = useRouter();

  const [voterData, setVoterData] = useState<Voter | null>(null);
  const [elections, setElections] = useState<Election[]>([]);
  const [candidates, setCandidates] = useState<Record<string, Record<string, Candidate[]>>>({});
  const [votedPositions, setVotedPositions] = useState<{ [key: string]: string[] }>({});
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<{ [key: string]: boolean }>({});
// A mapping from position name to list of candidates
const [electionCandidates, setElectionCandidates] = useState<
  Record<string, Candidate[]>
>({});
  useEffect(() => {
    // socket = io("http://192.168.31.143:4000");
    // socket = io("http://192.168.29.110:4000");
    socket = io("https://election-backend-tudq.onrender.com");

    socket.on("connect", () => {
      console.log("Booth connected:", socket.id);
    });

    socket.on("evm-unlocked", (data) => {
      if (data.boothId === boothId) {
        setUnlocked(true);
        setStudentId(data.studentId);
      }
    });

    socket.on("evm-locked", (data) => {
      if (data.boothId === boothId) {
        setUnlocked(false);
        setStudentId(null);
      }
    });
    // fetchVoter();
    fetchData();
    return () => {
      socket.disconnect();
    };
  }, [boothId,studentId]);

// 🟢 Reset when studentId changes (new voter)
useEffect(() => {
  if (!studentId) {
    // Reset everything if booth is locked or student logged out
    setVoterData(null);
    setVotedPositions({});
    setVoting({});
        window.scrollTo({ top: 0, behavior: "smooth" }); // scroll up

    return;
  }

  // If studentId exists, fetch their data fresh
  setVotedPositions({});
  setVoting({});
//   fetchVoter();
      window.scrollTo({ top: 0, behavior: "smooth" }); // scroll up

}, [studentId]);

// 🎶 Play buzzer sound
  const playBuzzer = () => {
    console.log("Playing buzzer sound");
    const audio = new Audio("/beep-04.wav");
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  // 🟢 Effect: check if user voted all positions for each election
  useEffect(() => {
    elections.forEach((election) => {
      const totalPositions = election.positions.length;
      const votedCount = (votedPositions[election._id] || []).length;
      // console.log(`Election ${election.title} - Total Positions: ${totalPositions}, Voted Count: ${votedCount}`);
      if (totalPositions > 0 && votedCount === totalPositions) {
        playBuzzer();
      }
    });
  }, [votedPositions, elections]);


  const fetchVoter = async () => {
    try {
      const res = await fetch(`/api/user/${studentId}`);
      

      if (res.ok) {
        const data = await res.json();
        setVoterData(data);
      } else {
        console.error("Failed to fetch voter data");
      }
    } catch (error) {
      console.error("Error fetching voter data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const electionsRes = await fetch('/api/elections');
      if (electionsRes.ok) {
        const electionsData = await electionsRes.json();
        const activeElections = electionsData.filter((e: Election) => e.isActive);
        setElections(activeElections);

        // Fetch candidates for each active election
        const candidatesPromises = activeElections.map(async (election: Election) => {
          const candidatesRes = await fetch(`/api/candidates?electionId=${election._id}`);
          if (candidatesRes.ok) {
            const candidatesData = await candidatesRes.json();
            const approvedCandidates = candidatesData.filter((c: Candidate) => c.isApproved);
            
            // Group by position
            const byPosition = approvedCandidates.reduce((acc: any, candidate: Candidate) => {
              if (!acc[candidate.position]) {
                acc[candidate.position] = [];
              }
              acc[candidate.position].push(candidate);
              return acc;
            }, {});

            return { electionId: election._id, candidates: byPosition };
          }
          return { electionId: election._id, candidates: {} };
        });

        const candidatesResults = await Promise.all(candidatesPromises);
        const candidatesMap = candidatesResults.reduce((acc, result) => {
          acc[result.electionId] = result.candidates;
          return acc;
        }, {});

        setCandidates(candidatesMap);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (candidateId: string, electionId: string, position: string) => {
    setVoting(prev => ({ ...prev, [candidateId]: true }));

    try {
     
      
        setVotedPositions(prev => ({
          ...prev,
          [electionId]: [...(prev[electionId] || []), position]
        }));
        // Refresh data to update vote counts
        fetchData();
   
    } catch (error) {
      alert('Failed to cast vote');
    } finally {
      setVoting(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center animate-pulse">
            <Vote className="h-8 w-8 text-white animate-bounce" />
          </div>
          <div className="text-gray-600 font-medium">Loading your voting dashboard...</div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
         {/* Enhanced Header */}
         <div className="bg-white/80 backdrop-blur-md shadow-xl border-b border-white/20 sticky top-0 z-10">
           <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
             <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
               
               {/* Left: School Logo + Name */}
               <div className="flex items-center gap-4">
                 <div className="relative">
                   <Image
                     src={logo}
                     alt="School Logo"
                     className="w-32 rounded-2xl shadow-lg ring-4 ring-white/50"
                     // width={64}
                     // height={64}
                   />
                   {/* <div className="absol?ute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div> */}
                 </div>
                 <div>
                   <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                     Kanthi High School
                   </h1>
                   <div className="flex items-center gap-2 text-gray-600 mb-1">
                     <Trophy className="h-4 w-4 text-amber-500" />
                     <span className="font-medium">Voting Dashboard Polling Booth {boothId}</span>
                   </div>
                   <div className="flex items-center gap-2">
                     <UserCheck className="h-4 w-4 text-green-500" />
                     <span className="text-xl font-medium text-gray-700">Welcome, Vishnuvardhan</span>
                     <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-1">
10                     </Badge>
                   </div>
                 </div>
               </div>
   
               {/* Right: Voter Info Card */}
               <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-4 rounded-xl shadow-lg">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                     <Users className="h-5 w-5" />
                   </div>
                   <div>
                     <div className="text-sm opacity-90">Student ID</div>
                     <div className="font-bold">Khs-01-A1-01</div>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
   
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
           {elections.length === 0 ? (
             <div className="text-center py-20">
               <div className="relative mb-8">
                 <Clock className="h-24 w-24 text-gray-300 mx-auto" />
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-xl opacity-30 animate-pulse"></div>
               </div>
               <h2 className="text-4xl font-bold text-gray-800 mb-4">No Active Elections</h2>
               <p className="text-gray-600 text-lg max-w-md mx-auto">
                 There are no active elections at the moment. Check back later for upcoming voting opportunities!
               </p>
             </div>
           ) : (
             elections.map((election, electionIndex) => {
               const electionCandidates = candidates[election._id] || {};
               const userVotedPositions = votedPositions[election._id] || [];
               const totalPositions = election.positions.length;
               const votedCount = userVotedPositions.length;
               const progressPercentage = (votedCount / totalPositions) * 100;
   
               return (
                 <div key={election._id} className="mb-16 animate-in slide-in-from-bottom duration-700" style={{ animationDelay: `${electionIndex * 200}ms` }}>
                   {/* Election Header Card */}
                   <Card className="mb-8 bg-gradient-to-r from-white to-blue-50/50 border-0 shadow-xl">
                     <CardHeader className="pb-4">
                       <div className="flex items-start justify-between">
                         <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                             <Vote className="h-6 w-6 text-white" />
                           </div>
                           <div>
                             <div className="flex items-center gap-3 mb-2">
                               <CardTitle className="text-3xl font-bold text-gray-900">{election.title}</CardTitle>
                               <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg">
                                 <Sparkles className="h-3 w-3 mr-1" />
                                 Active
                               </Badge>
                             </div>
                             <CardDescription className="text-gray-600 text-lg mb-3">
                               {election.description}
                             </CardDescription>
                             <div className="flex items-center gap-4 text-sm text-gray-500">
                               <div className="flex items-center gap-2">
                                 <Calendar className="h-4 w-4" />
                                 <span>
                                   {new Date(election.startDate).toLocaleDateString()} - {new Date(election.endDate).toLocaleDateString()}
                                 </span>
                               </div>
                             </div>
                           </div>
                         </div>
   
                         {/* Voting Progress */}
                         {/* <div className="text-right">
                           <div className="text-2xl font-bold text-blue-600 mb-1">
                             {votedCount}/{totalPositions}
                           </div>
                           <div className="text-sm text-gray-500 mb-2">Positions Voted</div>
                           <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                             <div 
                               className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-1000 ease-out"
                               style={{ width: `${progressPercentage}%` }}
                             ></div>
                           </div>
                         </div> */}
                       </div>
                     </CardHeader>
                   </Card>
   
                   {/* Positions */}
                   <div className="grid gap-8">
                     {election.positions.map((position, positionIndex) => {
                      const positionCandidates: Candidate[] = electionCandidates[position] || [];
                        const hasVoted = userVotedPositions.includes(position);
                       return (
                         <Card 
                           key={position} 
                           className={`overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                             hasVoted 
                               ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg' 
                               : 'bg-white border-gray-200 hover:border-blue-300'
                           }`}
                           style={{ animationDelay: `${(electionIndex * 3 + positionIndex) * 150}ms` }}
                         >
                           {/* Position Header */}
                           <div className={`px-6 py-4 flex items-center justify-between ${
                             hasVoted 
                               ? 'bg-gradient-to-r from-green-100 to-emerald-100' 
                               : 'bg-gradient-to-r from-gray-50 to-blue-50'
                           }`}>
                             <div className="flex items-center gap-3">
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                 hasVoted 
                                   ? 'bg-green-500 text-white' 
                                   : 'bg-blue-500 text-white'
                               }`}>
                                 {hasVoted ? <CheckCircle className="h-4 w-4" /> : <Award className="h-4 w-4" />}
                               </div>
                               <h3 className="text-xl font-bold text-gray-800">{position}</h3>
                               <Badge className="text-xs px-2 py-1 bg-gray-100 text-gray-600">
                                 {positionCandidates.length} candidate{positionCandidates.length !== 1 ? 's' : ''}
                               </Badge>
                             </div>
                             
                             {hasVoted && (
                               <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg animate-pulse">
                                 <CheckCircle className="h-4 w-4 mr-2" />
                                 Vote Cast
                               </Badge>
                             )}
                           </div>
   
                           {/* Candidates List */}
                           <CardContent className="p-0">
                             {positionCandidates.length === 0 ? (
                               <div className="px-6 py-12 text-center text-gray-500">
                                 <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                 <p className="text-lg font-medium">No candidates available for this position</p>
                               </div>
                             ) : (
                               <div className="divide-y divide-gray-100">
                                 {positionCandidates.map((candidate, candidateIndex) => (
                                   <div
                                     key={candidate._id}
                                     className={`px-6 py-5 transition-all duration-300 ${
                                       hasVoted 
                                         ? 'bg-green-50/50' 
                                         : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'
                                     }`}
                                   >
                                     <div className="flex items-center justify-between">
                                       {/* Candidate Info */}
                                       <div className="flex items-center gap-6">
                                         <div className="flex-shrink-0">
                                           <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center font-bold text-blue-700 text-lg shadow-md">
                                             {candidateIndex + 1}
                                           </div>
                                         </div>
                                         
                                         <div className="flex-1">
                                           <div className="flex items-center gap-3 mb-1">
                                             <h4 className="text-lg font-bold text-gray-900">{candidate.userId.name}</h4>
                                             <Badge className="text-xs px-2 py-1 bg-blue-100 text-blue-700">
                                               Class {candidate.userId.class}
                                             </Badge>
                                           </div>
                                           <p className="text-gray-600">
                                             Student ID: <span className="font-medium">{candidate.userId.studentId}</span>
                                           </p>
                                           {candidate.motto && (
                                             <p className="text-sm text-gray-500 italic mt-1">&quot;{candidate.motto}&quot;</p>
                                           )}
                                         </div>
                                       </div>
   
                                       {/* Vote Section */}
                                       <div className="flex items-center gap-4">
                                         {/* Symbol */}
                                         <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border-2 border-gray-300 shadow-sm">
                                           <Users className="h-6 w-6 text-gray-600" />
                                         </div>
   
                                         {/* Vote Button */}
                                         <Button
                                           onClick={() => handleVote(candidate._id, election._id, position)}
                                           disabled={hasVoted || voting[candidate._id]}
                                           className={`min-w-[120px] font-medium transition-all duration-300 ${
                                             voting[candidate._id]
                                               ? 'bg-amber-500 hover:bg-amber-600 text-white scale-105'
                                               : hasVoted
                                               ? 'bg-green-500 hover:bg-green-600 text-white cursor-not-allowed'
                                               : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-105 shadow-lg hover:shadow-xl'
                                           }`}
                                         >
                                           {voting[candidate._id] ? (
                                             <div className="flex items-center gap-2">
                                               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                               Voting...
                                             </div>
                                           ) : hasVoted ? (
                                             <div className="flex items-center gap-2">
                                               <CheckCircle className="h-4 w-4" />
                                               Voted
                                             </div>
                                           ) : (
                                             <div className="flex items-center gap-2">
                                               <Vote className="h-4 w-4" />
                                               Vote
                                             </div>
                                           )}
                                         </Button>
                                       </div>
                                     </div>
                                   </div>
                                 ))}
                               </div>
                             )}
                           </CardContent>
                         </Card>
                       );
                     })}
                   </div>
                 </div>
               );
             })
           )}
         </div>
       </div>
  );
}
