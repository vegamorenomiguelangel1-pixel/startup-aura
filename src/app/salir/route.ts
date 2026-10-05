import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

function endSession(request: Request) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: Request) {
  return endSession(request);
}

export async function POST(request: Request) {
  return endSession(request);
}
