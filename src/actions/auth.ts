"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clearSessionCookie, setSessionCookie } from "@/lib/auth";
import { fieldErrors, formValues, type ActionState } from "@/lib/form";
import { isRole, safeNextPath } from "@/lib/roles";
import { loginSchema } from "@/lib/validators";

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const values = formValues(formData, ["email", "password"]);
  const parsed = loginSchema.safeParse({
    email: values.email.trim().toLowerCase(),
    password: values.password,
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values: { email: values.email } };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  const valid = user ? await bcrypt.compare(parsed.data.password, user.passwordHash) : false;
  if (!user || !valid || !isRole(user.role)) {
    return {
      error: "Correo o contraseña incorrectos.",
      values: { email: values.email },
    };
  }

  await setSessionCookie({
    sub: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });
  redirect(safeNextPath(user.role, String(formData.get("next") ?? "")));
}

export async function logout() {
  await clearSessionCookie();
  redirect("/login");
}
