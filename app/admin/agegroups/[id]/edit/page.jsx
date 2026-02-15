import { connectDB } from "@/lib/db";
import EditAgeGroupForm from "@/components/EditAgeGroupForm"; // move your current component to a separate file
import AgeGroups from "@/lib/models/AgeGroups";
export const revalidate = 30; // ✅ ISR enabled
export default async function EditStorePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const agegroups = await AgeGroups.findById(id).lean();
  return <EditAgeGroupForm agegroups={JSON.parse(JSON.stringify(agegroups))} />;

  
}
