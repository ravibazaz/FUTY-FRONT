import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { protectApiRoute } from "@/lib/middleware";
import { z } from "zod";
import Users from "@/lib/models/Users";
import bcrypt from "bcryptjs";
export const UserSchema = z
  .object({
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
  const password = data.password;
  const confirm_password = data.confirm_password;
  
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
 // console.log(user);
  
  const existing = await Users.findById(user._id);
    if (!existing) {
    return NextResponse.json(
      {
        success: false,
        message: "User does not exists",
      },
      { status: 200 }
    );
  }

  const newpassword = await bcrypt.hash(password, 10);
  await Users.findByIdAndUpdate(user._id, {password:newpassword});

  return NextResponse.json({
    success: true,
    message: "Profile updated successfully!",
  });
}
