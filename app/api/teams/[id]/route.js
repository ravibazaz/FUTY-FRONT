import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const id = (await params).id;
  console.log(id);

  // Otherwise, it means the user is authenticated
  await connectDB();
  const team = await Teams.findById(id).select("-__v").populate("age_groups", "age_group").populate({
    path: "club",
    select: "name image league",
    populate: {
      path: "league",
      model: "Leagues",
      select: "label title image", // whatever fields you want
    }
  }).populate("ground")
    .populate({
      path: "managers",
      select: "name profile_image",
    }).lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Team Detail Page!",
    data: team


  });
}
