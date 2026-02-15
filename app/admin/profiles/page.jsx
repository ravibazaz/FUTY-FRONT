import EditProfileForm from "@/components/EditProfileForm";
import { connectDB } from "@/lib/db";
import Users from "@/lib/models/Users"
import { cookies } from "next/headers";
export const revalidate = 30; // ✅ ISR enabled
export default async function EditProfilePage() {
 
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  await connectDB();
  const user = await Users.findById(userId).lean();
  return <EditProfileForm user={JSON.parse(JSON.stringify(user))} />;
}
