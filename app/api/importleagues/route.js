import { connectDB } from '@/lib/db';
import Clubs from '@/lib/models/Clubs';
import Leagues from '@/lib/models/Leagues';
import * as XLSX from "xlsx";
import AgeGroups from "@/lib/models/AgeGroups";
export async function POST(req) {
  await connectDB();

  try {
    await connectDB();

    const ageGroups = await AgeGroups.find({}, "_id");
    const ageGroupIds = ageGroups.map(group => group._id);

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


    const existingNames = await Leagues.find({}, "title");
    const existingSet = new Set(
      existingNames.map(c => c.title.toLowerCase().trim())
    );

    const leagiesToInsert = [];

    for (const row of rows) {
      const leagueName = row["League"]?.trim();

      if (!leagueName) continue;

      if (existingSet.has(leagueName.toLowerCase())) {
        continue;
      }

      existingSet.add(leagueName.toLowerCase());

      leagiesToInsert.push({
        title: leagueName,
        age_groups: ageGroupIds,
      });

    }
    if (leagiesToInsert.length) {
      await Leagues.insertMany(leagiesToInsert);
    }
    return Response.json({
      success: true,
      inserted: leagiesToInsert.length,
      skipped: rows.length - leagiesToInsert.length,
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
