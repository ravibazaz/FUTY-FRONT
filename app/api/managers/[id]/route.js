import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import AgeGroups from "@/lib/models/AgeGroups";
export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const id = (await params).id;
  console.log(id);

  // Otherwise, it means the user is authenticated
  await connectDB();
  const managers = await Users.findById(id).select("-__v").populate({
    path: "team_id",
    select: "name club age_groups",

      populate: [
    {
      path: "club",
      model: "Clubs",
      select: "label name image league",
      populate: {
        path: "league",
        model: "Leagues",
        select: "label title"
      }
    },
    {
      path: "age_groups",
      model: "AgeGroups", // replace with your actual model name
      select: "label age_group" // whatever fields you want
    }
  ]
   
  }).lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Manager List!",
    data: managers


  });
}
