// app/logout/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const res =  NextResponse.redirect(new URL("/", request.url));
  res.cookies.set('auth_token', '', { maxAge: 0 });
  res.cookies.set('user_id', '', { maxAge: 0 });
  return res;
}
