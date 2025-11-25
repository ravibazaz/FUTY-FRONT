// app/api/chat/read/route.js
import { chatManager } from "@/lib/chatManager";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import Conversation from "@/lib/models/Conversation";
import mongoose from "mongoose";

export async function POST(req) {
  const body = await req.json(); // { room, userId, messageIds: [] }
  const { room, userId, messageIds = [] } = body;
  if (!room || !userId || !Array.isArray(messageIds)) {
    return new Response(JSON.stringify({ success: false, message: "Missing" }), { status: 400 });
  }

  await connectDB();

  const objectIds = messageIds.map(id => mongoose.Types.ObjectId(id));
  await Message.updateMany(
    { _id: { $in: objectIds }, roomId: room },
    { $set: { status: "seen", seenAt: new Date() } }
  );

  // Optionally decrease unread count for this user in Conversation
  await Conversation.updateOne(
    { roomId: room },
    { $set: { [`unreadCount.${userId}`]: 0 } }
  );

  const roomInst = chatManager.getRoom(room);
  roomInst.send("read", { userId, messageIds, time: Date.now() });

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
