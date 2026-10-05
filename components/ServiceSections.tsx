import { ServiceCard } from "@/components/ServiceCard";
import { isHistoryStatus, type Status } from "@/lib/labels";

export type ListedService = {
  id: string;
  address: string;
  zone: string | null;
  scheduledAt: Date;
  status: Status;
  priceBs: number;
  assigneeNames: string[];
};

export function ServiceSections({
  services,
  hrefBase,
  activeTitle,
  historyTitle,
  activeEmpty,
  historyEmpty,
}: {
  services: ListedService[];
  hrefBase: string;
  activeTitle: string;
  historyTitle: string;
  activeEmpty: string;
  historyEmpty: string;
}) {
  const active = services
    .filter((service) => !isHistoryStatus(service.status))
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
  const history = services
    .filter((service) => isHistoryStatus(service.status))
    .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime());

  return (
    <div className="mt-8 space-y-10">
      <section aria-labelledby="activos">
        <h2 id="activos" className="font-display text-3xl">
          {activeTitle} <span className="text-muted">({active.length})</span>
        </h2>
        <ServiceStack services={active} hrefBase={hrefBase} empty={activeEmpty} />
      </section>
      <section aria-labelledby="historial">
        <h2 id="historial" className="font-display text-3xl">
          {historyTitle} <span className="text-muted">({history.length})</span>
        </h2>
        <ServiceStack services={history} hrefBase={hrefBase} empty={historyEmpty} />
      </section>
      <p className="text-sm text-muted">Los horarios están en hora de Bolivia (Santa Cruz).</p>
    </div>
  );
}

function ServiceStack({
  services,
  hrefBase,
  empty,
}: {
  services: ListedService[];
  hrefBase: string;
  empty: string;
}) {
  if (services.length === 0) {
    return <p className="mt-4 rounded-2xl border border-dashed border-line px-4 py-6 text-muted">{empty}</p>;
  }
  return (
    <ul className="mt-4 space-y-4">
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} href={`${hrefBase}/${service.id}`} />
        </li>
      ))}
    </ul>
  );
}
