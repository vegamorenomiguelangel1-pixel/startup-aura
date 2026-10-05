import type { Metadata } from "next";
import { ServiceList } from "@/components/service-card";
import { ActionLink, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { servicePath } from "@/lib/roles";
import { listClientServices } from "@/lib/services";
import { isOpenStatus, isServiceStatus } from "@/lib/status";

export const metadata: Metadata = { title: "Mis servicios" };

export default async function ClientServicesPage() {
  const user = await requireUser(["CLIENT"]);
  const services = await listClientServices(user.id);
  const open = services.filter((service) => isServiceStatus(service.status) && isOpenStatus(service.status));
  const history = services
    .filter((service) => isServiceStatus(service.status) && !isOpenStatus(service.status))
    .slice()
    .reverse();

  return (
    <>
      <PageHeader
        title="Mis servicios"
        description="Las solicitudes que hiciste y el estado de cada una."
        action={<ActionLink href="/cliente/servicios/nuevo">Nueva solicitud</ActionLink>}
      />
      <section className="mb-8" aria-labelledby="pendientes">
        <h2 id="pendientes" className="mb-3 font-display text-2xl">
          Pendientes
        </h2>
        <ServiceList
          services={open}
          hrefFor={(id) => servicePath("CLIENT", id)}
          emptyTitle="No tienes visitas pendientes"
          emptyBody="Agenda una limpieza de 4 a 5 horas por 250 Bs."
          emptyAction={<ActionLink href="/cliente/servicios/nuevo">Solicitar servicio</ActionLink>}
        />
      </section>
      <section aria-labelledby="historial-lista">
        <h2 id="historial-lista" className="mb-3 font-display text-2xl">
          Historial
        </h2>
        <ServiceList
          services={history}
          hrefFor={(id) => servicePath("CLIENT", id)}
          emptyTitle="Todavía no hay historial"
        />
      </section>
    </>
  );
}
