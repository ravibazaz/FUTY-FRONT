import { NextResponse } from "next/server";
import User from "@/lib/models/Users";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const isActive = searchParams.get("isActive");

  const existing = await User.findByIdAndUpdate(id, {
    isActive: isActive
  });

  return NextResponse.json({ 'msg': isActive });
}
