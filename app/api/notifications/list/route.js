import Notification from "@/lib/models/Notification";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
export async function GET(req) {

    const authResult = await protectApiRoute(req);
    // Check if the middleware returned a NextResponse object (error)
    if (authResult instanceof NextResponse) {
        return authResult;
    }

    // Otherwise, it means the user is authenticated
    const { user } = authResult;

    //console.log(user._id);
    

    const userId = user._id;
    const q = req.nextUrl.searchParams.get("q");
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    await connectDB();

    const query = {
        ...(q && { title: { $regex: q, $options: 'i' } }),
        userId
    };

    const total = await Notification.countDocuments(query);
    const list = await Notification.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();


    return NextResponse.json({
        success: true,
        data: list, // return oldest-first on the page
        pagination: {
            total, page, limit, totalPages: Math.ceil(total / limit)
        }
    });

}
