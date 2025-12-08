import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Grounds from "@/lib/models/Grounds";
import Clubs from "@/lib/models/Clubs";
import GroundFacilities from "@/lib/models/GroundFacilities";
import Teams from "@/lib/models/Teams";

export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const id = (await params).id;

  // Otherwise, it means the user is authenticated
  await connectDB();
  const grounds = await Grounds.findById(id).populate('facilities').select("-__v").lean();


  const teams = await Teams.find({ ground: id })
    .populate("club")
    .select("-__v")
    .lean();

  // Extract unique clubs
  const uniqueClubs = [
    ...new Map(
      teams.map((t) => [t.club._id.toString(), t.club])
    ).values()
  ];



  return NextResponse.json({
    success: true,
    message: "Welcome to the Ground Details!",
   data: {
      grounds,
      uniqueClubs
    },
  });
}
