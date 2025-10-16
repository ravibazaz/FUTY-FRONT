import { connectDB } from '@/lib/db';
import Leagues from '@/lib/models/Leagues';

export async function GET(req) {
  await connectDB();

  const leagues = await Leagues.find({isActive:true});
  return Response.json({ leagues });
}
