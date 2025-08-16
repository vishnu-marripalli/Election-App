import { NextResponse } from "next/server";
import dbConnect from '@/lib/mongodb';
import User from "@/models/User";

// Make sure this route is always dynamic (not static)
export const dynamic = "force-dynamic";

// GET /api/users/[id]
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Try finding by Mongo _id or studentId
    const user =
      (await User.findById(id).select("-password")) ||
      (await User.findOne({ studentId: id }).select("-password"));

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
