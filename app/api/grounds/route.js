import { connectDB } from '@/lib/db';
import Grounds from '@/lib/models/Grounds';

export async function GET(req) {
    try {
      await connectDB();
  
      const { searchParams } = new URL(req.url);
  
      const draw = Number(searchParams.get("draw") || 1);
      const start = Number(searchParams.get("start") || 0);
      const length = Number(searchParams.get("length") || 10);
      const searchValue = searchParams.get("search[value]") || "";
  
      const orderColIndex = searchParams.get("order[0][column]");
      const orderDir = searchParams.get("order[0][dir]") || "asc";
      const columns = ["name", "pin"];
      const sortField = columns[Number(orderColIndex)] || "createdAt";
      const sortOrder = orderDir === "desc" ? -1 : 1;
  
      const filter = searchValue
        ? { name: { $regex: `^${searchValue}`, $options: "i" } }
        : {};
  
      const [data, recordsFiltered, recordsTotal] = await Promise.all([
        Grounds.find(filter)
          .select("name pin")
          .sort({ [sortField]: sortOrder })
          .skip(start)
          .limit(length)
          .lean(),
        Grounds.countDocuments(filter),
        Grounds.countDocuments({}),
      ]);
  
      return Response.json({ draw, recordsTotal, recordsFiltered, data });
    } catch (err) {
      console.error("Failed to fetch grounds:", err);
      return Response.json(
        { draw: 0, recordsTotal: 0, recordsFiltered: 0, data: [], error: "Failed to fetch grounds" },
        { status: 500 }
      );
    }


}