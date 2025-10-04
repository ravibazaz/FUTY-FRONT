// app/api/logout/route.js
import { NextResponse } from "next/server";

export async function GET() {
  // Create a JSON response
  const res = NextResponse.json({ success: true });

  // Clear cookies
  res.cookies.set("auth_token", "", { maxAge: 0 });
  res.cookies.set("user_id", "", { maxAge: 0 });

  return res;
}
