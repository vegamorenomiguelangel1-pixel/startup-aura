"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { isRole, type AppRole } from "@/lib/labels";
import { createAppUser, getUser, listDuos, updateUserRole as saveRole } from "@/lib/repository";

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
  const duoId = clean(formData.get("duoId"), 128);
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
    const duos = await listDuos();
    if (!duos.some((duo) => duo.id === duoId)) return { error: "No encontramos ese dúo." };
    linkedDuo = duoId;
  }

  const created = await createAppUser({
    name,
    email,
    password,
    role,
    phone: phone || null,
    duoId: linkedDuo,
    duoRole: role === "EMPLOYEE" && duoRole ? duoRole : null,
  });
  if ("error" in created) {
    return {
      error: created.error === "exists" ? "Ese correo ya está registrado." : "No se pudo crear el usuario.",
    };
  }

  revalidatePath("/admin/usuarios");
  return { success: `Usuario creado: ${name}.` };
}

export async function updateUserRole(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const admin = await requireUser("ADMIN");
  const userId = clean(formData.get("userId"), 128);
  const roleValue = String(formData.get("role") ?? "");
  if (!isRole(roleValue)) return { error: "Elija un rol." };
  if (userId === admin.id) {
    return { error: "No puede cambiar su propio rol." };
  }

  const user = await getUser(userId);
  if (!user) return { error: "No encontramos a esa persona." };

  const saved = await saveRole(userId, roleValue);
  if (!saved) return { error: "No encontramos a esa persona." };
  revalidatePath("/admin/usuarios");
  return { success: "Rol actualizado." };
}
