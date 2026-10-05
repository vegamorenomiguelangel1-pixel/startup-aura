import type { Metadata } from "next";
import { ServiceCard } from "@/components/service-card";
import { PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { dayKey, formatDay } from "@/lib/format";
import { servicePath } from "@/lib/roles";
import { listEmployeeServices, type ServiceRecord } from "@/lib/services";

export const metadata: Metadata = { title: "Agenda" };

export default async function AgendaPage() {
  const user = await requireUser(["EMPLOYEE"]);
  const services = await listEmployeeServices(user.id);
  const groups = new Map<string, ServiceRecord[]>();
  for (const service of services) {
    if (service.status === "CANCELADO") continue;
    const key = dayKey(service.scheduledAt);
    const list = groups.get(key) ?? [];
    list.push(service);
    groups.set(key, list);
  }

  return (
    <>
      <PageHeader
        title="Agenda"
        description="Horario de Santa Cruz (GMT-4). Entra a un servicio para actualizar su estado."
      />
      {groups.size === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-paper px-5 py-8 text-muted">
          Cuando administración te asigne un dúo a un servicio, aparecerá aquí.
        </p>
      ) : (
        <div className="grid gap-8">
          {[...groups.entries()].map(([key, items]) => (
            <section key={key} aria-labelledby={`dia-${key}`}>
              <h2 id={`dia-${key}`} className="mb-3 font-display text-2xl">
                {formatDay(items[0].scheduledAt)}
              </h2>
              <ul className="grid gap-3">
                {items.map((service) => (
                  <li key={service.id}>
                    <ServiceCard service={service} href={servicePath("EMPLOYEE", service.id)} showClient />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
