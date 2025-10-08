import { NextResponse } from "next/server";
import User from "@/lib/models/Users";
import { connectDB } from "@/lib/db";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  if (!email) {
    return NextResponse.json({ exists: false });
  }

  const query = id
    ? { email, _id: { $ne: id } }
    : { email };

  const existing = await User.findOne(query);

  return NextResponse.json({ exists: !!existing });
}
