import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { protectApiRoute } from "@/lib/middleware";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Users from "@/lib/models/Users";
import bcrypt from "bcryptjs";
export const UserSchema = z
  .object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Invalid email format"),

    name: z
      .string()
      .nonempty("Name is required")
      .min(2, "Name must be at least 2 characters"),

    telephone: z
      .string()
      .nonempty("Telephone is required")
      .min(2, "Telephone must be at least 2 characters"),

    // ✅ Optional password fields (validate only if provided)
    password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 7,
        "Password must be at least 7 characters long"
      ),

    confirm_password: z
      .string()
      .optional()
      .refine(
        (val) => !val || val.length >= 7,
        "Confirm password must be at least 7 characters long"
      ),

    profile_image: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(val),
        {
          message: "Invalid image format. Must be a valid Base64-encoded image.",
        }
      ),
  })
  // ✅ Match passwords only if both are provided
  .refine(
    (data) =>
      (!data.password && !data.confirm_password) ||
      data.password === data.confirm_password,
    {
      message: "Passwords don't match",
      path: ["confirm_password"],
    }
  );

export async function POST(req) {
  const authResult = await protectApiRoute(req);
  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  // Otherwise, it means the user is authenticated
  const { user } = authResult;

  const data = await req.json();
  const email = data.email;
  const password = data.password;
  const confirm_password = data.confirm_password;
  const name = data.name;
  const surname = data.surname;
  const telephone = data.telephone;
  const profile_image = data.profile_image;

  const result = UserSchema.safeParse(data);
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
  await connectDB();
  const existing = await Users.findOne({ email: result.data.email, _id: { $ne: user._id } });
  if (existing) {
    return NextResponse.json(
      {
        success: false,
        message: "User already exists",
      },
      { status: 200 }
    );
  }



  const updateData = {
    name,
    email,
    telephone,
    surname
  };

  if (profile_image) {


    const matches = profile_image.match(/^data:(.+);base64,(.+)$/);
    const mimeType = matches[1];
    const base64Data = matches[2];
    const extension = mimeType.split("/")[1];
    const fileName = `${uuidv4()}.${extension}`;

    let uploadtype = "";
    if (user.account_type == "Manager")
      uploadtype = "uploads/managers";
    if (user.account_type == "Fan")
      uploadtype = "uploads/fans";
    if (user.account_type == "Refreee")
      uploadtype = "uploads/referees";


    const uploadDir = path.join(process.cwd(), uploadtype);

    await fs.mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, fileName);
    const buffer = Buffer.from(base64Data, "base64");
    await fs.writeFile(filePath, buffer);

    updateData.profile_image = `/` + uploadtype + `/${fileName}`;

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



    // fs.writeFile(filePath, buffer, async (err) => {
    //   console.log('test');
    //   if (err) {
    //     console.error('Error writing file:', err);
    //     return NextResponse.json({
    //       success: false,
    //       error: "Failed to save image",
    //     });
    //   }

    //   updateData.profile_image = `/` + uploadtype + `/${fileName}`;
    //   console.log('File written successfully');
    //   if (user.profile_image) {
    //     const oldImagePath = path.join(process.cwd(), user.profile_image);
    //     // console.log(oldImagePath);
    //     try {
    //       await fs.unlink(oldImagePath).catch((err) => {
    //         console.warn(`Failed to delete image: ${err.message}`);
    //       });

    //     } catch (err) {
    //       console.warn(`Failed to delete old image: ${err.message}`);
    //     }
    //   }
    // });
  }

  if (password) {
    updateData.password = await bcrypt.hash(password, 10);
  }

  await Users.findByIdAndUpdate(user._id, updateData);

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully!",
  });
}
