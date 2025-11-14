import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { z } from "zod";
import Users from "@/lib/models/Users";
import bcrypt from "bcryptjs";
export const UserSchema = z
  .object({
    password: z
      .string()
      .min(7, "Password must be at least 7 characters long"),

    confirm_password: z
      .string()
      .min(7, "Confirm password must be at least 7 characters long"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ["confirm_password"], // attach error to confirm_password field
  });


export async function POST(req) {

  const data = await req.json();
  const password = data.password;
  const confirm_password = data.confirm_password;
  const email = data.email;
  
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
  
  const existing = await Users.findOne({email: email }).select("-__v").lean();;
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
  await Users.findByIdAndUpdate(existing._id, {password:newpassword});
  return NextResponse.json({
    success: true,
    message: "Password updated successfully!",
  });
}
