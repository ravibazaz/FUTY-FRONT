import { connectDB } from '@/lib/db';
import GroundFacilities from '@/lib/models/GroundFacilities';

export async function GET(req) {
  await connectDB();
  const groundfacilities = await GroundFacilities.find();
  return Response.json({ groundfacilities });
}