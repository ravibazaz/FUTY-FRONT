import { connectDB } from '@/lib/db';
import Teams from '@/lib/models/Teams';

export async function GET(req) {
  await connectDB();
  const teams = await Teams.find();
  return Response.json({ teams });
}