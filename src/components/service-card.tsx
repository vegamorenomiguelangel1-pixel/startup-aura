import Link from "next/link";
import { formatDay, formatDuration, formatPrice, formatTime } from "@/lib/format";
import type { ServiceRecord } from "@/lib/services";
import { StatusBadge } from "./status-badge";

export function ServiceCard({
  service,
  href,
  showClient = false,
}: {
  service: ServiceRecord;
  href: string;
  showClient?: boolean;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-line bg-paper p-4 shadow-[0_1px_0_rgba(28,25,21,0.04)] hover:border-teal"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-teal">{formatDay(service.scheduledAt)}</p>
          <p className="font-display text-3xl leading-none text-ink">{formatTime(service.scheduledAt)}</p>
        </div>
        <StatusBadge status={service.status} />
      </div>
      <p className="mt-4 font-bold">{service.zone}</p>
      <p className="text-muted">{service.address}</p>
      <p className="mt-3 text-sm font-bold">
        {formatPrice(service.priceBs)} · {formatDuration(service.durationHours)}
        {service.duo ? ` · ${service.duo.name}` : ""}
      </p>
      {showClient ? <p className="mt-1 text-sm text-muted">Cliente: {service.client.name}</p> : null}
    </Link>
  );
}

export function ServiceList({
  services,
  hrefFor,
  showClient = false,
  emptyTitle,
  emptyBody,
  emptyAction,
}: {
  services: ServiceRecord[];
  hrefFor: (id: string) => string;
  showClient?: boolean;
  emptyTitle: string;
  emptyBody?: string;
  emptyAction?: React.ReactNode;
}) {
  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-paper px-6 py-10 text-center">
        <h2 className="font-display text-2xl">{emptyTitle}</h2>
        {emptyBody ? <p className="mx-auto mt-2 max-w-md text-muted">{emptyBody}</p> : null}
        {emptyAction ? <div className="mt-4">{emptyAction}</div> : null}
      </div>
    );
  }

  return (
    <ul className="grid gap-3">
      {services.map((service) => (
        <li key={service.id}>
          <ServiceCard service={service} href={hrefFor(service.id)} showClient={showClient} />
        </li>
      ))}
    </ul>
  );
}
