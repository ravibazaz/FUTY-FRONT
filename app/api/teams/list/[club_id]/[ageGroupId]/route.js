import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Teams from "@/lib/models/Teams";
import AgeGroups from "@/lib/models/AgeGroups";

export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const club_id = (await params).club_id;
  const ageGroupId = (await params).ageGroupId;
  console.log(q);

  const query = {
    ...(q && { name: { $regex: q, $options: 'i' } }),
  };

  // Otherwise, it means the user is authenticated
  await connectDB();
  const managers = await Teams.find({
    ...query,
    club: club_id,
    age_groups: ageGroupId  // 🔥 only this is enough
  }, 'name image').populate({
    path: "club",
    select: "name image"
  }).populate('age_groups').select("-__v").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Team list by club id and age group id!",
    data: managers


  });
}
