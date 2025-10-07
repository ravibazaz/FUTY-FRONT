import { NextResponse } from "next/server";
import User from "@/lib/models/Users";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  const existing = await User.findOne({ email });
  return NextResponse.json({ exists: !!existing });
}
