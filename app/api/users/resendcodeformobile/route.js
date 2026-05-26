// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";
import { z } from "zod";
import twilio from "twilio";
export const UserSchema = z.object({
  telephone: z.string().nonempty("Telephone is required").min(2, "Telephone must be at least 2 character"),
});

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function POST(req) {
  try {
    const data = await req.json();

    const result = UserSchema.safeParse(data);
    // If validation fails, return an error response
    if (!result.success) {
      // Flatten errors to match your desired response structure
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: Object.fromEntries(
            Object.entries(errors).map(([key, value]) => [key, value[0]])
          ),
        },
        { status: 200 }
      );
    }
    await connectDB();
    const user = await User.findOne({ telephone: result.data.telephone }).select("-__v").lean();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Telephone does not exists",
        },
        { status: 200 }
      );
    }

    try {

      const randomNumber = Math.floor(10000 + Math.random() * 90000);
      await client.messages.create({
        body: `Your Login OTP is ${randomNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: '+91'+ result.data.telephone+'',
      });

      await User.findByIdAndUpdate(user._id, { login_code: randomNumber, isVerified: false, isActive: false });

      return NextResponse.json({
        success: true,
        message: "Sent login OTP successfully to your telephone",
      });
      // return NextResponse.json({ success: true });
    } catch (error) {
      console.error("SMS sending failed:", error);
      return NextResponse.json(
        {
          success: false,
          message: "SMS sending failed",
        },
        { status: 200 }
      );
      
    }


  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 200 }
    );
  }
}
