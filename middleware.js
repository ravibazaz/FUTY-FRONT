import { NextResponse } from "next/server";
import { verifyToken } from "./lib/jwt";

export async function middleware(request) {
  const token = request.cookies.get("auth_token")?.value;

  //console.log(token);
  
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Add the email to request headers for further use
  const response = NextResponse.next();
  response.cookies.set('user_id', payload.user_id, { path: '/' });

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
