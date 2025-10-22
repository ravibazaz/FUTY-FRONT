import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Stores from "@/lib/models/Stores";

export async function GET(req) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  await connectDB();
  const stores = await Stores.find({},"title image").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Store List!",
    data: stores


  });
}
