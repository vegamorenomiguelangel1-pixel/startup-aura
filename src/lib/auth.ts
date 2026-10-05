import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { homeForRole, isRole, type Role } from "./roles";
import { readSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, signSession, type SessionPayload } from "./session";

export const getCurrentUser = cache(async () => {
  const jar = await cookies();
  const session = await readSessionToken(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { duo: true },
  });
  if (!user || !isRole(user.role)) return null;
  return user;
});

export async function requireUser(roles?: Role[]) {
  const user = await getCurrentUser();
  if (!user || !isRole(user.role)) redirect("/salir");
  if (roles && !roles.includes(user.role)) redirect(homeForRole(user.role));
  return user;
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_MAX_AGE));
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", sessionCookieOptions(0));
}

function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function safeReturnTo(role: Role, serviceId: string, raw: string) {
  const fallback = `${homeForRole(role)}/servicios/${serviceId}`;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("?")) return fallback;
  const prefix = homeForRole(role);
  if (raw !== `${prefix}/servicios/${serviceId}`) return fallback;
  return raw;
}
