// app/api/chat/stream/route.js
import { chatManager } from "@/lib/chatManager";
import { NextResponse } from "next/server";

export const config = {
  runtime: "nodejs",
  streaming: true,
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const room = searchParams.get("room");
  const userId = searchParams.get("user"); // optional for presence logic

  if (!room) {
    return NextResponse.json({ error: "room required" }, { status: 400 });
  }

  const roomInstance = chatManager.getRoom(room);


  
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // initial
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: "connected" })}\n\n`));

      // keepalive ping
      const ping = setInterval(() => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ ping: Date.now() })}\n\n`));
      }, 15000);

      // attach events
      const onEvent = (evt) => {
        controller.enqueue(encoder.encode(`data: ${evt.data}\n\n`));
      };

      roomInstance.addEventListener("event", onEvent);

      this.cleanup = () => {
        clearInterval(ping);
        roomInstance.removeEventListener("event", onEvent);
      };
    },

    cancel() {
      if (this.cleanup) this.cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
    },
  });
}
