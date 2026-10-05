import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { greeting } from "@/lib/format";
import {
  isHistoryStatus,
  isStatus,
  ROLE_LABEL,
  STATUS_LABEL,
  STATUSES,
  type AppRole,
  type Status,
} from "@/lib/labels";
import { serviceInclude } from "@/lib/services";

export const metadata: Metadata = { title: "Servicios" };

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const user = await requireUser("ADMIN");
  const { estado } = await searchParams;
  const statusFilter = estado && isStatus(estado) ? estado : undefined;

  const [services, grouped, people] = await Promise.all([
    prisma.service.findMany({
      where: statusFilter ? { status: statusFilter } : undefined,
      include: serviceInclude,
      orderBy: { scheduledAt: "asc" },
    }),
    prisma.service.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
    prisma.user.groupBy({
      by: ["role"],
      _count: { _all: true },
    }),
  ]);

  const counts = Object.fromEntries(STATUSES.map((status) => [status, 0])) as Record<Status, number>;
  for (const row of grouped) counts[row.status] = row._count._all;
  const total = Object.values(counts).reduce((sum, value) => sum + value, 0);

  const listed = services.map((service) => ({
    id: service.id,
    address: service.address,
    zone: service.zone,
    scheduledAt: service.scheduledAt,
    status: service.status as Status,
    priceBs: service.priceBs,
    assigneeNames: service.assignments.map((item) => item.employee.name),
  }));

  const active = listed.filter((service) => !isHistoryStatus(service.status));
  const history = listed
    .filter((service) => isHistoryStatus(service.status))
    .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());

  const peopleLine = people
    .map((row) => `${row._count._all} ${ROLE_LABEL[row.role as AppRole].toLowerCase()}`)
    .join(" · ");

  return (
    <>
      <h1 className="font-display text-4xl text-balance">{greeting(user.name)}</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">
        {total} servicios en total. {peopleLine || "Sin personas registradas."}
      </p>

      <section className="mt-6" aria-labelledby="resumen">
        <h2 id="resumen" className="sr-only">
          Servicios por estado
        </h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {STATUSES.map((status) => (
            <li key={status}>
              <Link
                href={`/admin?estado=${status}`}
                className="block rounded-2xl border border-line bg-card px-4 py-3 hover:border-pine"
              >
                <span className="block font-display text-3xl">{counts[status]}</span>
                <span className="font-bold">{STATUS_LABEL[status]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap gap-2" aria-label="Filtrar por estado">
        <FilterChip href="/admin" current={!statusFilter}>
          Todos
        </FilterChip>
        {STATUSES.map((status) => (
          <FilterChip key={status} href={`/admin?estado=${status}`} current={statusFilter === status}>
            {STATUS_LABEL[status]}
          </FilterChip>
        ))}
      </div>

      {statusFilter ? (
        <section className="mt-8">
          <h2 className="font-display text-3xl">{STATUS_LABEL[statusFilter]}</h2>
          <ServiceStack services={listed} empty="No hay servicios en este estado." />
        </section>
      ) : (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="font-display text-3xl">
              En curso y por hacer <span className="text-muted">({active.length})</span>
            </h2>
            <ServiceStack services={active} empty="No hay servicios pendientes." />
          </section>
          <section>
            <h2 className="font-display text-3xl">
              Historial <span className="text-muted">({history.length})</span>
            </h2>
            <ServiceStack services={history} empty="Todavía no hay servicios terminados." />
          </section>
        </div>
      )}
      <p className="mt-8 text-sm text-muted">Los horarios están en hora de Bolivia (Santa Cruz).</p>
    </>
  );
}

function FilterChip({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-full px-4 font-bold ${
        current ? "bg-pine text-white" : "border border-line bg-card"
      }`}
    >
      {children}
    </Link>
  );
}

function ServiceStack({
  services,
  empty,
}: {
  services: {
    id: string;
    address: string;
    zone: string | null;
    scheduledAt: Date;
    status: Status;
    priceBs: number;
    assigneeNames: string[];
  }[];
  empty: string;
}) {
  if (services.length === 0) {
    return <p className="mt-4 rounded-2xl border border-dashed border-line px-4 py-6 text-muted">{empty}</p>;
  }
  return (
    <ul className="mt-4 space-y-4">
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} href={`/admin/servicios/${service.id}`} />
        </li>
      ))}
    </ul>
  );
}
