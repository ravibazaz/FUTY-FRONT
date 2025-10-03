"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return false;

  const payload = await verifyToken(token);
  return !!payload; // Returns true if token is valid, false otherwise
}
