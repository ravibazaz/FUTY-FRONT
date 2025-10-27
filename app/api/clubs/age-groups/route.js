import { connectDB } from '@/lib/db';
import Clubs from '@/lib/models/Clubs';
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const clubid = searchParams.get("clubid");

  const clubs = await Clubs.findById(clubid).select("-__v").lean();
  return Response.json({ clubs });
}
