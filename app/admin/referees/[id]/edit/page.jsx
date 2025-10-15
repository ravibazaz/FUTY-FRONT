import { connectDB } from "@/lib/db";
import User from "@/lib/models/Users";
import EditMangerForm from "@/components/EditMangerForm"; // move your current component to a separate file

export default async function EditLeaguePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const user = await User.findById(id).lean();
  return <EditMangerForm user={JSON.parse(JSON.stringify(user))} />;
}
