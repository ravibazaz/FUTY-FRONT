import { connectDB } from "@/lib/db";
import EditStoreForm from "@/components/EditStoreForm"; // move your current component to a separate file
import Stores from "@/lib/models/Stores";

export default async function EditStorePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const store = await Stores.findById(id).lean();
  return <EditStoreForm store={JSON.parse(JSON.stringify(store))} />;

  
}
