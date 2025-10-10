import { connectDB } from '@/lib/db';
import Clubs from '@/lib/models/Clubs';
import Grounds from '@/lib/models/Grounds';

export async function GET(req) {
  await connectDB();
  const clubs = await Clubs.find();
  return Response.json({ clubs });
}