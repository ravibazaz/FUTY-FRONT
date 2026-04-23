// app/api/signup/route.js
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";
import ManagerInvitations from "@/lib/models/ManagerInvitations";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import AgeGroups from "@/lib/models/AgeGroups";
export const UserSchema = z.object({
  manager_invitation_code: z.string().nonempty("Invitation Code is required").min(10, "Invitation Code must be at least 10 character")
});

export async function POST(req) {
  try {
    const data = await req.json();
    const manager_invitation_code = data.manager_invitation_code;
    //console.log(data.manager_invitation_code);
    const result = UserSchema.safeParse(data);
    //console.log(data);
    // If validation fails, return an error response
    if (!result.success) {
      // Flatten errors to match your desired response structure
      const errors = result.error.flatten().fieldErrors;

      // Get the first error message from the flattened errors
      const firstErrorMessage = Object.values(errors)
        .flat()
        .filter(Boolean)[0] || "Validation failed";

      return NextResponse.json(
        {
          success: false,
          message: firstErrorMessage
        },
        { status: 200 }
      );
    }
    await connectDB();

    const existing = await ManagerInvitations.findOne({ manager_invitation_code: result.data.manager_invitation_code }, 'manager_email manager_name manager_phone manager_nick_name manager_address').select("-__v").populate({
      path: "team_id",
      select: "name image club age_groups",
      populate: [
        {
          path: "club",
          model: "Clubs",
          select: "label name image league",
          populate: {
            path: "league",
            model: "Leagues",
            select: "label title image"
          }
        },
        {
          path: "age_groups",
          model: "AgeGroups", // replace with your actual model name
          select: "label age_group" // whatever fields you want
        }
      ]
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
    console.log(err);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 200 }
    );
  }
}
