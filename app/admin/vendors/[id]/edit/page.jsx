import { connectDB } from "@/lib/db";
import EditVendorForm from "@/components/EditVendorForm"; // move your current component to a separate file
import Vendors from "@/lib/models/Vendors";
export const revalidate = 30; // ✅ ISR enabled
export default async function EditStorePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const vendors = await Vendors.findById(id).lean();
  return <EditVendorForm vendors={JSON.parse(JSON.stringify(vendors))} />;

  
}
