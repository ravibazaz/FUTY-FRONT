import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Tournaments from "@/lib/models/Tournaments";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const tournaments = await Tournaments.find().populate('ground').populate('club').populate({
    path: "created_by_user",
    select: "name team_id",
    populate: {
      path: "team_id",
      model: "Teams",
      select: "label name image club", // whatever fields you want
      populate: {
        path: "club",
        model: "Clubs",
        select: "label name image league", // whatever fields you want
        populate: {
          path: "league",
          model: "Leagues",
          select: "label title", // whatever fields you want
        }
      }
    }
  }).select("-__v").lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the Tournament List!",
    data: tournaments


  });
}
