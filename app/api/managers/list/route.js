import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';
import Teams from "@/lib/models/Teams";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  await connectDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const query = {
    account_type: "Manager",
    ...(q && { name: { $regex: q, $options: 'i' } }),
  };

  const managers = await Users.find(query, "profile_image name surname").populate({
        path: "team_id",
        select: "name club",
        populate: {
          path: "club",
          model: "Clubs",
          select: "label name league", // whatever fields you want
          populate: {
            path: "league",
            model: "Leagues",
            select: "label title", // whatever fields you want
          }
        }
      }).lean();




  return NextResponse.json({
    success: true,
    message: "Welcome to the Manager List!",
    data: managers


  });
}
