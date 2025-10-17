import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Teams from "@/lib/models/Teams";

export async function GET(req,{ params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

const club_id = (await params).club_id;
console.log(club_id);
  
  // Otherwise, it means the user is authenticated
  await connectDB();
  const managers = await Teams.find({club:club_id},'name image').select("-__v").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Manager List!",
    data: managers


  });
}
