import { prisma } from "@/lib/db";

export const serviceInclude = {
  client: {
    select: { id: true, name: true, phone: true, email: true },
  },
  assignments: {
    include: {
      employee: {
        select: { id: true, name: true, phone: true, duoRole: true },
      },
    },
  },
} as const;

export async function getService(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: serviceInclude,
  });
}

export type ServiceWithRelations = NonNullable<Awaited<ReturnType<typeof getService>>>;
