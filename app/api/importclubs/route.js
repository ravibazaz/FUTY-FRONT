import { connectDB } from '@/lib/db';
import AgeGroups from '@/lib/models/AgeGroups';
import Clubs from '@/lib/models/Clubs';
import Leagues from '@/lib/models/Leagues';
import * as XLSX from "xlsx";
import mongoose from 'mongoose';
export async function POST(req) {
  await connectDB();

  try {
    await connectDB();

    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return Response.json(
        { success: false, message: "No file uploaded" },
        { status: 400 }
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
      existingNames.map(c => c.name.toLowerCase().trim())
    );

    const clubsToInsert = [];

    for (const row of rows) {
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

      ageGroups.forEach(group => {
        // e.g. "Under 7" -> "u7"
        const match = group.age_group.match(/Under\s*(\d+)/i);

        if (match) {
          ageGroupMap.set(`u${match[1]}`.toLowerCase(), group._id);
        }
      });


      const ageGroupText = row["Age Groups"] || "";

      // Find all U7, U8, U10, U11 etc.
      const matches = ageGroupText.match(/U\d+/gi) || [];

      // Convert to ObjectIds
      const ageGroupIds = matches
        .map(code => ageGroupMap.get(code.toLowerCase()))
        .filter(Boolean);


        // console.log(ageGroupIds);
        // return;
        
      clubsToInsert.push({
        name: clubName,
        secretary_name: row["Secretary"]?.trim() || "",
        phone: row["Secretary Phone"]?.trim() || "",
        email: row["Secretary Email"]?.trim() || "",
        cwo_name: row["CWO"]?.trim() || "",
        cwo_phone: row["CWO Phone"]?.trim() || "",
        cwo_email: row["CWO Email"]?.trim() || "",

        // Add league ObjectId
        league: new mongoose.Types.ObjectId("6a5a04a572f5c47aba5c26a7"),
        // Add all matching age group ids
       // age_groups: ageGroupIds,


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
      { status: 500 }
    );
  }


}
