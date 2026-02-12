import Notification from "@/lib/models/Notification";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
export async function POST(req) {

    const authResult = await protectApiRoute(req);
    // Check if the middleware returned a NextResponse object (error)
    if (authResult instanceof NextResponse) {
        return authResult;
    }
    // Otherwise, it means the user is authenticated
    const { user } = authResult;
    const { id } = await req.json();

    await connectDB();

    await Notification.findByIdAndUpdate(id, {
        isRead: true,
        readAt: new Date(),
    });

    return NextResponse.json({
        success: true,
        message: "Successfully read",
    });


}
