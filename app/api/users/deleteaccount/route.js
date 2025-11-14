import { NextResponse } from "next/server";
import { protectApiRoute } from "@/lib/middleware";
import Users from "@/lib/models/Users";
export async function GET(req) {
  // Prepare API response

  const authResult = await protectApiRoute(req);

  // Check if the middleware returned a NextResponse object (error)
  if (authResult instanceof NextResponse) {
    return authResult;
  }
  // Otherwise, it means the user is authenticated
  const { user } = authResult;

 // console.log(user);
  
  await Users.findByIdAndUpdate(user._id, { isActive: false });
  return NextResponse.json({
    success: false,
    message: "Your account is deleted",

  });

}
