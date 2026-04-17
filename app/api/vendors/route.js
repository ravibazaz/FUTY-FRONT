import { connectDB } from '@/lib/db';
import Vendors from '@/lib/models/Vendors';

export async function GET(req) {
  await connectDB();

  const adverts = await Vendors.find({isActive:true});
  return Response.json({ adverts });
}
