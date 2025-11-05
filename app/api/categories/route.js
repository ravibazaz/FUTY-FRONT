import { connectDB } from '@/lib/db';
import Categories from '@/lib/models/Categories';

export async function GET(req) {
  await connectDB();

  const categories = await Categories.find({isActive:true});
  return Response.json({ categories });
}
