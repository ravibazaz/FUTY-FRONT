// app/api/chat/history/route.js
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
export async function GET(req) {

  const authResult = await protectApiRoute(req);
  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  const { user } = authResult;


  await connectDB();
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;
  if (!room) return NextResponse.json({ success: false, message: "room required" }, { status: 400 });

  const total = await Message.countDocuments({ roomId: room });
  const messages = await Message.find({ roomId: room })
    .sort({ createdAt: -1 })
    .populate({
      path: 'senderId receiverId',
      select: 'name surname nick_name profile_image' // optional: choose fields to return
    })
    .skip(skip)
    .limit(limit)
    .lean();

  return NextResponse.json({
    success: true,
    data: messages.reverse(), // return oldest-first on the page
    pagination: {
      total, page, limit, totalPages: Math.ceil(total / limit)
    }
  });
}
