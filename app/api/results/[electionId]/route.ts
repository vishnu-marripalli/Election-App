import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import Vote from '@/models/Vote';

export async function GET(req: NextRequest, { params }: { params: { electionId: string } }) {
  try {
    await dbConnect();

    // Get all candidates for this election with vote counts
    const candidates = await Candidate.find({ 
      electionId: params.electionId,
      isApproved: true 
    })
    .populate('userId', 'name studentId class photo')
    .sort({ position: 1, votes: -1 });

    // Group by position
    const results = candidates.reduce((acc, candidate) => {
      if (!acc[candidate.position]) {
        acc[candidate.position] = []; 
      }
      acc[candidate.position].push({
        id: candidate._id,
        name: candidate.userId.name,
        studentId: candidate.userId.studentId,
        class: candidate.userId.class,
        photo: candidate.userId.photo,
        motto: candidate.motto,
        votes: candidate.votes
      });
      return acc;
    }, {} as any);

    // Get total votes per position
    const totalVotes = await Vote.aggregate([
      { $match: { electionId: params.electionId } },
      { $group: { _id: '$position', count: { $sum: 1 } } }
    ]);

    const voteCounts = totalVotes.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as any);

    return NextResponse.json({ results, voteCounts });
  } catch (error) {
    console.error('Results error:', error);
    return NextResponse.json({ message: 'Failed to fetch results' }, { status: 500 });
  }
}