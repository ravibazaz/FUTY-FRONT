import { connectDB } from "@/lib/db";
import TournamentOrderHistories from "@/lib/models/TournamentOrderHistories";

export async function POST(req) {
  const { orderId } = await req.json();

  await connectDB();
  const order = await TournamentOrderHistories.findById(orderId);

  return Response.json({ status: order.status });
}
