import { NextResponse } from "next/server";
import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const body = await req.json();

    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number required" },
        { status: 400 }
      );
    }

    // Generate 6 digit OTP
    const otp = Math.floor(10000 + Math.random() * 90000);

    // TODO:
    // Store OTP in database/session/redis

    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    // await client.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
    //   to: phone,
    // });





    return NextResponse.json({
      success: true,
      otp, // REMOVE IN PRODUCTION
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "SMS sending failed",
      },
      { status: 500 }
    );
  }
}