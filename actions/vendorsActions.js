"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { VendorsSchema } from "@/lib/validation/vendors";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Vendors from "@/lib/models/Vendors";
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

export async function createVendors(prevState, formData) {


  const cookieStore = await cookies();
  const userId = cookieStore.get("user_id")?.value;

  const raw = Object.fromEntries(formData.entries());



  const imageFile = formData.get("image");
  const date = formData.get("date");
  const time = formData.get("time");
  const pages = formData.getAll("pages");
  const end_date = formData.get("end_date");
  const end_time = formData.get("end_time");
  // console.log(raw);
  // return;
  const startAt = new Date(`${date}T${time}:00`);
  const endAt = new Date(`${end_date}T${end_time}:00`);

  const result = VendorsSchema(false).safeParse({ ...raw, image: imageFile });

  if (!result.success)
    return { success: false, errors: result.error.flatten().fieldErrors };

  // Generate a unique filename and save the image
  const uniqueName = `${uuidv4()}${path.extname(imageFile.name)}`;
  const filePath = path.join(process.cwd(), "uploads/vendors", uniqueName);

  // Ensure the uploads directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Convert file to Buffer and save it
  const arrayBuffer = await imageFile.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);

  await connectDB();

  await Vendors.create({
    ...result.data,
    image: `/uploads/vendors/${uniqueName}`,
    startAt: startAt,
    date: date,
    time: time,
    endAt: endAt,
    end_date: end_date,
    end_time: end_time,
    pages:pages
  });

  cookieStore.set("toastMessage", "Vendors Added");
  redirect("/admin/vendors");
}

export async function updateVendor(id, prevState, formData) {
  const raw = Object.fromEntries(formData.entries());
  const result = VendorsSchema(true).safeParse(raw);
  // log(result);
  const cookieStore = await cookies();
  if (!result.success) {
    return { success: false, errors: result.error.flatten().fieldErrors };
  }
  const { name, content, link,phone,email ,date, time, end_date, end_time } = result.data;
  const imageFile = formData.get("image");
    const pages = formData.getAll("pages");
  const startAt = new Date(`${date}T${time}:00`);
  const endAt = new Date(`${end_date}T${end_time}:00`);
  // console.log(date);
  // return;
  await connectDB();
  // Find the existing advert in the database
  const advert = await Vendors.findById(id);

  if (!advert) {
    return { success: false, error: "Vendor not found" };
  }
  // Handle image update if a new image is uploaded

  if (imageFile && imageFile.size > 0) {

    const uploadsFolder = path.join(process.cwd(), "uploads/vendors");

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
      email,
      phone,
      startAt,
      date,
      time,
      endAt,
      end_date,
      end_time,
      pages,
      image: `/uploads/vendors/${imageName}`, // Save relative path to the image
    };
    // Update the advert document with the new image name
    await Vendors.findByIdAndUpdate(id, updateData);
  } else {
    const updateData = {
      name,
      content,
      link,
       email,
      phone,
      startAt,
      date,
      time,
      endAt,
      end_date,
      end_time,
      pages
    };
    // If no new image is uploaded, just update the name and isActive fields
    await Vendors.findByIdAndUpdate(id, updateData);
  }

  cookieStore.set({
    name: "toastMessage",
    value: "Vendor Updated",
    path: "/",
  });
  redirect("/admin/vendors");
}

export async function deleteVendor(id) {
  "use server";

  const cookieStore = await cookies();

  await connectDB();
  const advert = await Vendors.findById(id);
  if (!advert) {
    throw new Error("Vendor not found");
  }
  if (advert.image) {
    // Construct the file path for the image
    const imagePath = path.join(process.cwd(), advert.image);
    // Delete the image file from the folder
    await fs.unlink(imagePath).catch((err) => {
      console.warn(`Failed to delete image: ${err.message}`);
    });
  }
  await Vendors.findByIdAndDelete(id);
  cookieStore.set("toastMessage", "Deleted");
  redirect("/admin/vendors");
}
