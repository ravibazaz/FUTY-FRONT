import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
import TournamentAccepted from "@/lib/models/TournamentAccepted";
import { log } from "console";
export const TournamentAcceptedSchema = z.object({
  email: z.string().nonempty("Email is required").email("Invalid email format"),
  contact: z.string().nonempty("Contact is required").min(2, "Contact must be at least 6 character"),
  notes: z.string().nonempty("Notes is required").min(2, "Notes must be at least 6 character"),
  accepted_by: z.string().nonempty("Accepted by is required").min(2, "Accepted by at least 2 character"),
});

export async function POST(req) {
  const authResult = await protectApiRoute(req);
  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {

    const { user } = authResult;
    //log(user);
    const formData = await req.formData();
    // Extract normal text fields
    const rawData = Object.fromEntries(formData.entries());

    //Validate with Zod
    const result = TournamentAcceptedSchema.safeParse({ ...rawData });
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
    // Otherwise, it means the user is authenticated
    await connectDB();
    const newGround = await TournamentAccepted.create({
      ...rawData,
      accepted_by_user: user._id,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully accepted tournament!",
    });

  } catch (error) {
    console.error("Error :", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 200 });
  }
}
