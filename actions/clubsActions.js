"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClubSchema } from "@/lib/validation/clubs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Clubs from "@/lib/models/Clubs";


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

export async function createClub(prevState, formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image");
  const age_groups = formData.getAll("age_groups");
  const result = ClubSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/clubs", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();

  await Clubs.create({
    ...result.data,
     age_groups: age_groups,
    image: `/uploads/clubs/${uniqueName}`,
  });

  cookieStore.set("toastMessage", "Club Added");
  redirect("/admin/clubs");
}

export async function updateClub(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = ClubSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, secretary_name, phone, email,league } = result.data;
  const imageFile = formData.get("image");
  const age_groups = formData.getAll("age_groups");

  // console.log(imageFiles);


  await connectDB();
  // Find the existing league in the database
  const club = await Clubs.findById(id);

  if (!club) {
    return { success: false, error: "Club not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFile && imageFile.size > 0) {

    const uploadsFolder = path.join(process.cwd(),"uploads/clubs");

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
    if (club.image) {
      const oldImagePath = path.join(process.cwd(), club.image);
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
      secretary_name,
      phone,
      email,
      league,
      age_groups: age_groups,
      image: `/uploads/clubs/${imageName}`, // Save relative path to the image
    };
    // Update the league document with the new image name
    await Clubs.findByIdAndUpdate(id, updateData, { new: true });
  } else {
    const updateData = {
      name,
      secretary_name,
      phone,
      league,
      age_groups: age_groups,
      email,
    };
    // If no new image is uploaded, just update the title and isActive fields
    await Clubs.findByIdAndUpdate(id, updateData, { new: true });
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Club Updated",
    path: "/",
  });
  redirect("/admin/clubs");
}

export async function deleteClub(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const club = await Clubs.findById(id);
  if (!club) {
    throw new Error("Club not found");
  }
  if (club.image) {
    // Construct the file path for the image
    const imagePath = path.join(process.cwd(), club.image);
    // Delete the image file from the folder
    await fs.unlink(imagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }
  await Clubs.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/clubs");
}
