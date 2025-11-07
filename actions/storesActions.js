"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { StoresSchema } from "@/lib/validation/stores";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Stores from "@/lib/models/Stores";


// Check if file exists asynchronously
const fileExists = async (filePath) => {
  try {
    await fs.promises.access(filePath, fs.constants.F_OK);
    return true; // File exists
  } catch {
    console.log('no uokid');
    return false; // File does not exist
  }
};

export async function createStores(prevState, formData) {


  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image");
  const result = StoresSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/stores", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();

  await Stores.create({
    ...result.data,
    image: `/uploads/stores/${uniqueName}`,
  });

  cookieStore.set("toastMessage", "Store Added");
  redirect("/admin/stores");
}

export async function updateStore(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = StoresSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { title, content, category, price, discount, shipping_cost, size, color, material, product_code, other_product_info } = result.data;
  const imageFile = formData.get("image");

  // console.log(imageFiles);


  await connectDB();
  // Find the existing store in the database
  const store = await Stores.findById(id);

  if (!store) {
    return { success: false, error: "Store not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFile && imageFile.size > 0) {

    const uploadsFolder = path.join(process.cwd(), "uploads/stores");

    // Ensure the uploads folder exists
    await fileExists(uploadsFolder);
    const imageName = `${Date.now()}_${imageFile.name}`;
    const imagePath = path.join(uploadsFolder, imageName);
    // Write image file asynchronously
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

    // Using callback version of writeFile
    fs.writeFile(imagePath, imageBuffer, (err) => {
      if (err) {
        console.error('Error writing file:', err);
        return { success: false, error: 'Failed to save image' };
      }
      console.log('File written successfully');
    });
    // Delete the old image if it exists
    if (store.image) {
      const oldImagePath = path.join(process.cwd(), store.image);
      // console.log(oldImagePath);
      try {
        await fs.unlink(oldImagePath).catch((err) => {
          console.warn(`Failed to delete image: ${err.message}`);
        });

      } catch (err) {
        console.warn(`Failed to delete old image: ${err.message}`);
      }
    }
    const updateData = {
      title,
      content,
      category, price, discount, shipping_cost, size, color, material, product_code, other_product_info,
      image: `/uploads/stores/${imageName}`, // Save relative path to the image
    };
    // Update the store document with the new image name
    await Stores.findByIdAndUpdate(id, updateData);
  } else {
    const updateData = {
      title,
      content,
      category, price, discount, shipping_cost, size, color, material, product_code, other_product_info
    };
    // If no new image is uploaded, just update the title and isActive fields
    await Stores.findByIdAndUpdate(id, updateData);
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Store Updated",
    path: "/",
  });
  redirect("/admin/stores");
}

export async function deleteStore(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const store = await Stores.findById(id);
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
  await Stores.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/stores");
}
