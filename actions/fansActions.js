"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import Users from "@/lib/models/Users";
import { redirect } from "next/navigation";
import { FansSchema } from "@/lib/validation/fans";
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

export async function createFans(prevState, formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFile = formData.get("profile_image");
  const result = FansSchema.safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "public","uploads/fans", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();
  await Users.create({
    ...result.data,
    account_type: 'Fan',
    profile_image: `/uploads/fans/${uniqueName}`, // Save relative path to the image
  });

  cookieStore.set("toastMessage", "Fans Added");
  redirect("/admin/fans");
}

export async function updateLeague(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = FansSchema.safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { title, isActive } = result.data;
  const imageFile = formData.get("image");

  await connectDB();
  // Find the existing league in the database
  const league = await Leagues.findById(id);

  if (!league) {
    return { success: false, error: "League not found" };
  }

  // Handle image update if a new image is uploaded
  if (imageFile && imageFile.size > 0) {
    const uploadsFolder = path.join(process.cwd(),  "uploads");

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
    if (league.image) {
      const oldImagePath = path.join(process.cwd(),  league.image);
     // console.log(oldImagePath);
      try {
        await fs.unlink(oldImagePath).catch((err) => {
          console.warn(`Failed to delete image: ${err.message}`);
        });
       
      } catch (err) {
        console.warn(`Failed to delete old image: ${err.message}`);
      }
    }

    // Update the league document with the new image name
    await Leagues.findByIdAndUpdate(id, {
      title,
      isActive,
      image: `/uploads/${imageName}`, // Save relative path to the image
     
    });
  } else {
    // If no new image is uploaded, just update the title and isActive fields
    await Leagues.findByIdAndUpdate(id, {
      title,
      isActive,
    });
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Updated",
    path: "/",
  });



  redirect("/admin/leagues");
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
    const imagePath = path.join(process.cwd(),league.image);
    // Delete the image file from the folder
    await fs.unlink(imagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }
  await Leagues.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/leagues");
}
