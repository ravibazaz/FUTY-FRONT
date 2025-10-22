// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
export const UserSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required").min(7, "Password must be at least 7 character"),
  confirm_password: z.string().min(7, "Confirm password must be at least 7 characters long"),
  name: z.string().nonempty("Name is required").min(2, "Name must be at least 2 character"),
  telephone: z.string().nonempty("Telephone is required").min(2, "Telephone must be at least 2 character"),
  account_type: z.string().nonempty("Account Type is required").min(2, "Account Type must be at least 2 character"),
  profile_image: z
    .string()
    .nonempty("Profile image is required")
    .refine((val) => /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(val), {
      message: "Invalid image format. Must be a valid Base64-encoded image.",
    })
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

export async function POST(req) {
  try {
    const data = await req.json();
    const email = data.email;
    const password = data.password;
    const confirm_password = data.confirm_password;
    const name = data.name;
    const surname = data.surname;
    const telephone = data.telephone;
    const account_type = data.account_type;
    const profile_description = data.profile_description;
    const playing_style = data.playing_style;
    const club_id = data.club_id;
    const ground_id = data.ground_id;
    const profile_image = data.profile_image;



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
    const existing = await User.findOne({ email: result.data.email });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exists",
        },
        { status: 200 }
      );
    }

    const matches = profile_image.match(/^data:(.+);base64,(.+)$/);
    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1];
    const fileName = `${uuidv4()}.${extension}`;

    // Save to /public/uploads
    let uploadtype = "";
    if (account_type == "Manager")
      uploadtype = "uploads/managers";
    if (account_type == "Fan")
      uploadtype = "uploads/fans";
    if (account_type == "Refreee")
      uploadtype = "uploads/referees";

    const uploadDir = path.join(process.cwd(), uploadtype);

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(filePath, buffer);

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      name,
      surname,
      telephone,
      account_type,
      ground_id,
      club_id,
      profile_description,
      playing_style,
      profile_image: `/` + uploadtype + `/${fileName}`,


    });


    try {
      // Create transporter
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
      console.log(randomNumber);

      // Send mail
      await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: "Login Code",
        text: "We have sent a code to you :" + randomNumber,
        html: `<p>We have sent a code to you.</p><p>Login Code : ${randomNumber}</p>`,
      });

      return NextResponse.json({
        success: true,
        data: {
          'Login Code': randomNumber
        },
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
