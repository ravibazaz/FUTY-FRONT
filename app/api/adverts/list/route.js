import { NextResponse } from "next/server";
import { connectDB } from '@/lib/db';
import Adverts from "@/lib/models/Adverts";

export async function GET(req) {

  // Otherwise, it means the user is authenticated
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const query = {
    ...(q && { name: { $regex: q, $options: 'i' } }),
  };

  const adverts = await Adverts.find(query, "name image content link").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Adverts List!",
    data: adverts
  });
}
