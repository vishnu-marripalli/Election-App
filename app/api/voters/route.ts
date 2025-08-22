import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import User from "@/models/User";

export const dynamic = "force-dynamic";

// GET /api/voters
export async function GET() {
  try {
    await dbConnect();
    const voters = await User.find({ role: "voter" }).select("-password");
// console.log("Fetched voters:", voters);
    return NextResponse.json(voters, { status: 200 });
  } catch (error) {
    console.error("Error fetching voters:", error);
    return NextResponse.json({ error: "Failed to fetch voters" }, { status: 500 });
  }
}
