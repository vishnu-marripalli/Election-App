import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Vote from '@/models/Vote';
import Candidate from '@/models/Candidate';
import User from '@/models/User';

export async function GET(req: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get("electionId");

    if (!electionId) {
      return NextResponse.json(
        { success: false, message: "Election ID is required" },
        { status: 400 }
      );
    }

    const count = await Vote.countDocuments({ electionId });

    return NextResponse.json(
      { success: true, electionId, totalVoters: count },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    const { voterId,candidateId, electionId, position } = await req.json();

    await dbConnect();

    // Check if user has already voted for this position in this election
    const existingVote = await Vote.findOne({
      voterId: voterId,
      electionId,
      position
    });

    if (existingVote) {
      return NextResponse.json(
        { message: 'You have already voted for this position' },
        { status: 400 }
      );
    }

    // Create the vote
    const vote = new Vote({
      voterId: voterId,
      candidateId,
      electionId,
      position
    });

    await vote.save();

    // Update candidate vote count
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    // Update user's voting status
    await User.findByIdAndUpdate(
      voterId,
      { $set: { [`hasVoted.${electionId}.${position}`]: true } }
    );

    return NextResponse.json({ message: 'Vote cast successfully' }, { status: 201 });
  } catch (error) {
    console.error('Vote error:', error);
    return NextResponse.json({ message: 'Failed to cast vote' }, { status: 500 });
  }
}