import { connectDB } from '@/lib/db';
import Adverts from '@/lib/models/Adverts';

export async function GET(req) {
  await connectDB();

  const adverts = await Adverts.find({isActive:true});
  return Response.json({ adverts });
}
