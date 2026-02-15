import { connectDB } from "@/lib/db";
import EditAdvertForm from "@/components/EditAdvertForm"; // move your current component to a separate file
import Adverts from "@/lib/models/Adverts";
export const revalidate = 30; // ✅ ISR enabled
export default async function EditStorePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const adverts = await Adverts.findById(id).lean();
  return <EditAdvertForm adverts={JSON.parse(JSON.stringify(adverts))} />;

  
}
