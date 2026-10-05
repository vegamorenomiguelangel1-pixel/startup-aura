"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { Prisma, type Role } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isRole, type AppRole } from "@/lib/labels";

export type ActionResult = { error?: string; success?: string };

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

export async function createUser(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireUser("ADMIN");
  const name = clean(formData.get("name"), 80);
  const email = clean(formData.get("email"), 120).toLowerCase();
  const phone = clean(formData.get("phone"), 20);
  const password = String(formData.get("password") ?? "");
  const roleValue = String(formData.get("role") ?? "");
  const duoId = clean(formData.get("duoId"), 40);
  const duoRole = clean(formData.get("duoRole"), 80);

  if (name.length < 3) return { error: "Escriba el nombre completo." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Escriba un correo válido." };
  }
  if (password.length < 8) {
    return { error: "La contraseña debe tener al menos 8 caracteres." };
  }
  if (!isRole(roleValue)) return { error: "Elija un rol." };
  if (phone && !/^[0-9+\s()-]{6,20}$/.test(phone)) {
    return { error: "El teléfono no es válido." };
  }

  const role = roleValue as AppRole;
  let linkedDuo: string | null = null;
  if (role === "EMPLOYEE" && duoId) {
    const duo = await prisma.duo.findUnique({ where: { id: duoId } });
    if (!duo) return { error: "No encontramos ese dúo." };
    linkedDuo = duo.id;
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: role as Role,
        phone: phone || null,
        duoId: linkedDuo,
        duoRole: role === "EMPLOYEE" && duoRole ? duoRole : null,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { error: "Ese correo ya está registrado." };
    }
    return { error: "No se pudo crear el usuario." };
  }

  revalidatePath("/admin/usuarios");
  return { success: `Usuario creado: ${name}.` };
}

export async function updateUserRole(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireUser("ADMIN");
  const userId = clean(formData.get("userId"), 40);
  const roleValue = String(formData.get("role") ?? "");
  if (!isRole(roleValue)) return { error: "Elija un rol." };
  if (userId === admin.id) {
    return { error: "No puede cambiar su propio rol." };
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return { error: "No encontramos a esa persona." };

  await prisma.user.update({
    where: { id: userId },
    data: {
      role: roleValue as Role,
      duoId: roleValue === "EMPLOYEE" ? user.duoId : null,
      duoRole: roleValue === "EMPLOYEE" ? user.duoRole : null,
    },
  });
  revalidatePath("/admin/usuarios");
  return { success: "Rol actualizado." };
}
