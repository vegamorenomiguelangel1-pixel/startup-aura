import type { Metadata } from "next";
import { ServiceList } from "@/components/service-card";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { dayKey, formatDay } from "@/lib/format";
import { DUO_ROLE_LABEL, isDuoRole, servicePath } from "@/lib/roles";
import { listEmployeeServices } from "@/lib/services";
import { isOpenStatus, isServiceStatus } from "@/lib/status";

export const metadata: Metadata = { title: "Inicio" };

export default async function EmployeeHomePage() {
  const user = await requireUser(["EMPLOYEE"]);
  const services = await listEmployeeServices(user.id);
  const today = dayKey(new Date());
  const active = services.filter((service) => isServiceStatus(service.status) && isOpenStatus(service.status));
  const todayServices = active.filter((service) => dayKey(service.scheduledAt) === today);
  const later = active.filter((service) => dayKey(service.scheduledAt) !== today);
  const role = user.duoRole && isDuoRole(user.duoRole) ? DUO_ROLE_LABEL[user.duoRole] : "Equipo dúo";

  return (
    <>
      <PageHeader
        eyebrow={user.duo?.name ?? "Sin dúo"}
        title={`Hola, ${user.name.split(" ")[0]}`}
        description={`${role}. Aquí están los servicios que te asignaron.`}
      />
      <section className="mb-8" aria-labelledby="hoy">
        <h2 id="hoy" className="mb-3 font-display text-2xl">
          Hoy, {formatDay(new Date())}
        </h2>
        <ServiceList
          services={todayServices}
          hrefFor={(id) => servicePath("EMPLOYEE", id)}
          emptyTitle="No tienes servicios para hoy"
          emptyBody="Revisa la agenda para ver los próximos días."
        />
      </section>
      <section aria-labelledby="despues">
        <h2 id="despues" className="mb-3 font-display text-2xl">
          Otros servicios activos
        </h2>
        <ServiceList
          services={later}
          hrefFor={(id) => servicePath("EMPLOYEE", id)}
          emptyTitle="No hay más servicios activos"
        />
      </section>
    </>
  );
}
