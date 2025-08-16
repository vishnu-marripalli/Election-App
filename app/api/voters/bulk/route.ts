import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import User from "@/models/User";

export const dynamic = "force-dynamic";

// POST /api/voters/bulk
export async function POST(req: Request) {
  try {
    await dbConnect();
    const voters = await req.json();

    // Ensure all uploaded users are voters
    const formattedVoters = voters.map((voter: any) => ({
      studentId: voter.studentId,
      name: voter.name,
      email: '!@gmail.com', // Placeholder email, should be replaced with actual email logic
      password: voter.password || "123456789", // fallback
      class: voter.class,
      section: voter.section || "",
      role: "voter",
      isApproved: true,
    }));
    await User.collection.dropIndex("email_1");


    await User.insertMany(formattedVoters);

    return NextResponse.json({ message: "Voters added successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error in bulk voter upload:", error);
    return NextResponse.json({ error: "Failed to add voters" }, { status: 500 });
  }
}
