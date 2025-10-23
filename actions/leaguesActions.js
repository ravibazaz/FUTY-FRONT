"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LeaguesSchema } from "@/lib/validation/leagues";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Leagues from "@/lib/models/Leagues";


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

export async function createLeagues(prevState, formData) {


  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image");
  const age_groups = formData.getAll("age_groups");


  const result = LeaguesSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };


  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/leagues", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();

  await Leagues.create({
    ...result.data,
    age_groups: age_groups,
    image: `/uploads/leagues/${uniqueName}`,
  });

  cookieStore.set("toastMessage", "League Added");
  redirect("/admin/leagues");
}

export async function updateLeague(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = LeaguesSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { title, content, c_name, s_name, email, telephone } = result.data;
  const imageFile = formData.get("image");
  const age_groups = formData.getAll("age_groups");

  // console.log(imageFiles);


  await connectDB();
  // Find the existing league in the database
  const league = await Leagues.findById(id);

  if (!league) {
    return { success: false, error: "League not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFile && imageFile.size > 0) {

    const uploadsFolder = path.join(process.cwd(), "uploads/leagues");

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
      const oldImagePath = path.join(process.cwd(), league.image);
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
      c_name,
      s_name,
      email,
      telephone,
      age_groups: age_groups,
      image: `/uploads/leagues/${imageName}`, // Save relative path to the image
    };
    // Update the league document with the new image name
    await Leagues.findByIdAndUpdate(id, updateData, { new: true });
  } else {
    const updateData = {
      title,
      content,
      c_name,
      s_name,
      email,
      telephone,
      age_groups: age_groups
    };
    // If no new image is uploaded, just update the title and isActive fields
    await Leagues.findByIdAndUpdate(id, updateData, { new: true });
  }

  cookieStore.set({
    name: "toastMessage",
    value: "League Updated",
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
