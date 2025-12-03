import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function GET(req) {
  await connectDB();
  const players = await Users.find({ account_type: "Player"});
  return Response.json({ players });
}