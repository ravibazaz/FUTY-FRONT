import { connectDB } from '@/lib/db';
import AgeGroups from '@/lib/models/AgeGroups';

export async function GET(req) {
  await connectDB();
  const agegroups = await AgeGroups.find();
  return Response.json({ agegroups });
}