import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Friendlies from "@/lib/models/Friendlies";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
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

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);


  // Tomorrow start
  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(todayStart.getDate() + 1);

  // Tomorrow end
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setHours(23, 59, 59, 999);

  // const friendlies = await Friendlies.find({},'name images date time').select("-__v").lean();

  const all_friendlies_created_others = await Friendlies.find({
    created_by_user: { $ne: user._id },
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



  const all_friendlies_created_me_accepted_by_others = await Friendlies.find({
    accepted_by_user: { $exists: true, $ne: null },
    created_by_user: user._id
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


  const all_friendlies_created_me_not_accepted = await Friendlies.find({
    accepted_by_user: { $exists: false, $eq: null },
    created_by_user: user._id
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


  const todays_friendlies_created_me = await Friendlies.find({
    date: {
      $gte: todayStart,
      $lte: todayEnd,
    },
    created_by_user: user._id

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


  const upcomings_friendlies_created_me_and_others = await Friendlies.find({

    date: {
      $gte: tomorrowStart
    },
    $or: [
      {
        created_by_user: user._id,
        accepted_by_user: { $exists: true, $nin: [null, user._id] },
      },
      {
        created_by_user: { $ne: user._id },
        accepted_by_user: user._id,
      },
    ],
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


  const archive_friendlies_created_me = await Friendlies.find({
    date: {
      $lt: todayStart
    },
    created_by_user: user._id
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
  return NextResponse.json({
    success: true,
    message: "Welcome to the friendlies List!",
    data: {
      'all_friendlies_created_others': all_friendlies_created_others,
      'all_friendlies_created_me_not_accepted': all_friendlies_created_me_not_accepted,
      'all_friendlies_created_me_accepted_by_others': all_friendlies_created_me_accepted_by_others,
      'todays_friendlies_created_me': todays_friendlies_created_me,
      'upcomings_friendlies_created_me_and_others': upcomings_friendlies_created_me_and_others,
      'archive_friendlies_created_me': archive_friendlies_created_me
    }
  });
}