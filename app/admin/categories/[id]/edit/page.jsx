import { connectDB } from "@/lib/db";
import EditCategoryForm from "@/components/EditCategoryForm"; // move your current component to a separate file
import Categories from "@/lib/models/Categories";

export default async function EditStorePage({ params }) {
  const id = (await params).id;

  await connectDB();
  const category = await Categories.findById(id).lean();
  return <EditCategoryForm category={JSON.parse(JSON.stringify(category))} />;

  
}
