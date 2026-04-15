import { NextResponse } from "next/server";
import User from "@/lib/models/Users";
import { connectDB } from "@/lib/db";
import Teams from "@/lib/models/Teams";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const club = searchParams.get("club");
  const age_groups = searchParams.get("age_groups");
  const id = searchParams.get("id");

  if (!club || !age_groups) {
    return NextResponse.json({ exists: false });
  }

const query = id
  ? { club, age_groups, _id: { $ne: id } }
  : { club, age_groups };

  const existing = await Teams.findOne(query);

  console.log(existing);
  
  return NextResponse.json({ exists: !!existing });
}
