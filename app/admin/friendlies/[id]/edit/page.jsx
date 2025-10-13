import { connectDB } from "@/lib/db";
import Leagues from "@/lib/models/Leagues";
import EditLeagueForm from "@/components/EditLeagueForm"; // move your current component to a separate file

export default async function EditLeaguePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const league = await Leagues.findById(id).lean();
  return <EditLeagueForm league={JSON.parse(JSON.stringify(league))} />;
}
