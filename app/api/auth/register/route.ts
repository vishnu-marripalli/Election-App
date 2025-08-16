import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
export const dynamic = "force-dynamic"; 

export async function POST(req: NextRequest) {
  try {
    const { studentId, name, role, class: className, section } = await req.json();

    await dbConnect();

    const existingUser = await User.findOne({
      $or: [{ studentId }]
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'Student ID already exists' },
        { status: 400 }
      );
    }
  const password = "123456789"
  const email = "1@gmail.com"
    const user = new User({
      studentId,
      name,
      email,
      password,
      role: role || 'voter',
      class: className,
      section,
      isApproved: role === 'admin' ? true : false
    });

    await user.save();

    return NextResponse.json(
      { message: 'User registered successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}