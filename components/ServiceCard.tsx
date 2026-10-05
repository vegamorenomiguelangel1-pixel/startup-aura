import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNames, formatPrice, formatSchedule } from "@/lib/format";
import { OFFER } from "@/lib/offer";
import type { Status } from "@/lib/labels";

export function ServiceCard({
  service,
  href,
}: {
  href: string;
  service: {
    address: string;
    zone: string | null;
    scheduledAt: Date;
    status: Status;
    priceBs: number;
    assigneeNames: string[];
  };
}) {
  const schedule = formatSchedule(service.scheduledAt);
  return (
    <article className="card rounded-2xl border border-line bg-card shadow-[0_12px_40px_-28px_rgba(28,25,21,0.7)]">
      <Link href={href} className="block rounded-2xl p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <p className="text-sm font-bold text-muted">
            <time dateTime={service.scheduledAt.toISOString()}>{schedule.label}</time>
          </p>
          <StatusBadge status={service.status} />
        </div>
        <h2 className="mt-2 text-2xl leading-snug underline decoration-gold decoration-2 underline-offset-4">
          {service.address}
        </h2>
        <p className="mt-1 text-muted">{service.zone ? service.zone : "Santa Cruz"}</p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-muted">Precio</dt>
            <dd className="font-bold">{formatPrice(service.priceBs)}</dd>
          </div>
          <div>
            <dt className="text-muted">Duración</dt>
            <dd className="font-bold">{OFFER.durationLabel}</dd>
          </div>
          <div>
            <dt className="text-muted">Dúo</dt>
            <dd className="font-bold">{formatNames(service.assigneeNames)}</dd>
          </div>
        </dl>
      </Link>
    </article>
  );
}
