import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function GET(req,{ params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

const id = (await params).id;
console.log(id);
  
  // Otherwise, it means the user is authenticated
  await connectDB();
  const managers = await Users.findById(id).select("-__v").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Manager List!",
    data: managers


  });
}
