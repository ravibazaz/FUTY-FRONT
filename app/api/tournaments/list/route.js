import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Tournaments from "@/lib/models/Tournaments";
import Grounds from "@/lib/models/Grounds";
import Teams from "@/lib/models/Teams";
import mongoose from "mongoose";
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const { user } = authResult;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page")) || 1; // current page (default 1)
  const limit = parseInt(searchParams.get("limit")) || 10; // items per page (default 10)
  const skip = (page - 1) * limit;

  const query = {
    ...(q && { name: { $regex: q, $options: 'i' } }),
  };


  const total = await Tournaments.countDocuments(query);

  const tournaments = await Tournaments.find(query).populate('ground').populate({
    path: "club",
    populate: {
      path: "age_groups",
    },
  }).populate({
    path: 'tournamentorderhistories',
    match: { created_by_user_Id: user._id }
  }).populate({
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
  }).select("-__v").skip(skip)
    .limit(limit)
    .sort({ date: -1 }) // optional sorting
    .lean();


  // for (let t of tournaments) {
  //   if (!t.club?.age_groups) continue;

  //   for (let ag of t.club.age_groups) {
  //     const clubId = String(t.club._id);
  //     const ageGroupId = String(ag._id);

  //     const total = await Teams.countDocuments({
  //       club: {
  //         $in: [
  //           clubId,
  //           new mongoose.Types.ObjectId(clubId),
  //         ],
  //       },
  //       age_groups: {
  //         $in: [
  //           ageGroupId,
  //           new mongoose.Types.ObjectId(ageGroupId),
  //         ],
  //       },
  //     });

  //     console.log("COUNT:", total+' '+clubId+' '+ageGroupId);

  //     ag.totalTeams = total;
  //   }
  // };


  for (let t of tournaments) {
  if (!t.club?.age_groups) continue;

  t.club.age_groups = await Promise.all(
    t.club.age_groups.map(async (ag) => {
      const clubId = String(t.club._id);
      const ageGroupId = String(ag._id);

      const total = await Teams.countDocuments({
        club: {
          $in: [clubId, new mongoose.Types.ObjectId(clubId)],
        },
        age_groups: {
          $in: [ageGroupId, new mongoose.Types.ObjectId(ageGroupId)],
        },
      });

       console.log("COUNT:", total+' '+clubId+' '+ageGroupId);
       
      return {
        ...ag,
        totalTeams: total, // ✅ new object instead of mutation
      };
    })
  );
}


  return NextResponse.json({
    success: true,
    message: "Welcome to the Tournament List!",
    data: tournaments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },


  });
}
