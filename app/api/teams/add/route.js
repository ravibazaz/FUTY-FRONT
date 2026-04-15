import { connectDB } from '@/lib/db';
import Leagues from '@/lib/models/Leagues';
import Teams from '@/lib/models/Teams';
import Clubs from '@/lib/models/Clubs';
import Grounds from '@/lib/models/Grounds';
import Users from '@/lib/models/Users';
export async function GET(req) {
  await connectDB();

  const usedTeamIds = await Users.distinct("team_id");

  const { searchParams } = new URL(req.url);
  const selectedTeam = searchParams.get("selectedTeam");

  console.log(selectedTeam);
  
  const teams = await Teams.find({
    _id: { $nin: usedTeamIds }
  }).populate("ground", "name").populate({
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