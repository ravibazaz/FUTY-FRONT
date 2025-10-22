import { connectDB } from '@/lib/db';
import Stores from '@/lib/models/Stores';

export async function GET(req) {
  await connectDB();

  const stores = await Stores.find({isActive:true});
  return Response.json({ stores });
}
