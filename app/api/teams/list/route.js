import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Teams from "@/lib/models/Teams";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const grounds = await Teams.find().populate({
    path: "club",
    select: "name league",
    populate: {
      path: "league",
      model: "Leagues",
      select: "label title" // whatever fields you want
    }
  })
  .select("-__v").lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the Teams List!",
    data: grounds


  });
}
