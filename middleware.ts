import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("aura_session")?.value;
  const login = request.nextUrl.clone();
  login.pathname = "/login";
  login.searchParams.set("next", request.nextUrl.pathname);

  if (!token || !process.env.AUTH_SECRET) {
    return NextResponse.redirect(login);
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(login);
    response.cookies.delete("aura_session");
    return response;
  }
}

export const config = {
  matcher: ["/cliente/:path*", "/empleado/:path*", "/admin/:path*"],
};
