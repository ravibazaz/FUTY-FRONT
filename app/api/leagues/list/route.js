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
  const leagues = await Leagues.find({},"title image").lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the League List!",
    data: leagues


  });
}
