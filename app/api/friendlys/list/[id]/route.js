import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Friendlies from "@/lib/models/Friendlies";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import Grounds from "@/lib/models/Grounds";
export async function GET(req,{ params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

const id = (await params).id;
;
  
  // Otherwise, it means the user is authenticated
  await connectDB();
  const tournaments = await Friendlies.findById(id).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").populate({
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
  }).populate({
    path: "accepted_by_user",
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
  }).lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Friendlies Details!",
    data: tournaments
  });
}
