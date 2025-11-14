"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GroundFacilitiesSchema } from "@/lib/validation/groundfacilities";
import GroundFacilities from "@/lib/models/GroundFacilities";


export async function createGroundFacilities(prevState, formData) {

  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const result = GroundFacilitiesSchema(false).safeParse({ ...raw });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  await connectDB();

  await GroundFacilities.create({
    ...result.data,
  });

  cookieStore.set("toastMessage", "Ground Facility Added");
  redirect("/admin/groundfacilities");
}

export async function updateGroundFacilities(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = GroundFacilitiesSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { facilities, description } = result.data;
  // console.log(imageFiles);
  await connectDB();
  // Find the existing store in the database
  const agegroup = await GroundFacilities.findById(id);

  if (!agegroup) {
    return { success: false, error: "Ground Facility not found" };
  }
  const updateData = {
    facilities,
    description,
  };
  // If no new image is uploaded, just update the title and isActive fields
  await GroundFacilities.findByIdAndUpdate(id, updateData);

  cookieStore.set({
    name: "toastMessage",
    value: "Ground Facility Updated",
    path: "/",
  });
  redirect("/admin/groundfacilities");
}

export async function deleteStore(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const store = await GroundFacilities.findById(id);
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
  await GroundFacilities.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/agegroups");
}
