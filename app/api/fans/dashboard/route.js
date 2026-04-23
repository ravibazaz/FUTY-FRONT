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

  let league_friendly_by_priority1 = '';
  let league_friendly_by_priority2 = '';
  const fan_manger_id = user?.fan_manger_id;
  const userLeagueId = user?.team_id?.club?.league?._id;

  const randomLeague = await Leagues.aggregate([
    { $match: { _id: { $ne: userLeagueId } } },
    { $sample: { size: 1 } },
    { $project: { _id: 1 } }
  ]);

  // console.log(randomLeague);
  league_friendly_by_priority1 = await Friendlies.findOne({
    date: {
      $gte: todayStart
    },
    league_id: userLeagueId,
    created_by_user: fan_manger_id,
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




  if (!league_friendly_by_priority1) {
    //console.log(league_friendly_by_priority1);
    league_friendly_by_priority1 = await Friendlies.findOne({
      date: {
        $gte: todayStart
      },
      league_id: userLeagueId,
      created_by_user: { $ne: fan_manger_id },
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

  }


  if (!league_friendly_by_priority1) {
    // console.log(userLeagueId);
    // 1️⃣ Build base filter for leagues
    const leagueFilter = {
      // optional: only upcoming
      date: { $gte: todayStart },

      // optional: exclude user league
      ...(userLeagueId && { league_id: { $ne: userLeagueId } })
    };

    // 2️⃣ Get only leagues that actually have friendlies
    const leagueIds = await Friendlies.distinct("league_id", leagueFilter);

    if (!leagueIds.length) {
      return null; // no data available
    }

    // 3️⃣ Pick random league
    const randomLeague =
      leagueIds[Math.floor(Math.random() * leagueIds.length)];

    // 4️⃣ Build query for friendlies of that league
    const baseQuery = {
      league_id: randomLeague,
      // optional: only upcoming
      date: { $gte: todayStart },
    };

    // 5️⃣ Count records in that league
    const count = await Friendlies.countDocuments(baseQuery);

    if (!count) {
      return null; // safety (should not happen)
    }

    // 6️⃣ Random skip
    const randomSkip = Math.floor(Math.random() * count);

    league_friendly_by_priority1 = await Friendlies.findOne(baseQuery).skip(randomSkip).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").populate({
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
    //console.log(league_friendly_by_priority1);
  }


  league_friendly_by_priority2 = await Friendlies.findOne({
    date: {
      $gte: todayStart
    },
    _id: { $ne: league_friendly_by_priority1._id },
    league_id: userLeagueId,
    created_by_user: fan_manger_id,
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




  if (!league_friendly_by_priority2) {
    //console.log(league_friendly_by_priority1);
    league_friendly_by_priority2 = await Friendlies.findOne({
      date: {
        $gte: todayStart
      },
      league_id: userLeagueId,
      _id: { $ne: league_friendly_by_priority1._id },
      created_by_user: { $ne: fan_manger_id },
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

  }


  if (!league_friendly_by_priority2) {
    // console.log(userLeagueId);
    // 1️⃣ Build base filter for leagues
    const leagueFilter2 = {
      // optional: only upcoming
      date: { $gte: todayStart },

      // optional: exclude user league
      ...(userLeagueId && { league_id: { $ne: userLeagueId }, _id: { $ne: league_friendly_by_priority1._id } })
    };

    // 2️⃣ Get only leagues that actually have friendlies
    const leagueIds2 = await Friendlies.distinct("league_id", leagueFilter2);

    if (!leagueIds2.length) {
      return null; // no data available
    }

    // 3️⃣ Pick random league
    const randomLeague2 =
      leagueIds2[Math.floor(Math.random() * leagueIds2.length)];

    // 4️⃣ Build query for friendlies of that league
    const baseQuery2 = {
      league_id: randomLeague2,
      // optional: only upcoming
      date: { $gte: todayStart },
      _id: { $ne: league_friendly_by_priority1._id },
    };

    // 5️⃣ Count records in that league
    const count2 = await Friendlies.countDocuments(baseQuery2);

    if (!count2) {
      return null; // safety (should not happen)
    }

    // 6️⃣ Random skip
    const randomSkip2 = Math.floor(Math.random() * count2);

    league_friendly_by_priority2 = await Friendlies.findOne(baseQuery2).skip(randomSkip2).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").populate({
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
    //console.log(league_friendly_by_priority1);
  }




  // console.log(fan_manger_id);

  const show_next_applicable_friendly_created_by_others_recent_date_limit_one = await Friendlies.findOne({
    created_by_user: { $ne: fan_manger_id },
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
    date: {
      $gte: todayStart
    },
    created_by_user: fan_manger_id,
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


  const players = await Users.findOne({ _id: user._id }, "profile_image name surname").populate({
    path: "fan_manger_id",
    select: "name team_id",
    populate: {
      path: "team_id",
      model: "Teams",
      select: "label name image club age_groups ground",
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
        },
        {
          path: "ground",
          model: "Grounds", // replace with your actual model name
          select: "label name images" // whatever fields you want
        }
      ]
    }
  }).lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Fan Dashboard!",
    data: {
      fan_profile: players,
      random_advert: random_advert,
      show_next_applicable_friendly_created_by_others_recent_date_limit_one: show_next_applicable_friendly_created_by_others_recent_date_limit_one,
      the_managers_next_upcomng_schedule_friendly_recent_date_limit_one: the_managers_next_upcomng_schedule_friendly_recent_date_limit_one,
      league_friendly_by_priority1: league_friendly_by_priority1,
      league_friendly_by_priority2: league_friendly_by_priority2,
    }
  });
}
