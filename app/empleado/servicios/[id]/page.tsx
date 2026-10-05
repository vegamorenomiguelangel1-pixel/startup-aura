import { notFound } from "next/navigation";
import { StatusActions } from "@/components/StatusActions";
import { ServiceDetail } from "@/components/ServiceDetail";
import { requireUser } from "@/lib/auth";
import { EMPLOYEE_TRANSITIONS, type Status } from "@/lib/labels";
import { getService } from "@/lib/services";

export const metadata = { title: "Servicio" };

export default async function EmpleadoServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser("EMPLOYEE");
  const { id } = await params;
  const service = await getService(id);
  const assigned = service?.assignments.some((item) => item.employeeId === user.id);
  if (!service || !assigned) notFound();

  const options = EMPLOYEE_TRANSITIONS[service.status as Status];

  return (
    <div className="mx-auto max-w-3xl">
      <ServiceDetail
        service={{ ...service, status: service.status as Status }}
        backHref="/empleado"
        backLabel="Volver a mis servicios"
        showClient
        showPhones
        showMaps
      >
        <section aria-labelledby="actualizar-estado">
          <h2 id="actualizar-estado" className="font-display text-2xl">
            Actualizar estado
          </h2>
          <p className="mt-1 mb-4 text-muted">
            Márquelo cuando salga hacia el domicilio, cuando empiece y cuando termine.
          </p>
          {options.length > 0 ? (
            <StatusActions serviceId={service.id} options={options} />
          ) : (
            <p>Este servicio ya no admite cambios.</p>
          )}
        </section>
      </ServiceDetail>
    </div>
  );
}
