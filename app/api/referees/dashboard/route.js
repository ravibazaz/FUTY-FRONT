import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import AgeGroups from "@/lib/models/AgeGroups";
import Adverts from "@/lib/models/Adverts";
import Friendlies from "@/lib/models/Friendlies";
export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Otherwise, it means the user is authenticated
  await connectDB();

  const [random_advert] = await Adverts.aggregate([
    { $sample: { size: 1 } }, // pick 1 random doc
    { $project: { name: 1, image: 1, link: 1, content: 1 } } // select fields
  ]);

  const query = { date: { $gte: todayStart } };
  // 1. Get the total count of matches
  const count = await Friendlies.countDocuments(query);

  const random = Math.floor(Math.random() * count);


  let league_friendly_by_priority1 = await Friendlies.findOne(query).skip(random).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").populate({
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

  const referee = await Users.findOne({ _id: user._id }, "profile_image name surname referee_lavel referee_fee").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Referee Dashboard!",
    data: {
      referee_profile: referee,
      random_advert: random_advert,
      league_friendly_by_priority1: league_friendly_by_priority1,
    }

  });
}
