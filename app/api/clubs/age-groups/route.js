import { connectDB } from '@/lib/db';
import Clubs from '@/lib/models/Clubs';
import AgeGroups from '@/lib/models/AgeGroups';
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const clubid = searchParams.get("clubid");

  const clubs = await Clubs.findById(clubid).select("age_groups").populate("age_groups").lean();
  return Response.json({ clubs });
}
