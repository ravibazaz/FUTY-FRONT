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
  lat: z.string().nonempty("Latitude is required").min(2, "Latitude must be at least 2 character"),
  long: z.string().nonempty("Longitude is required").min(2, "Longitude must be at least 2 character"),
  isHomeGround: z.string().nonempty("Home Ground is required").min(2, "Home Ground must be at least 2 character"),
  images: z
    .union([
      z.string(),               // single base64 string
      z.array(z.string()).nonempty("At least one image is required"), // multiple base64 strings
    ])
    .refine(
      (val) => {
        const imgs = Array.isArray(val) ? val : [val];
        return imgs.every((img) =>
          /^data:image\/(jpeg|png|webp|gif);base64,/.test(img)
        );
      },
      { message: "Only valid Base64-encoded JPEG, PNG, GIF, or WebP images are allowed" }
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
    // console.log(formData);

    // Extract normal text fields
    const rawData = Object.fromEntries(formData.entries());
    // Extract all files (normalize to array)
    let images = formData.getAll("images");

    //console.log('Images');

    // console.log(images);

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
      if (typeof image !== "string") continue;
      // Remove base64 prefix if exists
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Extract file extension
      const extMatch = image.match(/^data:image\/(\w+);base64,/);
      const ext = extMatch ? extMatch[1] : "jpg";

      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 8)}.${ext}`;
      const filePath = path.join(uploadDir, fileName);

      await fs.writeFile(filePath, buffer);
      imagePaths.push(`/uploads/grounds/${fileName}`);
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
