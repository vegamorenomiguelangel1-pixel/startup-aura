import type { Metadata } from "next";
import { ServiceList } from "@/components/service-card";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { servicePath } from "@/lib/roles";
import { listEmployeeServices } from "@/lib/services";
import { isOpenStatus, isServiceStatus } from "@/lib/status";

export const metadata: Metadata = { title: "Servicios" };

export default async function EmployeeServicesPage() {
  const user = await requireUser(["EMPLOYEE"]);
  const services = await listEmployeeServices(user.id);
  const active = services.filter((service) => isServiceStatus(service.status) && isOpenStatus(service.status));
  const history = services
    .filter((service) => isServiceStatus(service.status) && !isOpenStatus(service.status))
    .slice()
    .reverse();

  return (
    <>
      <PageHeader title="Servicios asignados" description="Solo ves las visitas de tu dúo." />
      <section className="mb-8" aria-labelledby="activos">
        <h2 id="activos" className="mb-3 font-display text-2xl">
          Activos
        </h2>
        <ServiceList
          services={active}
          hrefFor={(id) => servicePath("EMPLOYEE", id)}
          showClient
          emptyTitle="No tienes servicios activos"
        />
      </section>
      <section aria-labelledby="historial">
        <h2 id="historial" className="mb-3 font-display text-2xl">
          Historial
        </h2>
        <ServiceList
          services={history}
          hrefFor={(id) => servicePath("EMPLOYEE", id)}
          showClient
          emptyTitle="Todavía no hay historial"
        />
      </section>
    </>
  );
}
