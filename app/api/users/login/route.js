// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from '@/lib/jwt';
import AgeGroups from "@/lib/models/AgeGroups";

export const UserSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z
    .string()
    .nonempty("Password is required")
    .min(7, "Password must be at least 7 character"),
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
    //await AgeGroups.create({ age_group: "Adult" });
    const user = await User.findOne({ email: result.data.email,isVerified:true }).select("-__v").lean();
    if (!user || !(await bcrypt.compare(result.data.password, user.password))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password or not verified!",
        },
        { status: 200 }
      );
    }

    const token = await generateToken({ email: user.email,user_id: user.id });

    return NextResponse.json({
      success: true,
      message: "Login successfully",
      data: user,
      token: token,
    });
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
