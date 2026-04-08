import { connectDB } from '@/lib/db';
import Clubs from '@/lib/models/Clubs';
import AgeGroups from '@/lib/models/AgeGroups';
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const agegroupId = searchParams.get("agegroupId");

  const agegroupname = await AgeGroups.findById(agegroupId).select("age_group").lean();
  return Response.json({ agegroupname });
}
