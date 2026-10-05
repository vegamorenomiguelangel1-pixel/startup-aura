import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { isRole, servicePath, type Role } from "./roles";
import { isServiceStatus } from "./status";

export const serviceInclude = {
  client: { select: { id: true, name: true, phone: true, email: true } },
  duo: true,
  assignments: {
    include: {
      employee: { select: { id: true, name: true, phone: true, duoRole: true } },
    },
    orderBy: { createdAt: "asc" as const },
  },
  events: {
    include: { actor: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "asc" as const },
  },
} as const;

export async function getVisibleService(id: string, user: { id: string; role: string }) {
  if (!isRole(user.role)) return null;
  const service = await prisma.service.findUnique({
    where: { id },
    include: serviceInclude,
  });
  if (!service || !isServiceStatus(service.status)) return null;
  if (user.role === "ADMIN") return service;
  if (user.role === "CLIENT" && service.clientId === user.id) return service;
  if (user.role === "EMPLOYEE" && service.assignments.some((item) => item.employeeId === user.id)) {
    return service;
  }
  return null;
}

export function hrefFor(role: Role, serviceId: string) {
  return servicePath(role, serviceId);
}

export type ServiceRecord = Prisma.ServiceGetPayload<{ include: typeof serviceInclude }>;

export async function listClientServices(clientId: string) {
  return prisma.service.findMany({
    where: { clientId },
    include: serviceInclude,
    orderBy: { scheduledAt: "asc" },
  });
}

export async function listEmployeeServices(employeeId: string) {
  return prisma.service.findMany({
    where: { assignments: { some: { employeeId } } },
    include: serviceInclude,
    orderBy: { scheduledAt: "asc" },
  });
}

export async function listAllServices(status?: string) {
  return prisma.service.findMany({
    where: status && isServiceStatus(status) ? { status } : undefined,
    include: serviceInclude,
    orderBy: { scheduledAt: "asc" },
  });
}
