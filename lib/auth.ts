import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { adminAuth } from "@/lib/firebase";
import { homeForRole, type AppRole } from "@/lib/labels";
import { getUser, type UserRecord } from "@/lib/repository";

const COOKIE = "aura_session";
const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

export type SessionUser = UserRecord;

async function readTokenUser(token: string) {
  const auth = adminAuth();
  try {
    const session = await auth.verifySessionCookie(token, false);
    return getUser(session.uid);
  } catch {
    try {
      const idToken = await auth.verifyIdToken(token, false);
      return getUser(idToken.uid);
    } catch {
      return null;
    }
  }
}

export async function createSession(idToken: string) {
  const auth = adminAuth();
  const decoded = await auth.verifyIdToken(idToken);
  const user = await getUser(decoded.uid);
  if (!user) return null;

  let value = idToken;
  let maxAge = 60 * 60;
  try {
    value = await auth.createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
    maxAge = FIVE_DAYS_MS / 1000;
  } catch (error) {
    console.error("No se pudo crear la cookie de sesión de Firebase.", error);
  }

  const jar = await cookies();
  jar.set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return user;
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  return readTokenUser(token);
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
  const allowed = role === "ADMIN" ? "/admin" : role === "EMPLOYEE" ? "/empleado" : "/cliente";
  if (value === allowed || value.startsWith(`${allowed}/`)) return value;
  return home;
}
