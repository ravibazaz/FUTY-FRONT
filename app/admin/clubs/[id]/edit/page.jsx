import { connectDB } from "@/lib/db";
import EditClubForm from "@/components/EditClubForm"; // move your current component to a separate file
import Clubs from "@/lib/models/Clubs";

export default async function EditLeaguePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const club = await Clubs.findById(id).lean();
  return <EditClubForm club={JSON.parse(JSON.stringify(club))} />;

  
}
