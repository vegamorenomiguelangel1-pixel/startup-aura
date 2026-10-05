import { updateServiceStatus } from "@/actions/services";
import { canAdminCancel, canClientCancel, canEmployeeTransition, EMPLOYEE_NEXT, isServiceStatus, STATUS_ACTION_LABEL } from "@/lib/status";
import { SubmitButton } from "./submit-button";
import { controlClass } from "./ui";

export function EmployeeStatusActions({
  serviceId,
  status,
  returnTo,
}: {
  serviceId: string;
  status: string;
  returnTo: string;
}) {
  if (!isServiceStatus(status)) return null;
  const next = EMPLOYEE_NEXT[status];
  const canCancel = canEmployeeTransition(status, "CANCELADO");
  if (!next && !canCancel) {
    return (
      <section className="rounded-2xl bg-sand p-5">
        <h2 className="font-display text-2xl">Sin acciones</h2>
        <p className="mt-2 text-muted">Este servicio ya no se puede actualizar.</p>
      </section>
    );
  }

  return (
    <div className="grid gap-3">
      {next ? (
        <section className="rounded-2xl bg-teal p-5 text-white" aria-labelledby="actualizar-estado">
          <h2 id="actualizar-estado" className="font-display text-2xl">
            Actualizar estado
          </h2>
          <p className="mt-2 text-white/90">
            {status === "ASIGNADO"
              ? "Cuando salgas hacia la dirección, avisa que vas en camino."
              : status === "EN_CAMINO"
                ? "Al llegar, empieza la limpieza."
                : "Al terminar la jornada, cierra el servicio."}
          </p>
          <form action={updateServiceStatus} className="mt-4">
            <input type="hidden" name="serviceId" value={serviceId} />
            <input type="hidden" name="status" value={next} />
            <input type="hidden" name="returnTo" value={returnTo} />
            <SubmitButton variant="secondary" pendingLabel="Actualizando…">
              {STATUS_ACTION_LABEL[next]}
            </SubmitButton>
          </form>
        </section>
      ) : null}
      {canCancel ? <CancelServiceForm serviceId={serviceId} returnTo={returnTo} /> : null}
    </div>
  );
}

export function CancelServiceForm({
  serviceId,
  returnTo,
  allowed,
}: {
  serviceId: string;
  returnTo: string;
  allowed?: boolean;
}) {
  if (allowed === false) return null;
  return (
    <details className="rounded-2xl border border-line bg-paper p-4">
      <summary className="cursor-pointer font-bold text-clay">Cancelar servicio</summary>
      <form action={updateServiceStatus} className="mt-4 grid gap-3">
        <input type="hidden" name="serviceId" value={serviceId} />
        <input type="hidden" name="status" value="CANCELADO" />
        <input type="hidden" name="returnTo" value={returnTo} />
        <div>
          <label htmlFor={`motivo-${serviceId}`} className="mb-1.5 block font-bold">
            Motivo (opcional)
          </label>
          <textarea id={`motivo-${serviceId}`} name="note" rows={3} className={`${controlClass} min-h-24 py-3`} />
        </div>
        <SubmitButton variant="danger" pendingLabel="Cancelando…">
          Confirmar cancelación
        </SubmitButton>
      </form>
    </details>
  );
}

export function clientCanCancel(status: string) {
  return isServiceStatus(status) && canClientCancel(status);
}

export function adminCanCancel(status: string) {
  return isServiceStatus(status) && canAdminCancel(status);
}
