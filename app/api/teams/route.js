import { connectDB } from '@/lib/db';
import Leagues from '@/lib/models/Leagues';
import Teams from '@/lib/models/Teams';
import Clubs from '@/lib/models/Clubs';

export async function GET(req) {
  await connectDB();
  const teams = await Teams.find().populate({
    path: "club",
    select: "name league",
    populate: {
      path: "league",
      model: "Leagues",
      select: "label title" // whatever fields you want
    }
  })
  .lean();
  return Response.json({ teams });
}