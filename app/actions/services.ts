"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { parseBoliviaDatetimeLocal } from "@/lib/format";
import {
  EMPLOYEE_TRANSITIONS,
  isHistoryStatus,
  isStatus,
  STATUSES,
  type Status,
} from "@/lib/labels";
import { OFFER } from "@/lib/offer";
import { createService as saveService, getService, listUsers, updateService } from "@/lib/repository";

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

  const id = await saveService({
    address,
    zone: zone || null,
    notes: notes || null,
    scheduledAt: when,
    durationHours: OFFER.durationHours,
    priceBs: OFFER.priceBs,
    clientId: user.id,
  });

  revalidateService(id);
  redirect(`/cliente/servicios/${id}?nueva=1`);
}

export async function updateServiceStatus(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const user = await requireUser();
  const id = cleanText(formData.get("serviceId"), 128);
  const nextStatus = String(formData.get("status") ?? "");
  if (!isStatus(nextStatus)) return { error: "Estado no válido." };

  const service = await getService(id);
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
    const allowed = EMPLOYEE_TRANSITIONS[service.status];
    if (!allowed.includes(nextStatus)) {
      return { error: "Ese cambio de estado no está permitido." };
    }
  }

  await updateService(id, { status: nextStatus });
  revalidateService(id);
  return { success: "Estado actualizado." };
}

export async function assignEmployees(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireUser("ADMIN");
  const id = cleanText(formData.get("serviceId"), 128);
  const ids = [
    ...new Set(
      formData
        .getAll("employeeId")
        .map((value) => String(value).trim())
        .filter(Boolean),
    ),
  ];

  const service = await getService(id);
  if (!service) return { error: "No encontramos el servicio." };

  const people = await listUsers();
  const employees = people.filter((person) => ids.includes(person.id) && person.role === "EMPLOYEE");
  if (employees.length !== ids.length) {
    return { error: "Hay una persona que no es empleada." };
  }

  let nextStatus: Status = service.status;
  if (service.status === "SOLICITADO" && ids.length > 0) nextStatus = "ASIGNADO";
  if (service.status === "ASIGNADO" && ids.length === 0) nextStatus = "SOLICITADO";

  await updateService(id, { assigneeIds: ids, status: nextStatus });
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
  const id = cleanText(formData.get("serviceId"), 128);
  const nextStatus = String(formData.get("status") ?? "");
  if (!isStatus(nextStatus) || !STATUSES.includes(nextStatus)) {
    return { error: "Estado no válido." };
  }
  const service = await getService(id);
  if (!service) return { error: "No encontramos el servicio." };
  if (isHistoryStatus(service.status) && nextStatus === service.status) {
    return { success: "Sin cambios." };
  }
  await updateService(id, { status: nextStatus });
  revalidateService(id);
  return { success: "Estado actualizado." };
}
