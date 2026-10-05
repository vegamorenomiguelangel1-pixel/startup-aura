import { notFound } from "next/navigation";
import { StatusActions } from "@/components/StatusActions";
import { ServiceDetail } from "@/components/ServiceDetail";
import { requireUser } from "@/lib/auth";
import type { Status } from "@/lib/labels";
import { getService } from "@/lib/services";

export const metadata = { title: "Servicio" };

export default async function ClienteServicioPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nueva?: string }>;
}) {
  const user = await requireUser("CLIENT");
  const { id } = await params;
  const { nueva } = await searchParams;
  const service = await getService(id);
  if (!service || service.clientId !== user.id) notFound();

  const canCancel = service.status === "SOLICITADO" || service.status === "ASIGNADO";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {nueva === "1" ? (
        <p role="status" className="rounded-2xl bg-sky-soft px-4 py-3 text-pine-dark">
          Solicitud registrada. El equipo de Aura asignará un dúo.
        </p>
      ) : null}
      <ServiceDetail
        service={{ ...service, status: service.status as Status }}
        backHref="/cliente"
        backLabel="Volver a mis servicios"
        showClient={false}
        showPhones={false}
        showMaps={false}
      >
        {canCancel ? (
          <StatusActions serviceId={service.id} options={["CANCELADO"]} cancelLabel="Cancelar solicitud" />
        ) : (
          <p className="text-muted">Cuando el dúo esté en camino, el estado se actualizará desde el equipo.</p>
        )}
      </ServiceDetail>
    </div>
  );
}
