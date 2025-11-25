// app/api/chat/send/route.js
import { chatManager } from "@/lib/chatManager";
import { connectDB } from "@/lib/db";
import Message from "@/lib/models/Message";
import Conversation from "@/lib/models/Conversation";

export async function POST(req) {
  const body = await req.json();
  const { room, senderId, receiverId, text, attachments = [] } = body;
  if (!room || !senderId || !receiverId || (!text && attachments.length === 0)) {
    return new Response(JSON.stringify({ success: false, message: "Missing fields" }), { status: 400 });
  }

  await connectDB();

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
  await Conversation.findOneAndUpdate(
    { roomId: room },
    { $set: { lastMessageAt: new Date() }, $inc: { [`unreadCount.${receiverId}`]: 1 } },
    { upsert: true }
  );

  // Broadcast on room
  const roomInst = chatManager.getRoom(room);
  roomInst.send("message", {
    type: "message",
    message: {
      _id: msg._id,
      roomId: msg.roomId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.text,
      attachments: msg.attachments,
      status: msg.status,
      createdAt: msg.createdAt
    }
  });

  return new Response(JSON.stringify({ success: true, message: msg }), { status: 200 });
}
