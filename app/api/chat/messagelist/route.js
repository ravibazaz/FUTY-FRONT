// app/api/chat/history/route.js
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import Conversation from "@/lib/models/Conversation";
export async function GET(req) {

  const authResult = await protectApiRoute(req);
  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  const { user } = authResult;

  // console.log(user._id);
  // return ;

  await connectDB();
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || null;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const skip = (page - 1) * limit;

  const userId = user._id;
  console.log(userId);
  
  let query;

  if (type == 'manager') {
    query = {
      roomId: {
        $regex: `(^${userId}_|_${userId}$)`
      },
      conversation_type: {
        $in: ["Manager"]
      }
    };

  }
  else if (type == 'referee') {
    query = {
      roomId: {
        $regex: `(^${userId}_|_${userId}$)`
      },
      conversation_type: {
        $in: ["Referee"]
      }
    };
  }
  else if (type == 'unread') {
    query = {
      roomId: {
        $regex: `(^${userId}_|_${userId}$)`
      },
      [`unreadCount.${userId}`]: { $gt: 0 }
    };
  }
  else {
    query = {
      roomId: {
        $regex: `(^${userId}_|_${userId}$)`
      }
    };
  }
  const total = await Conversation.countDocuments(query);
  const messages = await Conversation.find(query)
    .sort({ createdAt: -1 })
    .populate({
      path: 'participants',
      match: { _id: { $ne: userId } }, // exclude logged-in user
      select: 'name surname nick_name profile_image' // optional: choose fields to return
    })
    .populate({
      path: 'lastMessage',
      select: 'text senderId receiverId createdAt status'
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
