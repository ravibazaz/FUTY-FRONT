import { connectDB } from '@/lib/db';
import Friendlies from '@/lib/models/Friendlies';
export async function GET(req) {
  await connectDB();
  const friendlies = await Friendlies.find();
  return Response.json({ friendlies });
}