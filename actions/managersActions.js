"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import Users from "@/lib/models/Users";
import { redirect } from "next/navigation";
import { ManagersSchema } from "@/lib/validation/managers";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import bcrypt from "bcryptjs";

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

export async function createManagers(prevState, formData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());

  const imageFile = formData.get("profile_image");
  const password = formData.get("password");
  const win = formData.get("win");
  const style = formData.get("style");
  const trophy = formData.get("trophy");
  const playing_style = {
    win: {
      value: '',
      percentage: Number(win) || 0,
    },
    style: {
      value: '',
      percentage: Number(style) || 0,
    },
    trophy: {
      value: '',
      percentage: Number(trophy) || 0,
    },
  };
  const result = ManagersSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/managers", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();
  await Users.create({
    ...result.data,
    account_type: 'Manager',
    playing_style: playing_style,
    password: hashedPassword,
    profile_image: `/uploads/managers/${uniqueName}`, // Save relative path to the image
  });

  cookieStore.set("toastMessage", "Manager Added");
  redirect("/admin/managers");
}

export async function updateManager(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = ManagersSchema(true).safeParse(raw);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, email, telephone, nick_name, post_code, profile_description,travel_distance,team_id } = result.data;
  const imageFile = formData.get("profile_image");
  const password = formData.get("password");

  const win = formData.get("win");
  const style = formData.get("style");
  const trophy = formData.get("trophy");
  const playing_style = {
    win: {
      value: '',
      percentage: Number(win) || 0,
    },
    style: {
      value: '',
      percentage: Number(style) || 0,
    },
    trophy: {
      value: '',
      percentage: Number(trophy) || 0,
    },
  };


  await connectDB();
  // Find the existing league in the database
  const user = await Users.findById(id);

  if (!user) {
    return { success: false, error: "User not found" };
  }


  // Handle image update if a new image is uploaded
  if (imageFile && imageFile.size > 0) {
    const uploadsFolder = path.join(process.cwd(), "uploads/managers");

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
      nick_name,
      post_code,
      profile_description,
      travel_distance,
      team_id,
      playing_style: playing_style,
      profile_image: `/uploads/managers/${imageName}`, // Save relative path to the image
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
      nick_name,
      post_code,
      profile_description,
      travel_distance,
      team_id,
      playing_style: playing_style,
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



  redirect("/admin/managers");
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
