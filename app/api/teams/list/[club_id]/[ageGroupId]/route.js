import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Teams from "@/lib/models/Teams";
import AgeGroups from "@/lib/models/AgeGroups";
import mongoose from 'mongoose';
export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const type = searchParams.get('type');
  const id = (await params).club_id;
  const ageGroupId = (await params).ageGroupId;
  console.log(q);

  const query = {
    ...(q && { name: { $regex: q, $options: 'i' } }),
  };

  // Otherwise, it means the user is authenticated
  await connectDB();
let managers='';
  if (type == "club") {
    managers = await Teams.find({
      ...query,
      club: id,
      age_groups: ageGroupId  // 🔥 only this is enough
    }, 'name image').populate({
      path: "club",
      select: "name secretary_name secretary_website phone cwo_name cwo_phone cwo_email email image"
    }).populate('age_groups').select("-__v").lean();

  }

  if (type == "league") {
     managers = await Teams.aggregate([
      { $match: { age_groups: new mongoose.Types.ObjectId(ageGroupId) } },
      {
        $lookup: {
          from: 'clubs',
          localField: 'club',
          foreignField: '_id',
          as: 'club'
        }
      },
      { $unwind: '$club' },
      { $match: { 'club.league': new mongoose.Types.ObjectId(id) } },

      {
        $lookup: {
          from: 'agegroups',
          localField: 'age_groups',
          foreignField: '_id',
          as: 'age_groups'
        }
      },
      { $unwind: '$age_groups' },
      {
        $project: {
          name: 1,
          image: 1,
          club: { name: 1, image: 1, secretary_name: 1, secretary_website:1, cwo_name:1, cwo_phone:1, cwo_email:1, phone: 1, email: 1 },
          age_groups: 1
        }
      }
    ]);


  }



  return NextResponse.json({
    success: true,
    message: `Welcome to the Team list by ${type} id and age group id!`,
    data: managers


  });
}
