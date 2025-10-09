import { connectDB } from "@/lib/db";
import EditGroundForm from "@/components/EditGroundForm"; // move your current component to a separate file
import Grounds from "@/lib/models/Grounds";

export default async function EditLeaguePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const ground = await Grounds.findById(id).lean();
  return <EditGroundForm ground={JSON.parse(JSON.stringify(ground))} />;
}
