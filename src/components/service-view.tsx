import { formatDateTime, formatDuration, formatPrice } from "@/lib/format";
import { DUO_ROLE_LABEL, isDuoRole, ROLE_LABEL, isRole } from "@/lib/roles";
import type { ServiceRecord } from "@/lib/services";
import { STATUS_DESCRIPTION, isServiceStatus } from "@/lib/status";
import { StatusBadge } from "./status-badge";

export function ServiceView({
  service,
  audience,
  children,
}: {
  service: ServiceRecord;
  audience: "client" | "employee" | "admin";
  children?: React.ReactNode;
}) {
  const statusText = isServiceStatus(service.status) ? STATUS_DESCRIPTION[service.status] : "";
  const showPhones = audience !== "client";

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
      <article className="rounded-2xl border border-line bg-paper p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={service.status} />
          <p className="text-sm text-muted">{statusText}</p>
        </div>
        <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">Limpieza en {service.zone}</h1>
        <p className="mt-2 text-lg">{formatDateTime(service.scheduledAt)}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <dt className="text-sm font-bold text-muted">Dirección</dt>
            <dd className="mt-1 text-lg">{service.address}</dd>
          </div>
          {service.reference ? (
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold text-muted">Referencia</dt>
              <dd className="mt-1">{service.reference}</dd>
            </div>
          ) : null}
          <div>
            <dt className="text-sm font-bold text-muted">Duración</dt>
            <dd className="mt-1">{formatDuration(service.durationHours)} · jornada de 4 a 5 horas</dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-muted">Precio</dt>
            <dd className="mt-1 font-bold">{formatPrice(service.priceBs)}</dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-muted">Cliente</dt>
            <dd className="mt-1">
              {service.client.name}
              {showPhones && service.client.phone ? <span className="block text-muted">{service.client.phone}</span> : null}
              {audience === "admin" ? <span className="block text-muted">{service.client.email}</span> : null}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-bold text-muted">Dúo</dt>
            <dd className="mt-1">{service.duo?.name ?? "Sin asignar"}</dd>
          </div>
          {service.notes ? (
            <div className="sm:col-span-2">
              <dt className="text-sm font-bold text-muted">Notas</dt>
              <dd className="mt-1 whitespace-pre-wrap">{service.notes}</dd>
            </div>
          ) : null}
        </dl>

        <h2 className="mt-8 font-display text-2xl">Equipo</h2>
        {service.assignments.length === 0 ? (
          <p className="mt-2 text-muted">Todavía no hay un dúo asignado.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {service.assignments.map((assignment) => {
              const role = assignment.duoRole && isDuoRole(assignment.duoRole) ? DUO_ROLE_LABEL[assignment.duoRole] : "Equipo";
              return (
                <li key={assignment.id} className="rounded-xl bg-cream px-4 py-3">
                  <p className="font-bold">{assignment.employee.name}</p>
                  <p className="text-sm text-muted">{role}</p>
                  {showPhones && assignment.employee.phone ? <p className="text-sm">{assignment.employee.phone}</p> : null}
                </li>
              );
            })}
          </ul>
        )}
      </article>

      <div className="grid content-start gap-4">
        {children}
        <section className="rounded-2xl border border-line bg-paper p-5" aria-labelledby="historial">
          <h2 id="historial" className="font-display text-2xl">
            Historial
          </h2>
          <ol className="mt-4 grid gap-4">
            {service.events.map((event) => {
              const actorRole = event.actor && isRole(event.actor.role) ? ROLE_LABEL[event.actor.role] : null;
              return (
                <li key={event.id} className="border-l-2 border-teal pl-3">
                  <p>{event.message}</p>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateTime(event.createdAt)}
                    {event.actor ? ` · ${event.actor.name}` : ""}
                    {actorRole ? ` · ${actorRole}` : ""}
                  </p>
                </li>
              );
            })}
          </ol>
        </section>
      </div>
    </div>
  );
}
