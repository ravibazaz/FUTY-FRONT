"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import Grounds from "@/lib/models/Grounds";
import { redirect } from "next/navigation";
import { GroundSchema } from "@/lib/validation/grounds";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";


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

export async function createGrounds(prevState, formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFiles = formData.getAll("images");
  const facilities = formData.getAll("facilities");
  const result = GroundSchema(false).safeParse({ ...raw, images: imageFiles });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };
  // console.log(result.data);
  // return false;
  await connectDB();
  // ensure upload directory exists
  const uploadDir = path.join(process.cwd(), "uploads/grounds");
  await fs.mkdir(uploadDir, { recursive: true });

  const uploadedFiles = [];

  // loop through all valid images
  for (const file of imageFiles) {

    const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.name)}`;
    const filePath = path.join(process.cwd(), "uploads/grounds", uniqueName);

    await fs.mkdir(path.dirname(filePath), { recursive: true });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);
    // push info for DB
    uploadedFiles.push(`/uploads/grounds/${uniqueName}`);
  }
  await Grounds.create({
    ...result.data,
    facilities: facilities,
    images: uploadedFiles,
  });

  cookieStore.set("toastMessage", "Ground Added");
  redirect("/admin/grounds");
}

export async function updateGround(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = GroundSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, add1, add2, add3, pin, content } = result.data;
  const imageFiles = formData.getAll("images");
  const facilities = formData.getAll("facilities");

  // console.log(imageFiles);
  
  
  await connectDB();
  // Find the existing league in the database
  const ground = await Grounds.findById(id);

  if (!ground) {
    return { success: false, error: "Ground not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFiles && imageFiles.length > 0) {

    const uploadDir = path.join(process.cwd(), "uploads/grounds");
    await fs.mkdir(uploadDir, { recursive: true });

    const uploadedFiles = [];
    for (const file of imageFiles) {
      const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.name)}`;
      const filePath = path.join(process.cwd(), "uploads/grounds", uniqueName);

      await fs.mkdir(path.dirname(filePath), { recursive: true });

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      fs.writeFile(filePath, buffer, (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return { success: false, error: 'Failed to save image' };
        }
        console.log('File written successfully');
      });
      // push info for DB
      uploadedFiles.push(`/uploads/grounds/${uniqueName}`);
    }

    // Delete the old image if it exists
    if (ground.images) {
      ground.images.map((l, index) => {
        const oldImagePath = path.join(process.cwd(), l);
        // console.log(oldImagePath);
        try {
          fs.unlink(oldImagePath).catch((err) => {
            console.warn(`Failed to delete image: ${err.message}`);
          });

        } catch (err) {
          console.warn(`Failed to delete old image: ${err.message}`);
        }
      })
    }

    const updateData = {
      name,
      add1,
      add2,
      add3,
      pin,
      content,
      facilities: facilities,
      images: uploadedFiles,
    };

    // Update the league document with the new image name
    await Grounds.findByIdAndUpdate(id, updateData, { new: true });
  } else {
    const updateData = {
      name,
      add1,
      add2,
      add3,
      pin,
      content,
      facilities: facilities,
    };
    // If no new image is uploaded, just update the title and isActive fields
    await Grounds.findByIdAndUpdate(id, updateData, { new: true });
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Updated",
    path: "/",
  });
  redirect("/admin/grounds");
}

export async function deleteLeague(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const league = await Leagues.findById(id);
  if (!league) {
    throw new Error("League not found");
  }
  if (league.image) {
    // Construct the file path for the image
    const imagePath = path.join(process.cwd(), league.image);
    // Delete the image file from the folder
    await fs.unlink(imagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }
  await Leagues.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/leagues");
}
