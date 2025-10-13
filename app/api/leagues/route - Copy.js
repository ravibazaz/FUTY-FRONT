import { connectDB } from '@/lib/db';
import Leagues from '@/lib/models/Leagues';

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';
  const filter = searchParams.get('filter');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 10;

  const query = {
    ...(q && { title: { $regex: q, $options: 'i' } }),
    ...(filter === 'active' && { isActive: 'true' }),
    ...(filter === 'inactive' && { isActive: 'false' }),
  };

  const total = await Leagues.countDocuments(query);
  const pages = Math.ceil(total / limit);
  const leagues = await Leagues.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  return Response.json({ leagues, total, pages,limit });
}
