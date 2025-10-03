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

  return NextResponse.json({
    success: true,
    message: "Welcome to the profile page!",
    user,
  });
}
