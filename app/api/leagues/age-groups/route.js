import { connectDB } from '@/lib/db';
import Leagues from '@/lib/models/Leagues';
import AgeGroups from '@/lib/models/AgeGroups';
export async function GET(req) {
  await connectDB();

    const { searchParams } = new URL(req.url);
  const league = searchParams.get("league");

  const leagues = await Leagues.findById(league,{isActive:true}).select("age_groups -__v").populate("age_groups").lean();
  return Response.json({ leagues });
}
