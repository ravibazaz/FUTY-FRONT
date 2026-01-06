import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';
import Adverts from "@/lib/models/Adverts";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import Friendlies from "@/lib/models/Friendlies";
import Grounds from "@/lib/models/Grounds";


export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const { user } = authResult;

  // Otherwise, it means the user is authenticated
  await connectDB();

  const now = new Date();

  // Monday start
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);

  // Sunday end
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  //const managers = await Users.find({ account_type: "Manager" }, "profile_image name surname").lean();

  const [random_advert] = await Adverts.aggregate([
    { $sample: { size: 1 } }, // pick 1 random doc
    { $project: { name: 1, image: 1, link: 1, content: 1 } } // select fields
  ]);


  const my_team = await Teams.findOne({ _id: user.team_id._id }, "name image").lean();
  const my_club = await Clubs.findOne({ _id: user.team_id?.club?._id }, "name image").lean();
  const my_league = await Leagues.findOne({ _id: user.team_id?.club?.league?._id }, "title image").lean();


  const show_next_applicable_friendly_created_by_others_recent_date_limit_one = await Friendlies.findOne({
    created_by_user: { $ne: user._id },
    accepted_by_user: { $exists: false, $eq: null },
  }).sort({ date: -1 }).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").populate({
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


  const the_managers_next_upcomng_schedule_friendly_recent_date_limit_one = await Friendlies.findOne({
    created_by_user: user._id,
  }).sort({ date: -1 }).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").populate({
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


  const friendlies_posted_in_this_week = await Friendlies.countDocuments({
    date: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  });

  const friendlies_accepted_in_this_week = await Friendlies.countDocuments({
    accepted_by_user: { $exists: true, $ne: null },
    date: {
      $gte: startOfWeek,
      $lte: endOfWeek,
    },
  });


  return NextResponse.json({
    success: true,
    message: "Welcome to the Manager Dashboard!",
    data: {
      random_advert: random_advert,
      my_team: my_team,
      my_club: my_club,
      my_league: my_league,
      show_next_applicable_friendly_created_by_others_recent_date_limit_one: show_next_applicable_friendly_created_by_others_recent_date_limit_one,
      the_managers_next_upcomng_schedule_friendly_recent_date_limit_one: the_managers_next_upcomng_schedule_friendly_recent_date_limit_one,
      activity: {
        friendlies_posted_in_this_week: friendlies_posted_in_this_week,
        friendlies_accepted_in_this_week: friendlies_accepted_in_this_week
      }
    },
  });
}
