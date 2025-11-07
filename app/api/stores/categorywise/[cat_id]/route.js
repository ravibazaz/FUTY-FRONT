import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Stores from "@/lib/models/Stores";
export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const cat_id = (await params).cat_id;
  console.log(cat_id);

  // Otherwise, it means the user is authenticated
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  const query = {
    ...(q && { title: { $regex: q, $options: 'i' } }),
    ...(cat_id && { category: cat_id }),
  };

  const stores = await Stores.find(query, "title image price category").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Product Details!",
    data: stores

  });
}
