"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireUser, safeReturnTo } from "@/lib/auth";
import { DEFAULT_DURATION_HOURS, DEFAULT_PRICE_BS } from "@/lib/constants";
import { fieldErrors, formValues, type ActionState } from "@/lib/form";
import { isDuoRole, isRole, servicePath } from "@/lib/roles";
import { parsePazDateTime } from "@/lib/format";
import {
  canAdminCancel,
  canAssignDuo,
  canClientCancel,
  canEmployeeTransition,
  canUnassignDuo,
  isServiceStatus,
  statusChangeMessage,
} from "@/lib/status";
import { noteSchema, serviceSchema } from "@/lib/validators";

function refreshService(id: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/servicios");
  revalidatePath(`/admin/servicios/${id}`);
  revalidatePath("/empleado");
  revalidatePath("/empleado/agenda");
  revalidatePath("/empleado/servicios");
  revalidatePath(`/empleado/servicios/${id}`);
  revalidatePath("/cliente");
  revalidatePath("/cliente/servicios");
  revalidatePath(`/cliente/servicios/${id}`);
}

export async function createService(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser(["CLIENT"]);
  const values = formValues(formData, ["address", "zone", "reference", "notes", "date", "time"]);
  const parsed = serviceSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  const scheduledAt = parsePazDateTime(parsed.data.date, parsed.data.time);
  if (!scheduledAt) {
    return { error: "Esa fecha no es válida.", values };
  }

  const service = await prisma.service.create({
    data: {
      clientId: user.id,
      address: parsed.data.address,
      zone: parsed.data.zone,
      reference: parsed.data.reference || null,
      notes: parsed.data.notes || null,
      scheduledAt,
      durationHours: DEFAULT_DURATION_HOURS,
      priceBs: DEFAULT_PRICE_BS,
      status: "SOLICITADO",
      events: {
        create: {
          actorId: user.id,
          message: "Servicio solicitado.",
        },
      },
    },
  });

  refreshService(service.id);
  redirect(`${servicePath("CLIENT", service.id)}?ok=solicitado`);
}

export async function updateServiceStatus(formData: FormData) {
  const user = await requireUser();
  if (!isRole(user.role)) redirect("/salir");

  const serviceId = String(formData.get("serviceId") ?? "");
  const nextStatus = String(formData.get("status") ?? "");
  const noteResult = noteSchema.safeParse(String(formData.get("note") ?? ""));
  const returnTo = safeReturnTo(user.role, serviceId, String(formData.get("returnTo") ?? ""));

  if (!noteResult.success) {
    redirect(`${returnTo}?error=invalido`);
  }
  if (!isServiceStatus(nextStatus)) {
    redirect(`${returnTo}?error=transicion`);
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { assignments: true },
  });
  if (!service || !isServiceStatus(service.status)) {
    redirect(`${homeFallback(user.role)}?error=no_encontrado`);
  }

  const allowed =
    user.role === "EMPLOYEE"
      ? service.assignments.some((item) => item.employeeId === user.id) &&
        canEmployeeTransition(service.status, nextStatus)
      : user.role === "CLIENT"
        ? service.clientId === user.id && nextStatus === "CANCELADO" && canClientCancel(service.status)
        : nextStatus === "CANCELADO" && canAdminCancel(service.status);

  if (!allowed) {
    redirect(`${returnTo}?error=transicion`);
  }

  const note = noteResult.data;
  await prisma.$transaction([
    prisma.service.update({ where: { id: service.id }, data: { status: nextStatus } }),
    prisma.serviceEvent.create({
      data: {
        serviceId: service.id,
        actorId: user.id,
        message: statusChangeMessage(nextStatus, note || undefined),
      },
    }),
  ]);

  refreshService(service.id);
  redirect(`${returnTo}?ok=${nextStatus === "CANCELADO" ? "cancelado" : "estado"}`);
}

export async function assignDuo(formData: FormData) {
  const user = await requireUser(["ADMIN"]);
  const serviceId = String(formData.get("serviceId") ?? "");
  const duoId = String(formData.get("duoId") ?? "");
  const returnTo = `/admin/servicios/${serviceId}`;

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !isServiceStatus(service.status)) {
    redirect("/admin/servicios?error=no_encontrado");
  }
  if (!canAssignDuo(service.status)) {
    redirect(`${returnTo}?error=cerrado`);
  }

  const duo = await prisma.duo.findUnique({
    where: { id: duoId },
    include: { members: true },
  });
  if (!duo || duo.members.length !== 2 || duo.members.some((member) => member.role !== "EMPLOYEE")) {
    redirect(`${returnTo}?error=duo`);
  }

  const nextStatus = service.status === "SOLICITADO" ? "ASIGNADO" : service.status;
  const names = duo.members
    .map((member) => {
      const role = member.duoRole && isDuoRole(member.duoRole) ? member.duoRole : null;
      const label = role === "APOYO" ? "compañero de apoyo" : role === "INTEGRANTE" ? "integrante del dúo" : "equipo";
      return `${member.name} (${label})`;
    })
    .join(" y ");

  await prisma.$transaction([
    prisma.serviceAssignment.deleteMany({ where: { serviceId: service.id } }),
    prisma.serviceAssignment.createMany({
      data: duo.members.map((member) => ({
        serviceId: service.id,
        employeeId: member.id,
        duoRole: member.duoRole,
      })),
    }),
    prisma.service.update({
      where: { id: service.id },
      data: { duoId: duo.id, status: nextStatus },
    }),
    prisma.serviceEvent.create({
      data: {
        serviceId: service.id,
        actorId: user.id,
        message: `Se asignó ${duo.name}: ${names}.`,
      },
    }),
  ]);

  refreshService(service.id);
  redirect(`${returnTo}?ok=asignado`);
}

export async function unassignDuo(formData: FormData) {
  const user = await requireUser(["ADMIN"]);
  const serviceId = String(formData.get("serviceId") ?? "");
  const returnTo = `/admin/servicios/${serviceId}`;
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || !isServiceStatus(service.status) || !canUnassignDuo(service.status)) {
    redirect(`${returnTo}?error=transicion`);
  }

  await prisma.$transaction([
    prisma.serviceAssignment.deleteMany({ where: { serviceId: service.id } }),
    prisma.service.update({
      where: { id: service.id },
      data: { duoId: null, status: "SOLICITADO" },
    }),
    prisma.serviceEvent.create({
      data: {
        serviceId: service.id,
        actorId: user.id,
        message: "Se retiró el dúo. El servicio volvió a solicitado.",
      },
    }),
  ]);

  refreshService(service.id);
  redirect(`${returnTo}?ok=sin_duo`);
}

function homeFallback(role: "ADMIN" | "EMPLOYEE" | "CLIENT") {
  if (role === "ADMIN") return "/admin/servicios";
  if (role === "EMPLOYEE") return "/empleado/servicios";
  return "/cliente/servicios";
}
