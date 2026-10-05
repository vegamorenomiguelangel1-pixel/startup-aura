import type { Metadata } from "next";
import Link from "next/link";
import { ServiceList } from "@/components/service-card";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { pazDayBounds } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import { servicePath } from "@/lib/roles";
import { listAllServices } from "@/lib/services";
import { SERVICE_STATUSES, STATUS_LABEL, isOpenStatus, isServiceStatus } from "@/lib/status";

export const metadata: Metadata = { title: "Resumen" };

export default async function AdminHomePage() {
  await requireUser(["ADMIN"]);
  const grouped = await prisma.service.groupBy({
    by: ["status"],
    _count: { _all: true },
  });
  const counts = new Map(grouped.map((row) => [row.status, row._count._all]));
  const { start, end } = pazDayBounds(0);
  const todayCount = await prisma.service.count({
    where: { scheduledAt: { gte: start, lt: end }, status: { not: "CANCELADO" } },
  });
  const [duoCount, userCount] = await Promise.all([prisma.duo.count(), prisma.user.count()]);
  const upcoming = (await listAllServices()).filter(
    (service) => isServiceStatus(service.status) && isOpenStatus(service.status),
  );

  return (
    <>
      <PageHeader
        eyebrow="Administración"
        title="Operación de hoy"
        description={`${todayCount} servicio${todayCount === 1 ? "" : "s"} en la agenda de Santa Cruz. ${duoCount} dúo${duoCount === 1 ? "" : "s"} · ${userCount} usuarios.`}
      />
      <ul className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {SERVICE_STATUSES.map((status) => (
          <li key={status}>
            <Link
              href={`/admin/servicios?estado=${status}`}
              className="block h-full rounded-2xl border border-line bg-paper p-4 hover:border-teal"
            >
              <span className="block font-display text-4xl">{counts.get(status) ?? 0}</span>
              <span className="mt-1 block font-bold">{STATUS_LABEL[status]}</span>
            </Link>
          </li>
        ))}
      </ul>
      <section aria-labelledby="proximos">
        <h2 id="proximos" className="mb-3 font-display text-2xl">
          Servicios abiertos
        </h2>
        <ServiceList
          services={upcoming}
          hrefFor={(id) => servicePath("ADMIN", id)}
          showClient
          emptyTitle="No hay servicios abiertos"
        />
      </section>
    </>
  );
}
