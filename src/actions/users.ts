"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { fieldErrors, formValues, type ActionState } from "@/lib/form";
import { isRole } from "@/lib/roles";
import { duoSchema, userSchema } from "@/lib/validators";

function refreshPeople() {
  revalidatePath("/admin");
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/duos");
  revalidatePath("/admin/servicios");
}

export async function createUser(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser(["ADMIN"]);
  const values = formValues(formData, ["name", "email", "phone", "password", "role"]);
  const parsed = userSchema.safeParse({
    ...values,
    email: values.email.trim().toLowerCase(),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values: { ...values, password: "" } };
  }
  if (!isRole(parsed.data.role)) {
    return { error: "Elige un rol.", values };
  }

  try {
    await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        passwordHash: await bcrypt.hash(parsed.data.password, 10),
        role: parsed.data.role,
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return {
        error: "Ese correo ya está registrado.",
        fieldErrors: { email: "Ese correo ya está registrado." },
        values: { ...values, password: "" },
      };
    }
    throw error;
  }

  refreshPeople();
  redirect("/admin/usuarios?ok=usuario");
}

export async function updateUser(formData: FormData) {
  const actor = await requireUser(["ADMIN"]);
  const userId = String(formData.get("userId") ?? "");
  const role = String(formData.get("role") ?? "");
  const password = String(formData.get("password") ?? "").trim();
  if (!isRole(role)) redirect("/admin/usuarios?error=invalido");

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target || !isRole(target.role)) redirect("/admin/usuarios?error=invalido");

  if (password && password.length < 8) {
    redirect("/admin/usuarios?error=password");
  }
  if (target.role === "ADMIN" && role !== "ADMIN") {
    const admins = await prisma.user.count({ where: { role: "ADMIN" } });
    if (admins <= 1) redirect("/admin/usuarios?error=admin");
  }

  await prisma.user.update({
    where: { id: target.id },
    data: {
      role,
      duoId: role === "EMPLOYEE" ? target.duoId : null,
      duoRole: role === "EMPLOYEE" ? target.duoRole : null,
      ...(password ? { passwordHash: await bcrypt.hash(password, 10) } : {}),
    },
  });

  refreshPeople();
  if (actor.id === target.id && role !== "ADMIN") {
    redirect("/salir");
  }
  redirect("/admin/usuarios?ok=rol");
}

export async function createDuo(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireUser(["ADMIN"]);
  const values = formValues(formData, ["name", "apoyoId", "integranteId", "notes"]);
  const parsed = duoSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }
  if (parsed.data.apoyoId === parsed.data.integranteId) {
    return {
      error: "El integrante y el compañero de apoyo deben ser dos personas distintas.",
      values,
    };
  }

  const members = await prisma.user.findMany({
    where: { id: { in: [parsed.data.apoyoId, parsed.data.integranteId] } },
  });
  const available = members.filter((member) => member.role === "EMPLOYEE" && !member.duoId);
  if (available.length !== 2) {
    return {
      error: "Elige dos personas del equipo que todavía no estén en un dúo.",
      values,
    };
  }

  await prisma.$transaction(async (tx) => {
    const duo = await tx.duo.create({
      data: {
        name: parsed.data.name,
        notes: parsed.data.notes || null,
      },
    });
    await tx.user.update({
      where: { id: parsed.data.apoyoId },
      data: { duoId: duo.id, duoRole: "APOYO" },
    });
    await tx.user.update({
      where: { id: parsed.data.integranteId },
      data: { duoId: duo.id, duoRole: "INTEGRANTE" },
    });
  });

  refreshPeople();
  redirect("/admin/duos?ok=duo");
}

export async function removeFromDuo(formData: FormData) {
  await requireUser(["ADMIN"]);
  const userId = String(formData.get("userId") ?? "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.duoId) redirect("/admin/duos?error=invalido");

  await prisma.user.update({
    where: { id: user.id },
    data: { duoId: null, duoRole: null },
  });
  refreshPeople();
  redirect("/admin/duos?ok=quitado");
}
