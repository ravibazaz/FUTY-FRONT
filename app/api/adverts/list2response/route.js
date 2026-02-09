import { NextResponse } from "next/server";
import { connectDB } from '@/lib/db';
import Adverts from "@/lib/models/Adverts";

export async function GET(req) {

  // Otherwise, it means the user is authenticated
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  // const query = {
  //   ...(q && { name: { $regex: q, $options: 'i' } }),
  //   pages: {
  //     $in: ["Manager", "Friendly"]
  //   }
  // };


const adverts = await Adverts.aggregate([
  {
    $match: {
      pages: { $in: ["Manager", "Friendly"] }
    }
  },
  {
    $sample: { size: 2 } // pick 2 random docs
  },
  {
    $project: {
      name: 1,
      image: 1,
      link: 1,
      content: 1,
      date: 1,
      time: 1,
      end_date: 1,
      end_time: 1,
      pages: 1
    }
  }
]);

//console.log(adverts); // will be an array of up to 2 docs



  return NextResponse.json({
    success: true,
    message: "Welcome to the Advertisement  List!",
    data: adverts
  });
}
