"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import Users from "@/lib/models/Users";
import { redirect } from "next/navigation";
import { FansSchema } from "@/lib/validation/fans";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import bcrypt from "bcryptjs";
import Friendlies from "@/lib/models/Friendlies";
import Tournaments from "@/lib/models/Tournaments";

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
  const password = formData.get("password");
  const result = FansSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/fans", uniqueName);

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
    password: hashedPassword,
    profile_image: `/uploads/fans/${uniqueName}`, // Save relative path to the image
  });

  cookieStore.set("toastMessage", "Fans Added");
  redirect("/admin/fans");
}

export async function updateFan(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = FansSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, email, telephone } = result.data;
  const imageFile = formData.get("profile_image");
  const password = formData.get("password");

  await connectDB();
  // Find the existing league in the database
  const user = await Users.findById(id);

  if (!user) {
    return { success: false, error: "User not found" };
  }


  // Handle image update if a new image is uploaded
  if (imageFile && imageFile.size > 0) {
    const uploadsFolder = path.join(process.cwd(), "uploads/fans");

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
    if (user.profile_image) {
      const oldImagePath = path.join(process.cwd(), user.profile_image);
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
      email,
      telephone,
      profile_image: `/uploads/fans/${imageName}`, // Save relative path to the image
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    // Update the league document with the new image name
    await Users.findByIdAndUpdate(id, updateData);
  } else {
    const updateData = {
      name,
      email,
      telephone,
    };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    // If no new image is uploaded, just update the title and isActive fields
    await Users.findByIdAndUpdate(id, updateData);
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Updated",
    path: "/",
  });



  redirect("/admin/fans");
}

export async function deleteTournaments(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const league = await Tournaments.findById(id);
  if (!league) {
    throw new Error("League not found");
  }
  if (league.images) {

    league.images.map((l, index) => {
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
  await Tournaments.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/tournaments");
}
