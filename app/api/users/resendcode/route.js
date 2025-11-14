// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";
import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
});

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
    const user = await User.findOne({ email: result.data.email }).select("-__v").lean();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Email does not exists",
        },
        { status: 200 }
      );
    }

    try {
      // Create transporter
      // const transporter = nodemailer.createTransport({
      //   host: process.env.SMTP_HOST,
      //   port: process.env.SMTP_PORT,
      //   secure: false, // true for 465, false for other ports
      //   auth: {
      //     user: process.env.SMTP_USER,
      //     pass: process.env.SMTP_PASS,
      //   },
      // });

      const min = 10000;
      const max = 99999;
      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      // console.log(randomNumber);
      // Send mail
      // await transporter.sendMail({
      //   from: `"${process.env.MAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
      //   to: user.email,
      //   subject: "Login Code",
      //   text: "We have sent a login code to you :" + randomNumber,
      //   html: `<p>We have sent a login code to you. Do not share this code to anyone!</p><p>Login Code : ${randomNumber}</p>`,
      // });

      const message = `<p>We have sent a login code to you. Do not share this code to anyone!</p><p>Login Code : ${randomNumber}</p>`;
      const subject = "Login Code";
      const res = await fetch(process.env.BREVO_REST_URL, {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: process.env.BREVO_MAIL_FROM, name: process.env.MAIL_FROM_NAME },
          to: [{ email: user.email }],
          subject: subject,
          htmlContent: `<p>${message}</p>`,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to send email");
      }


      await User.findByIdAndUpdate(user._id, { login_code: randomNumber, isVerified: false,isActive: false });

      return NextResponse.json({
        success: true,
        message: "Sent login code successfully",
      });
      // return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      //return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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
