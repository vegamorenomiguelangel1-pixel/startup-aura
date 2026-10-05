import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelServiceForm, clientCanCancel } from "@/components/status-actions";
import { ServiceView } from "@/components/service-view";
import { Flash } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { one } from "@/lib/flash";
import { getVisibleService } from "@/lib/services";

export const metadata: Metadata = { title: "Servicio" };

export default async function ClientServicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ ok?: string | string[]; error?: string | string[] }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const user = await requireUser(["CLIENT"]);
  const service = await getVisibleService(id, user);
  if (!service) notFound();
  const returnTo = `/cliente/servicios/${service.id}`;

  return (
    <>
      <Link href="/cliente/servicios" className="mb-4 inline-flex min-h-11 items-center font-bold text-teal">
        Volver a mis servicios
      </Link>
      <Flash ok={one(query.ok)} error={one(query.error)} />
      <ServiceView service={service} audience="client">
        {clientCanCancel(service.status) ? <CancelServiceForm serviceId={service.id} returnTo={returnTo} /> : null}
      </ServiceView>
    </>
  );
}
