import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Election from '@/models/Election';

export async function GET() {
  try {
    await dbConnect();
    const elections = await Election.find().populate('createdBy', 'name').sort({ createdAt: -1 });
return NextResponse.json(elections, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // allow all origins
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch elections' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, positions, startDate, endDate, eligibleClasses } = await req.json();

    await dbConnect();

    const election = new Election({
      title,
      description,
      positions,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdBy: (session.user as any).id,
      eligibleClasses
    });

    await election.save();

    return NextResponse.json({ message: 'Election created successfully', election }, { status: 201 });
  } catch (error) {
    console.error('Create election error:', error);
    return NextResponse.json({ message: 'Failed to create election' }, { status: 500 });
  }
}