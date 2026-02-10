// app/api/chat/typing/route.js
import { chatManager } from "@/lib/chatManager";
import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";

export async function POST(req) {

  const authResult = await protectApiRoute(req);
  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  const { user } = authResult;
  const from = user._id.toString();

  try {
    const body = await req.json(); // { room, from, typing: true/false }
    const { room, typing } = body;
    if (!room || !from || typeof typing !== "boolean") {
      return NextResponse.json(
        { success: false, message: "Missing room, or typing status" },
        { status: 200 }
      );
    }

    const roomInst = chatManager.getRoom(room);
    roomInst.send("typing", { from, typing, time: Date.now() });

    return NextResponse.json(
      { success: true, message: "Typing status updated" },
      { status: 200 }
    );
  } catch (err) {
    console.error("chat/typing error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 200 }
    );

  }



}
