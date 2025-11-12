import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function GET(req) {
  await connectDB();
  const referees = await Users.find({ account_type: "Referee"});
  return Response.json({ referees });
}