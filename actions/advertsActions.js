"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdvertsSchema } from "@/lib/validation/adverts";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Adverts from "@/lib/models/Adverts";
import { log } from "console";


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

export async function createAdverts(prevState, formData) {


  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image");
  const result = AdvertsSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/adverts", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();

  await Adverts.create({
    ...result.data,
    image: `/uploads/adverts/${uniqueName}`,
  });

  cookieStore.set("toastMessage", "Advert Added");
  redirect("/admin/adverts");
}

export async function updateAdvert(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = AdvertsSchema(true).safeParse(raw);
  log(result);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, content , link } = result.data;
  const imageFile = formData.get("image");

  // console.log(imageFiles);


  await connectDB();
  // Find the existing advert in the database
  const advert = await Adverts.findById(id);

  if (!advert) {
    return { success: false, error: "Advert not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFile && imageFile.size > 0) {

    const uploadsFolder = path.join(process.cwd(), "uploads/adverts");

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
    if (advert.image) {
      const oldImagePath = path.join(process.cwd(), advert.image);
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
      name,
      content,
      link,
      image: `/uploads/adverts/${imageName}`, // Save relative path to the image
    };
    // Update the advert document with the new image name
    await Adverts.findByIdAndUpdate(id, updateData);
  } else {
    const updateData = {
      name,
      content,
      link
    };
    // If no new image is uploaded, just update the name and isActive fields
    await Adverts.findByIdAndUpdate(id, updateData);
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Advert Updated",
    path: "/",
  });
  redirect("/admin/adverts");
}

export async function deleteAdvert(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const advert = await Adverts.findById(id);
  if (!advert) {
    throw new Error("Advert not found");
  }
  if (advert.image) {
    // Construct the file path for the image
    const imagePath = path.join(process.cwd(), advert.image);
    // Delete the image file from the folder
    await fs.unlink(imagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }
  await Adverts.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/adverts");
}
