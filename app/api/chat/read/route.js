// app/api/chat/read/route.js
import { chatManager } from "@/lib/chatManager";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import Conversation from "@/lib/models/Conversation";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
export async function POST(req) {
  const body = await req.json(); // { room, userId, messageIds: [] }
  const { room, userId } = body;

  if (!room || !userId) {
    return NextResponse.json(
      { success: false, message: "Missing room or userId" },
      { status: 200 }
    );
  }
  await connectDB();
  // ✅ find all unread messages for this user in this room
  const unreadMessages = await Message.find({
    roomId: room,
    receiverId: userId,
    status: { $ne: "seen" }
  }).select("_id");

  const messageIds = unreadMessages.map(m => m._id);

  if (messageIds.length > 0) {
    await Message.updateMany(
      { _id: { $in: messageIds } },
      { $set: { status: "seen", seenAt: new Date() } }
    );
  }
  // const objectIds = messageIds.map(
  //   id => new mongoose.Types.ObjectId(id)
  // );
  // await Message.updateMany(
  //   { _id: { $in: objectIds }, roomId: room },
  //   { $set: { status: "seen", seenAt: new Date() } }
  // );
  // Optionally decrease unread count for this user in Conversation
  await Conversation.updateOne(
    { roomId: room },
    { $set: { [`unreadCount.${userId}`]: 0 } }
  );

  const roomInst = chatManager.getRoom(room);
  roomInst.send("read", { userId, messageIds, time: Date.now() });

  return NextResponse.json(
    {
      success: true,
    },
    { status: 200 }
  );


}
