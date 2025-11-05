"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CategoriesSchema } from "@/lib/validation/categories";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Categories from "@/lib/models/Categories";


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

export async function createCategory(prevState, formData) {

  
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image");
  const result = CategoriesSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/categories", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();

  await Categories.create({
    ...result.data,
    image: `/uploads/categories/${uniqueName}`,
  });

  cookieStore.set("toastMessage", "Store Added");
  redirect("/admin/categories");
}

export async function updateCategory(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = CategoriesSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { title, content} = result.data;
  const imageFile = formData.get("image");

  // console.log(imageFiles);


  await connectDB();
  // Find the existing category in the database
  const category = await Categories.findById(id);

  if (!category) {
    return { success: false, error: "Store not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFile && imageFile.size > 0) {

    const uploadsFolder = path.join(process.cwd(),"uploads/categories");

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
    if (category.image) {
      const oldImagePath = path.join(process.cwd(), category.image);
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
      image: `/uploads/categories/${imageName}`, // Save relative path to the image
    };
    // Update the category document with the new image name
    await Categories.findByIdAndUpdate(id, updateData);
  } else {
    const updateData = {
 title,
      content,
    };
    // If no new image is uploaded, just update the title and isActive fields
    await Categories.findByIdAndUpdate(id, updateData);
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Store Updated",
    path: "/",
  });
  redirect("/admin/categories");
}

export async function deleteStore(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const category = await Categories.findById(id);
  if (!category) {
    throw new Error("Store not found");
  }
  if (category.image) {
    // Construct the file path for the image
    const imagePath = path.join(process.cwd(), category.image);
    // Delete the image file from the folder
    await fs.unlink(imagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }
  await Categories.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/categories");
}
