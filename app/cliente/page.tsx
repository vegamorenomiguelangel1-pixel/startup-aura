import type { Metadata } from "next";
import Link from "next/link";
import { ServiceSections, type ListedService } from "@/components/ServiceSections";
import { requireUser } from "@/lib/auth";
import { greeting } from "@/lib/format";
import type { Status } from "@/lib/labels";
import { listServices } from "@/lib/repository";

export const metadata: Metadata = { title: "Mis servicios" };

export default async function ClientePage() {
  const user = await requireUser("CLIENT");
  const services = await listServices({ clientId: user.id });

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
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-balance">{greeting(user.name)}</h1>
          <p className="mt-2 max-w-2xl text-lg text-muted">
            Solicite una limpieza del dúo o revise el estado de sus servicios.
          </p>
        </div>
        <Link
          href="/cliente/nuevo"
          className="inline-flex min-h-12 items-center rounded-full bg-pine px-5 font-bold text-white"
        >
          Solicitar servicio
        </Link>
      </div>
      <ServiceSections
        services={listed}
        hrefBase="/cliente/servicios"
        activeTitle="Próximos y en curso"
        historyTitle="Historial"
        activeEmpty="Todavía no tiene servicios activos. Solicite una limpieza cuando lo necesite."
        historyEmpty="Cuando un servicio termine o se cancele, quedará en el historial."
      />
    </>
  );
}
