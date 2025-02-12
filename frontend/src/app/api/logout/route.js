import { NextResponse } from "next/server";

export async function POST(req) {
  const response = NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  response.cookies.set("token", "", { expires: new Date(0), path: "/" });
  return response;
}
