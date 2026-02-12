import Notification from "@/lib/models/Notification";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const userId = req.nextUrl.searchParams.get("userId");

  await connectDB();

  const list = await Notification.find({ userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json(list);
}
