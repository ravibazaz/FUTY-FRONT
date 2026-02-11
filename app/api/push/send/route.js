import admin from "@/lib/firebaseAdmin";
import { NextResponse } from "next/server";

export const runtime = "nodejs"

export async function POST(req) {

  const { token, title, body, data = {} } = await req.json();
  try {
    const message = {
      token,
      notification: {
        title,
        body,
      },
      data,
    };
   // console.log(admin);
    
    const response = await admin.messaging().send(message);
    return NextResponse.json({
      success: true,
      messageId: response
    }, { status: 200 });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err.message
    }, { status: 200 });
  }
}
