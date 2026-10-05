import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AssignDuo } from "@/components/assign-duo";
import { adminCanCancel, CancelServiceForm } from "@/components/status-actions";
import { ServiceView } from "@/components/service-view";
import { Flash } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { one } from "@/lib/flash";
import { prisma } from "@/lib/prisma";
import { getVisibleService } from "@/lib/services";

export const metadata: Metadata = { title: "Servicio" };

export default async function AdminServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const user = await requireUser(["ADMIN"]);
  const service = await getVisibleService(id, user);
  if (!service) notFound();
  const duos = await prisma.duo.findMany({
    include: { members: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <Link href="/admin/servicios" className="mb-4 inline-flex min-h-11 items-center font-bold text-teal">
        Volver a servicios
      </Link>
      <Flash ok={one(query.ok)} error={one(query.error)} />
      <ServiceView service={service} audience="admin">
        <AssignDuo serviceId={service.id} status={service.status} currentDuoId={service.duoId} duos={duos} />
        {adminCanCancel(service.status) ? (
          <CancelServiceForm serviceId={service.id} returnTo={`/admin/servicios/${service.id}`} />
        ) : null}
      </ServiceView>
    </>
  );
}
