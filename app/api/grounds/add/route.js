import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Grounds from "@/lib/models/Grounds";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
export const GroundSchema = z.object({
  name: z.string().nonempty("Ground Name is required").min(2, "Ground must be at least 2 character"),
  add1: z.string().nonempty("Address 1 is required").min(2, "Address 1 must be at least 2 character"),
  content: z.string().nonempty("Ground Facilities is required").min(2, "Ground Facilities must be at least 2 character"),
  county: z.string().nonempty("County is required").min(2, "County must be at least 2 character"),
  pin: z.string().nonempty("Post Code is required").min(2, "Post Code must be at least 2 character"),
  isHomeGround: z.string().nonempty("Home Ground is required").min(2, "Home Ground must be at least 2 character"),
  images: z
    .union([
      z.instanceof(File), //  single file
      z.array(z.instanceof(File)).nonempty("At least one image is required"), //  multiple
    ])
    .refine(
      (val) => {
        const files = Array.isArray(val) ? val : [val];
        return files.every((file) =>
          ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
        );
      },
      { message: "Only JPEG, PNG, GIF, or WebP files are allowed" }
    ),
});

export async function POST(req) {


  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {

    const formData = await req.formData();
    // Extract normal text fields
    const rawData = Object.fromEntries(formData.entries());
    // Extract all files (normalize to array)
    let images = formData.getAll("images");
    const facilities = formData.getAll("facilities");
    if (!Array.isArray(images)) images = [images]; //  handle single upload gracefully

    //Validate with Zod
    const result = GroundSchema.safeParse({ ...rawData, images });
    // If validation fails, return an error response
    if (!result.success) {
      // Flatten errors to match your desired response structure
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          message: Object.fromEntries(
            Object.entries(errors).map(([key, value]) => [key, value[0]])
          ),
        },
        { status: 200 }
      );
    }
    const uploadDir = path.join(process.cwd(), "uploads/grounds");
    await fs.mkdir(uploadDir, { recursive: true });
    // Save uploaded images
    const imagePaths = [];
    for (const image of images) {
      if (!image?.name) continue; // skip invalid entries

      const uniqueName = `${Date.now()}_${image.name}`;
      const filePath = path.join(uploadDir, uniqueName);
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      imagePaths.push(`/uploads/grounds/${uniqueName}`);
    }

    // Otherwise, it means the user is authenticated
    await connectDB();
    const newGround = await Grounds.create({
      ...rawData,
      images: imagePaths,
      facilities: facilities
    });

    return NextResponse.json({
      success: true,
      message: "Successfully added ground!",

    });

  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 200 });
  }
}
