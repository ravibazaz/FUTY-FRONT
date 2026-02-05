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
  const { receiverId, text, attachments = [] } = body;
  if (!receiverId || (!text && attachments.length === 0)) {
    return new Response(JSON.stringify({ success: false, message: "Missing fields" }), { status: 400 });
  }
  const room = getChatRoom(user._id, receiverId)
  const senderId = user._id;
  await connectDB();

  const userdetails = await Users.findById(receiverId).select("account_type").lean();

  // console.log(userdetails);
  // return;

  // Save message
  const msg = await Message.create({
    roomId: room,
    senderId,
    receiverId,
    text,
    attachments,
    status: "sent",
  });

  // Update conversation meta
  // await Conversation.findOneAndUpdate(
  //   { roomId: room },
  //   { $set: { lastMessageAt: new Date() }, $inc: { [`unreadCount.${receiverId}`]: 1 } },
  //   { upsert: true }
  // );
  await Conversation.findOneAndUpdate(
    { roomId: room },
    {
      $set: { lastMessageAt: new Date() },
      $inc: { [`unreadCount.${receiverId}`]: 1 },
      $addToSet: {
        participants: { $each: [senderId, receiverId] },
        conversation_type: { $each: [user.account_type, userdetails.account_type] },
      }
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );


  const messages = await Message.findById(msg._id)
    .populate({
      path: 'senderId receiverId',
      select: 'name surname nick_name profile_image' // optional: choose fields to return
    })
    .select("-__v")
    .lean();


  // console.log(messages);

  // Broadcast on room
  const roomInst = chatManager.getRoom(room);
  roomInst.send(messages);


  return NextResponse.json(
    {
      success: true,
      message: msg
    },
    { status: 200 }
  );


}
