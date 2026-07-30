import { connectDB } from "@/lib/db";
import AgeGroups from "@/lib/models/AgeGroups";
import Clubs from "@/lib/models/Clubs";
import Leagues from "@/lib/models/Leagues";
import * as XLSX from "xlsx";
import mongoose from "mongoose";
import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

async function downloadImage(imageUrl) {
  if (!imageUrl) return null;

  // const response = await fetch(imageUrl);
  const response = await fetch(imageUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  console.log(response.status, response.statusText);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  // Get extension from URL
  const ext = path.extname(new URL(imageUrl).pathname) || ".jpg";

  const uniqueName = `${uuidv4()}${ext}`;
  const filePath = path.join(process.cwd(), "uploads/clubs", uniqueName);

  // Ensure directory exists
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  // Save image
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  await fs.writeFile(filePath, buffer);

  return `/uploads/clubs/${uniqueName}`;
}

export async function POST(req) {
  await connectDB();

  try {
    await connectDB();

    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { success: false, message: "No file uploaded" },
        { status: 400 },
      );
    }

    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const workbook = XLSX.read(buffer, {
      type: "buffer",
    });

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json(sheet, { raw: false });

    const existingNames = await Clubs.find({}, "name");
    const existingSet = new Set(
      existingNames.map((c) => c.name.toLowerCase().trim()),
    );

    const clubsToInsert = [];

    for (const row of rows) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const clubName = row["Club Name"]?.trim();

      if (!clubName) continue;

      if (existingSet.has(clubName.toLowerCase())) {
        continue;
      }

      existingSet.add(clubName.toLowerCase());

      // Fetch all age groups
      const ageGroups = await AgeGroups.find({}, "_id age_group"); // Replace "title" with your field name if different
      // Create map: u7 => ObjectId, u8 => ObjectId, etc.
      const ageGroupMap = new Map();

      ageGroups.forEach((group) => {
        const underMatch = group.age_group.match(/Under\s*(\d+)/i);

        if (underMatch) {
          ageGroupMap.set(`under${underMatch[1]}`.toLowerCase(), group._id);
        }

        if (group.age_group.trim().toLowerCase() === "adult") {
          ageGroupMap.set("adult", group._id);
        }
      });

      const ageGroupText = row["Age Groups"] || "";
      // Extract "UNDER 8", "UNDER 9", "UNDER 13", etc.

      const matches = [
        ...ageGroupText.matchAll(/(?:UNDER\s+|U)(\d+)|ADULT/gi)
      ].map(match => {
        if (match[1]) {
          return `under${match[1]}`;
        }
        return "adult";
      });

      // Convert to ObjectIds
      const ageGroupIds = [...new Set(
        matches
          .map(code => ageGroupMap.get(code.toLowerCase()))
          .filter(Boolean)
      )];

      let imagePath = "";
      try {
        imagePath = await downloadImage(row["Image Link"]);
      } catch (err) {
        console.error(err);
      }
      // console.log(ageGroupIds);
      // return;

      clubsToInsert.push({
        name: clubName,
        secretary_name: row["Secretary Name"]?.trim() || "",
        phone: row["Secretary Phone"]?.trim() || "",
        email: row["Secretary Email"]?.trim() || "",
        cwo_name: row["Emergency Contact Name"]?.trim() || "",
        cwo_phone: row["Emergency Contact Phone"]?.trim() || "",
        cwo_email: row["Emergency Contact Email"]?.trim() || "",
        secretary_website: row["Website"]?.trim() || "",

        // Add league ObjectId
        league: new mongoose.Types.ObjectId("6a5a04a572f5c47aba5c26db"),
        // Add all matching age group ids
        age_groups: ageGroupIds,
        image: imagePath,
      });
    }
    if (clubsToInsert.length) {
      await Clubs.insertMany(clubsToInsert);
    }
    return Response.json({
      success: true,
      inserted: clubsToInsert.length,
      skipped: rows.length - clubsToInsert.length,
    });
  } catch (err) {
    console.log(err);

    return Response.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 },
    );
  }
}
