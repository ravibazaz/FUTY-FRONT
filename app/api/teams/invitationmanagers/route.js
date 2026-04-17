import { connectDB } from '@/lib/db';
import ManagerInvitations from '@/lib/models/ManagerInvitations';

export async function GET(req) {
  await connectDB();
  const managers = await ManagerInvitations.find();
  return Response.json({ managers });
}