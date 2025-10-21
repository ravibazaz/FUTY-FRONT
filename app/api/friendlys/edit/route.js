import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import { connectDB } from '@/lib/db';
import Friendlies from "@/lib/models/Friendlies";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { promises as fs } from "fs";
export const TournamentSchema = z.object({
  name: z.string().nonempty("Friendly Title is required").min(2, "Friendly Title must be at least 2 character"),
  date: z.string().nonempty("Date is required").min(6, "Date must be at least 6 character"),
  time: z.string().nonempty("Time is required").min(4, "Time must be at least 4 character"),
  description: z.string().nonempty("Description is required").min(2, "Description must be at least 2 character"),
  ground_id: z.string().nonempty("Ground is required").min(3, "Ground at least 3 character"),
  team_id: z.string().nonempty("Team is required").min(3, "Team at least 3 character"),
  manager_id: z.string().nonempty("Manager is required").min(3, "Manager at least 3 character"),
  league_id: z.string().nonempty("League is required").min(3, "League at least 3 character")
});

export async function POST(req) {


  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }

  try {

    const { user } = authResult;
    const formData = await req.formData();
    // Extract normal text fields
    const rawData = Object.fromEntries(formData.entries());
    // Extract all files (normalize to array)
    let images = formData.getAll("images");
    if (!Array.isArray(images)) images = [images]; //  handle single upload gracefully

    //Validate with Zod
    const result = TournamentSchema.safeParse({ ...rawData, images });
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

    console.log(rawData);
    
    const updatedGround = await Friendlies.findOneAndUpdate(
      { _id: rawData._id }, // or any unique condition like { matchId: rawData.matchId }
      {
        ...rawData,
        },
      { new: true } // return the updated document
    );


    return NextResponse.json({
      success: true,
      message: "Successfully edited friendlys!",

    });

  } catch (error) {
    console.error("Error uploading images:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 200 });
  }
}
