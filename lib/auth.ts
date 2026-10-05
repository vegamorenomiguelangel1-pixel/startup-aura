import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "@/lib/db";
import { homeForRole, type AppRole } from "@/lib/labels";

const COOKIE = "aura_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  phone: string | null;
  duoId: string | null;
  duoRole: string | null;
};

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) {
    throw new Error("Falta AUTH_SECRET en el entorno.");
  }
  return new TextEncoder().encode(value);
}

export async function signIn(userId: string) {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub) return null;
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        duoId: true,
        duoRole: true,
      },
    });
    return user;
  } catch {
    return null;
  }
}

export async function requireUser(role?: AppRole) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (role && user.role !== role) redirect(homeForRole(user.role));
  return user;
}

export function safeNextPath(value: FormDataEntryValue | null, role: AppRole) {
  const home = homeForRole(role);
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return home;
  }
  const allowed =
    role === "ADMIN" ? "/admin" : role === "EMPLOYEE" ? "/empleado" : "/cliente";
  if (value === allowed || value.startsWith(`${allowed}/`)) return value;
  return home;
}
