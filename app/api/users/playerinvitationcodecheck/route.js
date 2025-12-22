// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import PlayerInvitations from "@/lib/models/PlayerInvitations";
export const UserSchema = z.object({
  player_invitation_code: z.string().nonempty("Invitation Code is required").min(10, "Invitation Code must be at least 10 character")
});

export async function POST(req) {
  try {
    const data = await req.json();
    const player_invitation_code = data.player_invitation_code;
    //console.log(data.player_invitation_code);
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

    const existing = await PlayerInvitations.findOne({ player_invitation_code: result.data.player_invitation_code }).select("-__v").populate({
      path: "manager_id",
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
    }).lean();
    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Wrong invitation code. Check again.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
        {
          success: true,
          data: existing,
          message: "Found invitation code",
        },
        { status: 200 }
      );

  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 200 }
    );
  }
}
