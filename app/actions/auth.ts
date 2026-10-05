"use server";

import { redirect } from "next/navigation";
import { createSession, safeNextPath, signOut } from "@/lib/auth";
import { signInWithPassword } from "@/lib/firebase-auth";

export type AuthState = { error?: string };

export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Ingrese su correo y su contraseña." };
  }

  let user;
  try {
    const idToken = await signInWithPassword(email, password);
    if (!idToken) return { error: "Correo o contraseña incorrectos." };
    user = await createSession(idToken);
  } catch (error) {
    console.error(error);
    return { error: "No se pudo contactar a Firebase. Revise la configuración del entorno." };
  }
  if (!user) return { error: "La cuenta no tiene un perfil en Aura." };
  redirect(safeNextPath(formData.get("next"), user.role));
}

export async function logout() {
  await signOut();
  redirect("/");
}
