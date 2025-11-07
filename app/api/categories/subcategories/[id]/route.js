import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Categories from "@/lib/models/Categories"
export async function GET(req, { params }) {
  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  const parent_cat_id = (await params).id;
  // console.log(parent_cat_id);

  // Otherwise, it means the user is authenticated
  await connectDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  // Build query conditions dynamically
  const query = {
    ...(q && { title: { $regex: q, $options: "i" } }),
    ...(parent_cat_id && { parent_cat_id }), // ✅ filter by parent_cat_id if provided
  };

  const categories = await Categories.find(query, "title image content parent_cat_id").lean();

  return NextResponse.json({
    success: true,
    message: "Welcome to the Sub Categories List by main category Id",
    data: categories


  });

}
