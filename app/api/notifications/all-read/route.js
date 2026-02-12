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

    await Notification.updateMany(
        { userId: user._id, isRead: false },
        { isRead: true, readAt: new Date() }
    );
    return NextResponse.json({
        success: true,
        message: "Successfully read all",
    });
}