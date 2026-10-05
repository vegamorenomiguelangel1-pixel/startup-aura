"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, type ServiceStatus } from "@prisma/client";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseBoliviaDatetimeLocal } from "@/lib/format";
import {
  EMPLOYEE_TRANSITIONS,
  isHistoryStatus,
  isStatus,
  STATUSES,
  type Status,
} from "@/lib/labels";
import { OFFER } from "@/lib/offer";

export type ActionResult = { error?: string; success?: string };

function cleanText(value: FormDataEntryValue | null, max: number) {
  return String(value ?? "").trim().slice(0, max);
}

function revalidateService(id: string) {
  revalidatePath("/admin");
  revalidatePath("/empleado");
  revalidatePath("/cliente");
  revalidatePath(`/admin/servicios/${id}`);
  revalidatePath(`/empleado/servicios/${id}`);
  revalidatePath(`/cliente/servicios/${id}`);
}

export async function createService(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser("CLIENT");
  const address = cleanText(formData.get("address"), 200);
  const zone = cleanText(formData.get("zone"), 80);
  const notes = cleanText(formData.get("notes"), 500);
  const when = parseBoliviaDatetimeLocal(String(formData.get("scheduledAt") ?? ""));

  if (address.length < 8) {
    return { error: "Escriba una dirección más completa." };
  }
  if (!when) {
    return { error: "Elija una fecha y hora válidas." };
  }
  if (when.getTime() < Date.now() - 5 * 60 * 1000) {
    return { error: "Elija una fecha y hora futuras." };
  }
  const oneYear = Date.now() + 366 * 24 * 60 * 60 * 1000;
  if (when.getTime() > oneYear) {
    return { error: "La fecha no puede pasar de un año." };
  }

  const service = await prisma.service.create({
    data: {
      address,
      zone: zone || null,
      notes: notes || null,
      scheduledAt: when,
      durationHours: OFFER.durationHours,
      priceBs: OFFER.priceBs,
      status: "SOLICITADO",
      clientId: user.id,
    },
  });

  revalidateService(service.id);
  redirect(`/cliente/servicios/${service.id}?nueva=1`);
}

export async function updateServiceStatus(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const id = cleanText(formData.get("serviceId"), 40);
  const nextStatus = String(formData.get("status") ?? "");
  if (!isStatus(nextStatus)) return { error: "Estado no válido." };

  const service = await prisma.service.findUnique({
    where: { id },
    include: { assignments: true },
  });
  if (!service) return { error: "No encontramos el servicio." };

  if (user.role === "CLIENT") {
    if (service.clientId !== user.id) {
      return { error: "No puede modificar este servicio." };
    }
    const canCancel =
      nextStatus === "CANCELADO" &&
      (service.status === "SOLICITADO" || service.status === "ASIGNADO");
    if (!canCancel) {
      return { error: "Solo puede cancelar un servicio que aún no comenzó." };
    }
  } else if (user.role === "EMPLOYEE") {
    const assigned = service.assignments.some((item) => item.employeeId === user.id);
    if (!assigned) return { error: "Este servicio no está asignado a usted." };
    const allowed = EMPLOYEE_TRANSITIONS[service.status as Status];
    if (!allowed.includes(nextStatus)) {
      return { error: "Ese cambio de estado no está permitido." };
    }
  }

  await prisma.service.update({
    where: { id },
    data: { status: nextStatus as ServiceStatus },
  });
  revalidateService(id);
  return { success: "Estado actualizado." };
}

export async function assignEmployees(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireUser("ADMIN");
  const id = cleanText(formData.get("serviceId"), 40);
  const ids = [
    ...new Set(
      formData
        .getAll("employeeId")
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];

  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return { error: "No encontramos el servicio." };

  const employees = await prisma.user.findMany({
    where: { id: { in: ids }, role: "EMPLOYEE" },
    select: { id: true },
  });
  if (employees.length !== ids.length) {
    return { error: "Hay una persona que no es empleada." };
  }

  let nextStatus = service.status;
  if (service.status === "SOLICITADO" && ids.length > 0) nextStatus = "ASIGNADO";
  if (service.status === "ASIGNADO" && ids.length === 0) nextStatus = "SOLICITADO";

  try {
    await prisma.$transaction([
      prisma.assignment.deleteMany({ where: { serviceId: id } }),
      ...(ids.length
        ? [
            prisma.assignment.createMany({
              data: ids.map((employeeId) => ({ serviceId: id, employeeId })),
            }),
          ]
        : []),
      prisma.service.update({
        where: { id },
        data: { status: nextStatus },
      }),
    ]);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return { error: "No se pudo guardar la asignación." };
    }
    throw error;
  }

  revalidateService(id);
  const moved =
    nextStatus !== service.status
      ? ` El estado pasó a ${nextStatus === "ASIGNADO" ? "asignado" : "solicitado"}.`
      : "";
  return {
    success:
      ids.length === 0
        ? `Se quitó la asignación.${moved}`
        : `Asignación guardada.${moved}`,
  };
}

export async function adminSetStatus(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireUser("ADMIN");
  const id = cleanText(formData.get("serviceId"), 40);
  const nextStatus = String(formData.get("status") ?? "");
  if (!isStatus(nextStatus) || !STATUSES.includes(nextStatus)) {
    return { error: "Estado no válido." };
  }
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) return { error: "No encontramos el servicio." };
  if (isHistoryStatus(service.status) && nextStatus === service.status) {
    return { success: "Sin cambios." };
  }
  await prisma.service.update({
    where: { id },
    data: { status: nextStatus as ServiceStatus },
  });
  revalidateService(id);
  return { success: "Estado actualizado." };
}
