"use server";

import { connectDB } from "@/lib/db";
import { cookies } from "next/headers";
import Users from "@/lib/models/Users";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import bcrypt from "bcryptjs";
import { z } from "zod";
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
export async function updateProfile(id, prevState, formData) {

  const cookieStore = await cookies();

  const password = formData.get("password");
  const name = formData.get("name");
  const email = formData.get("email");
  const telephone = formData.get("telephone");

  await connectDB();
  // Find the existing league in the database
  const user = await Users.findById(id);

  if (!user) {
    return { success: false, error: "User not found" };
  }
  // Handle image update if a new image is uploaded
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
  cookieStore.set({
    name: "toastMessage",
    value: "Profile Updated",
    path: "/",
  });
  redirect("/admin/profiles");
}


