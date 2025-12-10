import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

   const { user } = authResult;
  // Otherwise, it means the user is authenticated
  await connectDB();
  const tournamentaccepted = await TournamentOrderHistories.find({created_by_user_Id:user._id}).populate('tournament_Id').select("-__v").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Tournament Payment details!",
    data: tournamentaccepted


  });
}
