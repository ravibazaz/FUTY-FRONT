// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import twilio from "twilio";
import { z } from "zod";
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
  fcmtoken: z.string().optional(),
  pre_signup_team: z.string().optional(),
  pre_signup_age_group: z.string().optional(),
  profile_image: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(val),
      {
        message: "Invalid image format. Must be a valid Base64-encoded image.",
      }
    ),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
}).superRefine((data, ctx) => {

});


const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);


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
    const fcmtoken = data.fcmtoken;
    const pre_signup_team = data.pre_signup_team;
    const pre_signup_age_group = data.pre_signup_age_group;
    const nick_name = data.nick_name;
    const referee_lavel = data.referee_lavel;
    let palyer_manger_id = null;
    let fan_manger_id = null;
    let team_id = null;
    const profile_image = data.profile_image;

    //console.log(data.invitation_code);

    const result = UserSchema.safeParse(data);
    //console.log(data);
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


    const existing_mobile = await User.findOne({ telephone: result.data.telephone });
    if (existing_mobile) {
      return NextResponse.json(
        {
          success: false,
          message: "This telephone already exists",
        },
        { status: 200 }
      );
    }

    let profile_image2 = "";
    try {

      const randomNumber = Math.floor(10000 + Math.random() * 90000);

      await client.messages.create({
        body: `Your Login OTP is ${randomNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: '+91' + telephone,
      });


      if (profile_image) {

        const matches = profile_image.match(/^data:(.+);base64,(.+)$/);
        const mimeType = matches[1];
        const base64Data = matches[2];
        const extension = mimeType.split("/")[1];
        const fileName = `${uuidv4()}.${extension}`;

        let uploadtype = "";
        if (account_type == "Player")
          uploadtype = "uploads/players";

        const uploadDir = path.join(process.cwd(), uploadtype);

        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        const buffer = Buffer.from(base64Data, "base64");
        await fs.writeFile(filePath, buffer);
        profile_image2 = `/` + uploadtype + `/${fileName}`;

      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newuser = await User.create({
        email,
        password: hashedPassword,
        palyer_manger_id: palyer_manger_id,
        fan_manger_id: fan_manger_id,
        team_id: team_id,
        name,
        surname,
        telephone,
        account_type,
        fcmtoken,
        pre_signup_age_group,
        pre_signup_team,
        nick_name,
        referee_lavel,
        profile_image: profile_image2,
        user_type: 'presignup',
      });

      await User.findByIdAndUpdate(newuser._id, { login_code: randomNumber });
      return NextResponse.json({
        success: true,
        data: {
          'Login OTP': randomNumber,
          'User Type': 'presignup',
          isVerified: false
        },
        message: "User created successfully. Please check login OTP in mobile.",
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
