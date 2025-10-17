import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Clubs from "@/lib/models/Clubs";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const grounds = await Clubs.find({},'name image secretary_name').select("-__v").lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the Club List!",
    data: grounds


  });
}
