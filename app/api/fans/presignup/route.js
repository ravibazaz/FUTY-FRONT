import { connectDB } from '@/lib/db';
import Users from '@/lib/models/Users';

export async function GET(req) {
  await connectDB();
  const fans = await Users.find({ account_type: "Fan", user_type: "presignup"});
  return Response.json({ fans });
}