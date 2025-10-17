import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import User from "@/lib/models/Users";
export async function protectApiRoute(req) {
  try {
    const authHeader = req.headers.get("authorization");

    // Check if the Authorization header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No token provided" },
        { status: 200 }
      );
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];
    const userdata = await verifyToken(token);
    //console.log(user.email);
    if (!userdata) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Invalid or expired token" },
        { status: 200 }
      );
    }
   const user = await User.findOne({ email: userdata.email }).select('-__v -password');
    // If everything is okay, return the user object
    return { success: true, user };
  } catch (error) {
    console.error("Error in middleware:", error.message);
    return NextResponse.json(
      { success: false, message: "Unauthorized: Token verification failed" },
      { status: 200 }
    );
  }
}
