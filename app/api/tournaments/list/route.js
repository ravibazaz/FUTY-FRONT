import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Tournaments from "@/lib/models/Tournaments";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const tournaments = await Tournaments.find({},'name images date closing_date').select("-__v").lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the Tournament List!",
    data: tournaments


  });
}
