// app/api/chat/presence/route.js
import { chatManager } from "@/lib/chatManager";
// optional: store presence in memory or DB

export async function POST(req) {
  const body = await req.json(); // { room, userId, status: 'online'|'offline' }
  const { room, userId, status } = body;
  if (!room || !userId || !status) {
    return new Response(JSON.stringify({ success: false, message: "Missing" }), { status: 400 });
  }

  const roomInst = chatManager.getRoom(room);
  roomInst.send("presence", { userId, status, time: Date.now() });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
