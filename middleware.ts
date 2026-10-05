import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("aura_session")?.value;
  if (token) return NextResponse.next();

  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ["/cliente/:path*", "/empleado/:path*", "/admin/:path*"],
};
