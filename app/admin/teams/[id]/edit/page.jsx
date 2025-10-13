import { connectDB } from "@/lib/db";
import EditTeamForm from "@/components/EditTeamForm"; // move your current component to a separate file
import Teams from "@/lib/models/Teams";

export default async function EditLeaguePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const team = await Teams.findById(id).lean();
  return <EditTeamForm team={JSON.parse(JSON.stringify(team))} />;

  
}
