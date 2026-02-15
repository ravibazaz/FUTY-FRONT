import { connectDB } from "@/lib/db";
import EditGroundFacilityForm from "@/components/EditGroundFacilityForm"; // move your current component to a separate file
import GroundFacilities from "@/lib/models/GroundFacilities";
export const revalidate = 30; // ✅ ISR enabled
export default async function EditStorePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const groundfacilities = await GroundFacilities.findById(id).lean();
  return <EditGroundFacilityForm groundfacilities={JSON.parse(JSON.stringify(groundfacilities))} />;

  
}
