import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const candidate = await Candidate.findById(params.id);
    if (!candidate) {
      return NextResponse.json({ message: 'Candidate not found' }, { status: 404 });
    }

    candidate.isApproved = !candidate.isApproved;
    candidate.approvedBy = (session.user as any).id;
    await candidate.save();

    return NextResponse.json({ message: 'Candidate status updated', candidate });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update candidate' }, { status: 500 });
  }
}