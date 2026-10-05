import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { formatNames, formatPrice, formatSchedule, mapsHref, telHref } from "@/lib/format";
import { STATUS_HELP, type Status } from "@/lib/labels";
import { OFFER } from "@/lib/offer";

export function ServiceDetail({
  service,
  backHref,
  backLabel,
  showClient,
  showPhones,
  showEmail = false,
  showMaps,
  children,
}: {
  service: {
    address: string;
    zone: string | null;
    notes: string | null;
    scheduledAt: Date;
    priceBs: number;
    status: Status;
    client: { name: string; phone: string | null; email: string };
    assignments: {
      employee: { name: string; phone: string | null; duoRole: string | null };
    }[];
  };
  backHref: string;
  backLabel: string;
  showClient: boolean;
  showPhones: boolean;
  showEmail?: boolean;
  showMaps: boolean;
  children?: React.ReactNode;
}) {
  const schedule = formatSchedule(service.scheduledAt);
  const names = service.assignments.map((item) => item.employee.name);

  return (
    <article className="space-y-6">
      <p>
        <Link href={backHref} className="font-bold text-pine underline underline-offset-4">
          {backLabel}
        </Link>
      </p>
      <div className="space-y-3" aria-live="polite">
        <StatusBadge status={service.status} />
        <p className="text-muted">{STATUS_HELP[service.status]}</p>
      </div>
      <header>
        <p className="text-sm font-bold tracking-wide text-gold-deep uppercase">{OFFER.name}</p>
        <h1 className="mt-1 font-display text-4xl leading-tight text-balance">{service.address}</h1>
        <p className="mt-2 text-lg">{service.zone ?? "Santa Cruz de la Sierra"}</p>
        {showMaps ? (
          <p className="mt-2">
            <a
              href={mapsHref(service.address)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-pine underline underline-offset-4"
            >
              Abrir en mapas
            </a>
          </p>
        ) : null}
      </header>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Fact label="Cuándo" value={schedule.label} />
        <Fact label="Duración" value={OFFER.durationLabel} />
        <Fact label="Precio" value={formatPrice(service.priceBs)} />
        <Fact label="Dúo" value={formatNames(names)} />
      </dl>
      {service.assignments.length > 0 ? (
        <section>
          <h2 className="font-display text-2xl">Equipo</h2>
          <ul className="mt-3 space-y-2">
            {service.assignments.map((item, index) => (
              <li key={`${item.employee.name}-${index}`} className="rounded-2xl border border-line bg-card px-4 py-3">
                <p className="font-bold">{item.employee.name}</p>
                <p className="text-sm text-muted">{item.employee.duoRole ?? "Empleado"}</p>
                {showPhones && item.employee.phone ? (
                  <a className="font-bold text-pine underline" href={telHref(item.employee.phone)}>
                    {item.employee.phone}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {showClient ? (
        <section>
          <h2 className="font-display text-2xl">Cliente</h2>
          <div className="mt-3 rounded-2xl border border-line bg-card px-4 py-3">
            <p className="font-bold">{service.client.name}</p>
            {showPhones && service.client.phone ? (
              <a className="font-bold text-pine underline" href={telHref(service.client.phone)}>
                {service.client.phone}
              </a>
            ) : null}
            {showEmail ? <p className="text-sm text-muted">{service.client.email}</p> : null}
          </div>
        </section>
      ) : null}
      {service.notes ? (
        <section>
          <h2 className="font-display text-2xl">Indicaciones</h2>
          <p className="mt-2 whitespace-pre-wrap rounded-2xl bg-gold-soft px-4 py-3">{service.notes}</p>
        </section>
      ) : null}
      {children}
    </article>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-card px-4 py-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
