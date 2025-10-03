import { isAuthenticated } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const isAuth = await isAuthenticated();
  return NextResponse.json({ isAuthenticated: isAuth });
}
