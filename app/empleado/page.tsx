import type { Metadata } from "next";
import { ServiceSections, type ListedService } from "@/components/ServiceSections";
import { requireUser } from "@/lib/auth";
import { greeting } from "@/lib/format";
import type { Status } from "@/lib/labels";
import { listServices } from "@/lib/repository";

export const metadata: Metadata = { title: "Mis servicios" };

export default async function EmpleadoPage() {
  const user = await requireUser("EMPLOYEE");
  const services = await listServices({ assigneeId: user.id });

  const listed: ListedService[] = services.map((service) => ({
    id: service.id,
    address: service.address,
    zone: service.zone,
    scheduledAt: service.scheduledAt,
    status: service.status as Status,
    priceBs: service.priceBs,
    assigneeNames: service.assignments.map((item) => item.employee.name),
  }));

  return (
    <>
      <h1 className="font-display text-4xl text-balance">{greeting(user.name)}</h1>
      <p className="mt-2 max-w-2xl text-lg text-muted">
        {user.duoRole ? `${user.duoRole}. ` : ""}
        Abra un servicio para marcar cuándo sale, cuándo empieza y cuándo termina.
      </p>
      <ServiceSections
        services={listed}
        hrefBase="/empleado/servicios"
        activeTitle="Por hacer"
        historyTitle="Historial"
        activeEmpty="Cuando administración le asigne un servicio, aparecerá aquí."
        historyEmpty="Los servicios terminados o cancelados se listan aquí."
      />
    </>
  );
}
