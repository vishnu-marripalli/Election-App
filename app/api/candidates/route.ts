import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const electionId = searchParams.get('electionId');

    await dbConnect();

    let query = {};
    if (electionId) {
      query = { electionId };
    }

    const candidates = await Candidate.find(query)
      .populate('userId', 'name studentId class photo')
      .populate('electionId', 'title')
      .sort({ createdAt: -1 });

    return NextResponse.json(candidates, { status: 200, headers: {
        "Access-Control-Allow-Origin": "*", // allow all origins
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },});
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch candidates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { electionId, position, motto, manifesto, photo } = await req.json();

    await dbConnect();

    const existingCandidate = await Candidate.findOne({
      userId: (session.user as any).id,
      electionId,
      position
    });

    if (existingCandidate) {
      return NextResponse.json(
        { message: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    const candidate = new Candidate({
      userId: (session.user as any).id,
      electionId,
      position,
      motto,
      manifesto,
      photo
    });

    await candidate.save();

    return NextResponse.json(
      { message: 'Candidate application submitted successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create candidate error:', error);
    return NextResponse.json({ message: 'Failed to submit application' }, { status: 500 });
  }
}