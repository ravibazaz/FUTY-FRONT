import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Friendlies from "@/lib/models/Friendlies";
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import Grounds from "@/lib/models/Grounds";
import { getDistance } from "@/lib/geocode";
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

  const managerLng = user.location.coordinates[0];
  const managerLat = user.location.coordinates[1];



  const distance = getDistance(managerLat, managerLng, managerLat, managerLng)





  // const all_friendlies_created_others = await Friendlies.aggregate([

  //   // 1️⃣ Match first (reduce data early)
  //   {
  //     $match: {
  //       date: { $gte: todayStart },
  //       created_by_user: { $ne: user._id },
  //     }
  //   },

  //   // 2️⃣ Join Ground
  //   {
  //     $lookup: {
  //       from: "grounds",
  //       localField: "ground_id",
  //       foreignField: "_id",
  //       as: "ground"
  //     }
  //   },
  //   { $unwind: "$ground" },

  //   // 3️⃣ Calculate distance using GeoJSON coords
  //   {
  //     $addFields: {
  //       distance: {
  //         $let: {
  //           vars: {
  //             lat1: managerLat,
  //             lon1: managerLng,
  //             lat2: { $arrayElemAt: ["$ground.location.coordinates", 1] },
  //             lon2: { $arrayElemAt: ["$ground.location.coordinates", 0] }
  //           },
  //           in: {
  //             $multiply: [
  //               6371,
  //               {
  //                 $acos: {
  //                   $min: [ // safety fix
  //                     1,
  //                     {
  //                       $add: [
  //                         {
  //                           $multiply: [
  //                             { $cos: { $degreesToRadians: "$$lat1" } },
  //                             { $cos: { $degreesToRadians: "$$lat2" } },
  //                             {
  //                               $cos: {
  //                                 $subtract: [
  //                                   { $degreesToRadians: "$$lon2" },
  //                                   { $degreesToRadians: "$$lon1" }
  //                                 ]
  //                               }
  //                             }
  //                           ]
  //                         },
  //                         {
  //                           $multiply: [
  //                             { $sin: { $degreesToRadians: "$$lat1" } },
  //                             { $sin: { $degreesToRadians: "$$lat2" } }
  //                           ]
  //                         }
  //                       ]
  //                     }
  //                   ]
  //                 }
  //               }
  //             ]
  //           }
  //         }
  //       }
  //     }
  //   },

  //   // 4️⃣ Sort by nearest
  //   {
  //     $sort: { distance: 1 }
  //   },

  //   // 5️⃣ Now do your populates (converted to lookup)

  //   // team_id
  //   {
  //     $lookup: {
  //       from: "teams",
  //       localField: "team_id",
  //       foreignField: "_id",
  //       as: "team_id"
  //     }
  //   },
  //   { $unwind: { path: "$team_id", preserveNullAndEmptyArrays: true } },

  //   // manager_id
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "manager_id",
  //       foreignField: "_id",
  //       as: "manager_id"
  //     }
  //   },
  //   { $unwind: { path: "$manager_id", preserveNullAndEmptyArrays: true } },

  //   // league_id
  //   {
  //     $lookup: {
  //       from: "leagues",
  //       localField: "league_id",
  //       foreignField: "_id",
  //       as: "league_id"
  //     }
  //   },
  //   { $unwind: { path: "$league_id", preserveNullAndEmptyArrays: true } },

  //   // created_by_user
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "created_by_user",
  //       foreignField: "_id",
  //       as: "created_by_user"
  //     }
  //   },
  //   { $unwind: { path: "$created_by_user", preserveNullAndEmptyArrays: true } },

  //   // created_by_user.team
  //   {
  //     $lookup: {
  //       from: "teams",
  //       localField: "created_by_user.team_id",
  //       foreignField: "_id",
  //       as: "created_by_user.team_id"
  //     }
  //   },
  //   { $unwind: { path: "$created_by_user.team_id", preserveNullAndEmptyArrays: true } },

  //   // club
  //   {
  //     $lookup: {
  //       from: "clubs",
  //       localField: "created_by_user.team_id.club",
  //       foreignField: "_id",
  //       as: "created_by_user.team_id.club"
  //     }
  //   },
  //   { $unwind: { path: "$created_by_user.team_id.club", preserveNullAndEmptyArrays: true } },

  //   // league
  //   {
  //     $lookup: {
  //       from: "leagues",
  //       localField: "created_by_user.team_id.club.league",
  //       foreignField: "_id",
  //       as: "created_by_user.team_id.club.league"
  //     }
  //   },
  //   { $unwind: { path: "$created_by_user.team_id.club.league", preserveNullAndEmptyArrays: true } },

  //   // accepted_by_user
  //   {
  //     $lookup: {
  //       from: "users",
  //       localField: "accepted_by_user",
  //       foreignField: "_id",
  //       as: "accepted_by_user"
  //     }
  //   },
  //   { $unwind: { path: "$accepted_by_user", preserveNullAndEmptyArrays: true } },

  //   // accepted team
  //   {
  //     $lookup: {
  //       from: "teams",
  //       localField: "accepted_by_user.team_id",
  //       foreignField: "_id",
  //       as: "accepted_by_user.team_id"
  //     }
  //   },
  //   { $unwind: { path: "$accepted_by_user.team_id", preserveNullAndEmptyArrays: true } },

  //   // accepted club
  //   {
  //     $lookup: {
  //       from: "clubs",
  //       localField: "accepted_by_user.team_id.club",
  //       foreignField: "_id",
  //       as: "accepted_by_user.team_id.club"
  //     }
  //   },
  //   { $unwind: { path: "$accepted_by_user.team_id.club", preserveNullAndEmptyArrays: true } },

  //   // accepted league
  //   {
  //     $lookup: {
  //       from: "leagues",
  //       localField: "accepted_by_user.team_id.club.league",
  //       foreignField: "_id",
  //       as: "accepted_by_user.team_id.club.league"
  //     }
  //   },
  //   { $unwind: { path: "$accepted_by_user.team_id.club.league", preserveNullAndEmptyArrays: true } },

  //   // 7️⃣ Clean output
  //   {
  //     $project: {
  //       __v: 0
  //     }
  //   }

  // ]);




  const all_friendlies_created_others = await Friendlies.find({
    date: {
      $gte: todayStart,
    },
    accepted_by_user: null,
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
    date: {
      $gte: todayStart,
    },
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


  // Previous code
  // const all_friendlies_created_me_not_accepted = await Friendlies.find({
  //   date: {
  //     $gte: todayStart,
  //   },
  //   accepted_by_user: { $exists: false, $eq: null },
  //   created_by_user: user._id
  // }).sort({ date: -1 }).populate('team_id').populate('manager_id').populate('ground_id').populate('league_id').select("-__v").populate({
  //   path: "created_by_user",
  //   select: "name team_id",
  //   populate: {
  //     path: "team_id",
  //     model: "Teams",
  //     select: "label name image club", // whatever fields you want
  //     populate: {
  //       path: "club",
  //       model: "Clubs",
  //       select: "label name image league", // whatever fields you want
  //       populate: {
  //         path: "league",
  //         model: "Leagues",
  //         select: "label title", // whatever fields you want
  //       }
  //     }
  //   }
  // }).populate({
  //   path: "accepted_by_user",
  //   select: "name team_id",
  //   populate: {
  //     path: "team_id",
  //     model: "Teams",
  //     select: "label name image club", // whatever fields you want
  //     populate: {
  //       path: "club",
  //       model: "Clubs",
  //       select: "label name image league", // whatever fields you want
  //       populate: {
  //         path: "league",
  //         model: "Leagues",
  //         select: "label title", // whatever fields you want
  //       }
  //     }
  //   }
  // }).lean();


// if accepted_by_user is null or no value then this will be removed if todayStart is over if accepted_by_user is not null or has value then this will be there whatever date is


  const all_friendlies_created_me_not_accepted = await Friendlies.find({
    created_by_user: user._id,
    $or: [
      // ✅ Future records (keep always)
      {
        date: { $gte: todayStart }
      },

      // ✅ Accepted records (keep always, any date)
      {
        accepted_by_user: { $ne: null }
      }
    ]
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