// app/api/chat/typing/route.js
import { chatManager } from "@/lib/chatManager";

export async function POST(req) {
  const body = await req.json(); // { room, from, typing: true/false }
  const { room, from, typing } = body;
  if (!room || !from || typeof typing !== "boolean") {
    return new Response(JSON.stringify({ success: false, message: "Missing" }), { status: 400 });
  }

  const roomInst = chatManager.getRoom(room);
  roomInst.send("typing", { from, typing, time: Date.now() });
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
