import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { protectApiRoute } from "@/lib/middleware";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import Users from "@/lib/models/Users";

export const UserSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  password: z.string().nonempty("Password is required").min(7, "Password must be at least 7 character"),
  confirm_password: z.string().min(7, "Confirm password must be at least 7 characters long"),
  name: z.string().nonempty("Name is required").min(2, "Name must be at least 2 character"),
  telephone: z.string().nonempty("Telephone is required").min(2, "Telephone must be at least 2 character"),
  profile_image: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === '' ||
        /^data:image\/(png|jpg|jpeg|gif|webp);base64,/.test(val),
      {
        message: "Invalid image format. Must be a valid Base64-encoded image.",
      }
    )
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

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
  const account_type = data.account_type;
  const profile_description = data.profile_description;
  const playing_style = data.playing_style;
  const club_id = data.club_id;
  const ground_id = data.ground_id;
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

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully!",
  });
}
