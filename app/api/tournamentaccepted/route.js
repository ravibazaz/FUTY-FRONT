import { connectDB } from '@/lib/db';
import Tournaments from '@/lib/models/Tournaments';

export async function GET(req) {
  await connectDB();
  const tournaments = await Tournaments.find();
  return Response.json({ tournaments });
}