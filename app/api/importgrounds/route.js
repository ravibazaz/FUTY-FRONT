import { connectDB } from '@/lib/db';
import Clubs from '@/lib/models/Clubs';
import Grounds from '@/lib/models/Grounds';
import Leagues from '@/lib/models/Leagues';
import * as XLSX from "xlsx";
import { getLatLng } from "@/lib/geocode";
import GroundFacilities from '@/lib/models/GroundFacilities';

import path from "path";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";


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



    const existingNames = await Grounds.find({}, "name");
    const existingSet = new Set(
      existingNames.map(c => c.name.toLowerCase().trim())
    );

    const groundsToInsert = [];

    for (const row of rows) {
      const groundName = row["Name"]?.trim();

      if (!groundName) continue;

      if (existingSet.has(groundName.toLowerCase())) {
        continue;
      }

      existingSet.add(groundName.toLowerCase());
      const geo = await getLatLng(row["Address"]?.trim() || "");


      const facilities = await GroundFacilities.find({}, "_id facilities");

      const facilityMap = new Map(
        facilities.map(f => [f.facilities.trim().toLowerCase(), f._id])
      );

      const facilityColumns = [
        "Disabled Access",
        "Changing Rooms",
        "Floodlit",
        "Indoor",
        "Disability Parking",
        "Disability Social Areas",
        "Disability Activity Areas",
        "Disability Spectator Areas",
        "Disability Changing Facilities",
        "Disability Toilets",
        "Disability Finding and Reaching Entrance",
        "Disability Reception Area",
        "Disability Doorways",
        "Disability Emergency Exits",
      ];




      const facilityIds = facilityColumns
        .filter(column => {
          const value = row[column];
          return value &&
            value.toString().trim().toLowerCase() === "yes";
        })
        .map(column => facilityMap.get(column.toLowerCase()))
        .filter(Boolean);

      // console.log(facilityIds);
      // return;


      const imageUrl = row["Image"]?.trim() || "";

      let uploadedFiles = [];

      if (imageUrl) {

        const match = imageUrl.match(/\/d\/([^/]+)/);

        if (match) {

          const fileId = match[1];
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

          try {
            const response = await fetch(downloadUrl);
            if (response.ok) {

              const buffer = Buffer.from(await response.arrayBuffer());

              let ext = ".jpg";
              const contentType = response.headers.get("content-type");

              if (contentType?.includes("png")) ext = ".png";
              else if (contentType?.includes("jpeg")) ext = ".jpg";
              else if (contentType?.includes("webp")) ext = ".webp";

              const uniqueName = `${Date.now()}-${uuidv4()}${ext}`;

              const uploadDir = path.join(process.cwd(), "uploads/grounds");

              await fs.mkdir(uploadDir, { recursive: true });

              const filePath = path.join(uploadDir, uniqueName);

              await fs.writeFile(filePath, buffer);

              uploadedFiles.push(`/uploads/grounds/${uniqueName}`);
            }

          } catch (err) {
            console.error("Image download failed:", imageUrl, err.message);
          }
        }
      }


      groundsToInsert.push({
        name: groundName,
        add1: row["Address"]?.trim() || "",
        facilities: facilityIds,
        lat: geo.lat,
        long: geo.lng,
        images: uploadedFiles,
        location: {
          type: "Point",
          coordinates: [geo.lng, geo.lat], // IMPORTANT
        },
      });

    }
    if (groundsToInsert.length) {
      await Grounds.insertMany(groundsToInsert);
    }
    return Response.json({
      success: true,
      inserted: groundsToInsert.length,
      skipped: rows.length - groundsToInsert.length,
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
