import type { Metadata } from "next";
import { ActionLink, PageHeader } from "@/components/ui";
import { ServiceCard } from "@/components/service-card";
import { requireUser } from "@/lib/auth";
import { isOpenStatus, isServiceStatus } from "@/lib/status";
import { listClientServices } from "@/lib/services";
import { servicePath } from "@/lib/roles";

export const metadata: Metadata = { title: "Inicio" };

export default async function ClientHomePage() {
  const user = await requireUser(["CLIENT"]);
  const services = await listClientServices(user.id);
  const open = services.filter((service) => isServiceStatus(service.status) && isOpenStatus(service.status));
  const nextService = open[0];

  return (
    <>
      <PageHeader
        eyebrow="Cliente"
        title={`Hola, ${user.name.split(" ")[0]}`}
        description="Solicita una limpieza y sigue cada visita del dúo."
        action={<ActionLink href="/cliente/servicios/nuevo">Solicitar servicio</ActionLink>}
      />
      <section aria-labelledby="proximo">
        <h2 id="proximo" className="mb-3 font-display text-2xl">
          Próximo servicio
        </h2>
        {nextService ? (
          <ServiceCard service={nextService} href={servicePath("CLIENT", nextService.id)} />
        ) : (
          <p className="rounded-2xl border border-dashed border-line bg-paper px-5 py-8 text-muted">
            No tienes servicios pendientes. Cuando lo necesites, agenda uno en 250 Bs.
          </p>
        )}
      </section>
      <p className="mt-6 text-muted">
        {open.length} pendiente{open.length === 1 ? "" : "s"} · {services.length - open.length} en el historial
      </p>
    </>
  );
}
