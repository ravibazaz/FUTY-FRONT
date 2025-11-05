"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AgeGroupSchema } from "@/lib/validation/agegroups";
import AgeGroups from "@/lib/models/AgeGroups";


export async function createAgeGrouups(prevState, formData) {

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const result = AgeGroupSchema(false).safeParse({ ...raw });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  await connectDB();

  await AgeGroups.create({
    ...result.data,
  });

  cookieStore.set("toastMessage", "Age Group Added");
  redirect("/admin/agegroups");
}

export async function updateAgeGroups(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = AgeGroupSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { age_group, description } = result.data;
  // console.log(imageFiles);
  await connectDB();
  // Find the existing store in the database
  const agegroup = await AgeGroups.findById(id);

  if (!agegroup) {
    return { success: false, error: "Age Group not found" };
  }
  const updateData = {
    age_group,
    description,
  };
  // If no new image is uploaded, just update the title and isActive fields
  await AgeGroups.findByIdAndUpdate(id, updateData);

  cookieStore.set({
    name: "toastMessage",
    value: "Age Group Updated",
    path: "/",
  });
  redirect("/admin/agegroups");
}

export async function deleteStore(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const store = await AgeGroups.findById(id);
  if (!store) {
    throw new Error("Store not found");
  }
  if (store.image) {
    // Construct the file path for the image
    const imagePath = path.join(process.cwd(), store.image);
    // Delete the image file from the folder
    await fs.unlink(imagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }
  await AgeGroups.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/agegroups");
}
