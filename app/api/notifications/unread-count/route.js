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
    await connectDB();
    const count = await Notification.countDocuments({
        userId: user._id,
        isRead: false,
    });
    return NextResponse.json({
        success: true,
        message: {
            count: count
        },
    });
}


