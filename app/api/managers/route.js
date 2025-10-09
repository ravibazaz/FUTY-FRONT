import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function GET(req) {
  await connectDB();
  const managers = await Users.find({ account_type: "Manager"});
  return Response.json({ managers });
}