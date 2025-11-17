"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TeamSchema } from "@/lib/validation/teams";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Teams from "@/lib/models/Teams";


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

export async function createTeam(prevState, formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());
  const imageFile = formData.get("image");
  const result = TeamSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };
  // console.log(result.data);
  // return false;

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/teams", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();

  await Teams.create({
    ...result.data,
    image: `/uploads/teams/${uniqueName}`,
  });

  cookieStore.set("toastMessage", "Team Added");
  redirect("/admin/teams");
}

export async function updateTeam(id, prevState, formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;
  const raw = Object.fromEntries(formData.entries());
  const result = TeamSchema(true).safeParse(raw);
  //const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, phone, email, shirt, shorts, socks, attack, midfield, defence, ground, club, age_groups, user } = result.data;
  const imageFile = formData.get("image");

  // console.log(imageFiles);


  await connectDB();
  // Find the existing league in the database
  const team = await Teams.findById(id);

  if (!team) {
    return { success: false, error: "Team not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFile && imageFile.size > 0) {

    const uploadsFolder = path.join(process.cwd(),"uploads/teams");

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
    if (team.image) {
      const oldImagePath = path.join(process.cwd(), team.image);
      //console.log(oldImagePath);
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
      shirt,
      shorts,
      socks,
      attack,
      midfield,
      defence,
      ground,
      club,
      age_groups,
      phone,
      email,
      user: userId,
      image: `/uploads/teams/${imageName}`, // Save relative path to the image
    };
    // Update the league document with the new image name
    await Teams.findByIdAndUpdate(id, updateData);
  } else {
    const updateData = {
      name,
      shirt,
      shorts,
      socks,
      attack,
      midfield,
      defence,
      ground,
      club,
      age_groups,
      phone,
      email,
      user: userId,
    };
    // If no new image is uploaded, just update the title and isActive fields
    await Teams.findByIdAndUpdate(id, updateData);
  }
  cookieStore.set({
    name: "toastMessage",
    value: "Updated",
    path: "/",
  });
  redirect("/admin/teams");
}

export async function deleteTeam(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const league = await Teams.findById(id);
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
  await Teams.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/teams");
}
