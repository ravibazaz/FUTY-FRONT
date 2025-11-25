// app/api/chat/stream/route.js
import { chatManager } from "@/lib/chatManager";
import { NextResponse } from "next/server";

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

      // send keepalive / initial connected
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ event: "connected" })}\n\n`));

      // handler that receives MessageEvent from ChatRoom
      const onEvent = (evt) => {
        controller.enqueue(encoder.encode(`data: ${evt.data}\n\n`));
      };

      roomInstance.addEventListener("event", onEvent);

      // when stream is canceled (client disconnect), remove listener
      // Return a cleanup function (not all runtimes call it, but Node does)
      this.cleanup = () => {
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
      Connection: "keep-alive",
    },
  });
}
