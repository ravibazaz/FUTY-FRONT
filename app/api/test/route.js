// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET(req) {
  try {
    try {
      //Create transporter
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const min = 10000;
      const max = 99999;

      const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      // console.log(randomNumber);

      transporter.verify()
        .then(() => console.log("SMTP Connected"))
        .catch(console.error);


      // Send mail
      await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
        to: 'madan@outrightsolutions.net',
        subject: "Login Code",
        text: "We have sent a login code to you :" + randomNumber,
        html: `<p>We have sent a login code to you. Do not share this code to anyone!</p><p>Login Code : ${randomNumber}</p>`,
      });


      return NextResponse.json({
        success: true,
        message: "User created successfully. Please check login code in email.",
      });

      // return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Email error:", error);
      //return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 200 }
    );
  }
}
