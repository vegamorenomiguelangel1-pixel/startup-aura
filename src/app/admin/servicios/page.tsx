import type { Metadata } from "next";
import Link from "next/link";
import { ServiceList } from "@/components/service-card";
import { Flash, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { one } from "@/lib/flash";
import { servicePath } from "@/lib/roles";
import { listAllServices } from "@/lib/services";
import { SERVICE_STATUSES, STATUS_LABEL, isServiceStatus } from "@/lib/status";

export const metadata: Metadata = { title: "Servicios" };

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string | string[]; ok?: string | string[]; error?: string | string[] }>;
}) {
  await requireUser(["ADMIN"]);
  const query = await searchParams;
  const estado = one(query.estado);
  const activeFilter = estado && isServiceStatus(estado) ? estado : undefined;
  const services = await listAllServices(activeFilter);

  return (
    <>
      <PageHeader title="Todos los servicios" description="Filtra por estado y abre uno para asignar el dúo." />
      <Flash ok={one(query.ok)} error={one(query.error)} />
      <nav aria-label="Filtrar por estado" className="mb-6">
        <ul className="flex flex-wrap gap-2">
          <li>
            <FilterChip href="/admin/servicios" current={!activeFilter}>
              Todos
            </FilterChip>
          </li>
          {SERVICE_STATUSES.map((status) => (
            <li key={status}>
              <FilterChip href={`/admin/servicios?estado=${status}`} current={activeFilter === status}>
                {STATUS_LABEL[status]}
              </FilterChip>
            </li>
          ))}
        </ul>
      </nav>
      <ServiceList
        services={services}
        hrefFor={(id) => servicePath("ADMIN", id)}
        showClient
        emptyTitle="No hay servicios con ese filtro"
      />
    </>
  );
}

function FilterChip({ href, current, children }: { href: string; current: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-11 items-center rounded-full px-4 font-bold ${
        current ? "bg-ink text-white" : "bg-paper text-ink hover:bg-sand"
      }`}
    >
      {children}
    </Link>
  );
}
