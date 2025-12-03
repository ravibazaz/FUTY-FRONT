import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const players = await Users.find({ account_type: "Player" },"profile_image name surname").lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the Player Dashboard!",
    data: null


  });
}
