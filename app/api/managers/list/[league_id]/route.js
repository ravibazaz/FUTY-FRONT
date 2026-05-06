import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import mongoose from "mongoose";
export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  await connectDB();
  const { league_id } = params;
  // console.log(league_id);

  if (!mongoose.Types.ObjectId.isValid(league_id)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid league id",
      },
      { status: 200 }
    );
  }

  const leagueObjectId = new mongoose.Types.ObjectId(league_id);

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page")) || 1; // current page (default 1)
  const limit = parseInt(searchParams.get("limit")) || 10; // items per page (default 10)
  const skip = (page - 1) * limit;

  const matchStage = {
    account_type: "Manager",
    ...(q && {
      $or: [
        { name: { $regex: q, $options: "i" } },
        { surname: { $regex: q, $options: "i" } },
      ],
    }),
  };



  const pipeline = [
    // Managers only
    {
      $match: matchStage,
    },

    // team join
    {
      $lookup: {
        from: "teams",
        localField: "team_id",
        foreignField: "_id",
        as: "team_id",
      },
    },
    {
      $unwind: {
        path: "$team_id",
        preserveNullAndEmptyArrays: false,
      },
    },

    // club join
    {
      $lookup: {
        from: "clubs",
        localField: "team_id.club",
        foreignField: "_id",
        as: "team_id.club",
      },
    },
    {
      $unwind: {
        path: "$team_id.club",
        preserveNullAndEmptyArrays: false,
      },
    },

    // filter by league id
    {
      $match: {
        "team_id.club.league": leagueObjectId,
      },
    },

    // league join
    {
      $lookup: {
        from: "leagues",
        localField: "team_id.club.league",
        foreignField: "_id",
        as: "team_id.club.league",
      },
    },
    {
      $unwind: {
        path: "$team_id.club.league",
        preserveNullAndEmptyArrays: true,
      },
    },

    // sort latest first
    {
      $sort: { _id: -1 },
    },

    // pagination + total
    {
      $facet: {
        data: [
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              profile_image: 1,
              name: 1,
              surname: 1,
              team_id: {
                _id: 1,
                name: 1,
                club: {
                  _id: 1,
                  label: 1,
                  name: 1,
                  league: {
                    _id: 1,
                    label: 1,
                    title: 1,
                  },
                },
              },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Users.aggregate(pipeline);

  const managers = result[0]?.data || [];
  const total = result[0]?.totalCount?.[0]?.count || 0;

  return NextResponse.json({
    success: true,
    message: "Welcome to the Manager List by League Id!",
    data: managers,
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
