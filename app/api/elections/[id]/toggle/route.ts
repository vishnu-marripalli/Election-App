import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Election from '@/models/Election';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || (session.user as any).role !== 'admin') {
    //   return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    // }

    await dbConnect();

    const election = await Election.findById(params.id);
    if (!election) {
      return NextResponse.json({ message: 'Election not found' }, { status: 404 });
    }

    election.isActive = !election.isActive;
    await election.save();

    return NextResponse.json({ message: 'Election status updated', election });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to update election' }, { status: 500 });
  }
}