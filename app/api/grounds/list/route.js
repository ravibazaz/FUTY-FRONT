import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Grounds from "@/lib/models/Grounds";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const grounds = await Grounds.find({},'name images add1 add3 add2').select("-__v").lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the Ground List!",
    data: grounds


  });
}
