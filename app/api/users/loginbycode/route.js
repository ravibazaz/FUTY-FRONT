// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { generateToken } from '@/lib/jwt';
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import PlayerInvitations from "@/lib/models/PlayerInvitations";

export const UserSchema = z.object({
  login_code: z.string().nonempty("Login Code is required").min(5, "Login Code must be at least 5 character"),
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
    const user = await User.findOne({ login_code: result.data.login_code }).select("-__v").lean();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid code!",
        },
        { status: 200 }
      );
    }

    const token = await generateToken({ email: user.email, user_id: user.id });
    await User.findByIdAndUpdate(user._id, { isVerified: true, isActive: true });

    const updated_user = await User.findOne({ login_code: result.data.login_code }).select("-__v").populate({
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
    }).lean();

    const existing = await PlayerInvitations.findOne({ player_email: updated_user.email })
    return NextResponse.json({
      success: true,
      message: "Login successfully",
      data: { ...updated_user, nick_name: updated_user.account_type === "Player" ? existing.player_nick_name : updated_user.nick_name },
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
