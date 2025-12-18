import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
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
    ...(q && { title: { $regex: q, $options: 'i' } }),
  };


  const total = await Leagues.countDocuments(query);
  const leagues = await Leagues.find(query, "title image").populate('age_groups', 'age_group').skip(skip)
    .limit(limit)
    .sort({ _id: -1 }) // optional sorting
    .lean();;

  return NextResponse.json({
    success: true,
    message: "Welcome to the League List!",
    data: leagues,
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
