import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Clubs from "@/lib/models/Clubs";
export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const id = (await params).id;
  //console.log(id);

  // Otherwise, it means the user is authenticated
  await connectDB();
  const club = await Clubs.findById(id).select("-__v").populate('league').lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Club Details",
    data: club


  });
}
