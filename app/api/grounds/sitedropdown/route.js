import { connectDB } from '@/lib/db';
import Grounds from '@/lib/models/Grounds';

export async function GET(req) {
  await connectDB();
  const grounds = await Grounds.find();
  return Response.json({ grounds });
}