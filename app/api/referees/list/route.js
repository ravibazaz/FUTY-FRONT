import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  await connectDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const page = parseInt(searchParams.get("page")) || 1; // current page (default 1)
  const limit = parseInt(searchParams.get("limit")) || 10; // items per page (default 10)
  const skip = (page - 1) * limit;

  const query = {
    account_type: "Referee",
    ...(q && { name: { $regex: q, $options: 'i' } }),
  };

  const total = await Users.countDocuments(query);
  const referee = await Users.find(query, "profile_image name surname referee_lavel referee_fee").populate({
    path: "team_id",
    select: "name club",
    populate: {
      path: "club",
      model: "Clubs",
      select: "label name league", // whatever fields you want
      populate: {
        path: "league",
        model: "Leagues",
        select: "label title", // whatever fields you want
      }
    }
  })
    .skip(skip)
    .limit(limit)
    .sort({ _id: -1 }) // optional sorting
    .lean();


  return NextResponse.json({
    success: true,
    message: "Welcome to the Referees List!",
    data: referee,
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
