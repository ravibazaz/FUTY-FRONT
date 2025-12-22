// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from '@/lib/jwt';
import AgeGroups from "@/lib/models/AgeGroups";
import PlayerInvitations from "@/lib/models/PlayerInvitations";

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
    const useremail = await User.findOne({ email: result.data.email }).select("-__v").lean();
    if (!useremail) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email address.",
        },
        { status: 200 }
      );
    }

    if (useremail && useremail.isVerified == false) {
      return NextResponse.json(
        {
          success: false,
          message: "This email is not verified. Please verify first.",
        },
        { status: 200 }
      );
    }
    if (useremail && useremail.isActive == false) {
      return NextResponse.json(
        {
          success: false,
          message: "User is inactivated. Please contact to support team.",
        },
        { status: 200 }
      );
    }

   

    const user = await User.findOne({ email: result.data.email, isVerified: true, isActive: true }).populate({
      path: "palyer_manger_id",
      select: "name team_id",
      populate: {
        path: "team_id",
        model: "Teams",
        select: "label name club",
        populate: {
          path: "club",
          model: "Clubs",
          select: "label name league", // whatever fields you want
          populate: {
            path: "league",
            model: "Leagues",
            select: "label title", // whatever fields you want
          }
        }
      }
    }).populate({
      path: "team_id",
      select: "name club",
      populate: {
        path: "club",
        model: "Clubs",
        select: "label name league", // whatever fields you want
        populate: {
          path: "league",
          model: "Leagues",
          select: "label title", // whatever fields you want
        }
      }
    }).select("-__v").lean();
    if (!user || !(await bcrypt.compare(result.data.password, user.password))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid password. Please try again.",
        },
        { status: 200 }
      );
    }

    const token = await generateToken({ email: user.email, user_id: user.id });

    const existing = await PlayerInvitations.findOne({ player_email: user.email })
    //console.log(existing);
    
    return NextResponse.json({
      success: true,
      message: "Login successfully",
      data: { ...user, nick_name: user.account_type === "Player" && existing  ? existing.player_nick_name : user.nick_name },
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
