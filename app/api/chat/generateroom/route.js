// app/api/chat/send/route.js
import { chatManager } from "@/lib/chatManager";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import Conversation from "@/lib/models/Conversation";
import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { getChatRoom } from "@/lib/chatHelpers";
import Users from "@/lib/models/Users";

export async function POST(req) {

  const authResult = await protectApiRoute(req);
  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  const { user } = authResult;

  const body = await req.json();
  const { receiverId, senderId } = body;
  if (!receiverId || !senderId) {
    return NextResponse.json(
      {
        success: false,
        message: "Missing fields"
      },
      { status: 200 }
    );
  }
  const room = getChatRoom(senderId, receiverId)
  return NextResponse.json(
    {
      success: true,
      message: {
        room
      }
    },
    { status: 200 }
  );


}
