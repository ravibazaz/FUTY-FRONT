import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Friendlies from "@/lib/models/Friendlies";

export async function GET(req,{ params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

const id = (await params).id;
;
  
  // Otherwise, it means the user is authenticated
  await connectDB();
  const tournaments = await Friendlies.findById(id).select("-__v").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Friendlies Details!",
    data: tournaments


  });
}
