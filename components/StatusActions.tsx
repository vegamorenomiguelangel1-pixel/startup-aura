"use client";

import { useActionState } from "react";
import { updateServiceStatus, type ActionResult } from "@/app/actions/services";
import { ACTION_LABEL, type Status } from "@/lib/labels";

const initial: ActionResult = {};

export function StatusActions({
  serviceId,
  options,
  cancelLabel = "Cancelar servicio",
}: {
  serviceId: string;
  options: Status[];
  cancelLabel?: string;
}) {
  const [state, action, pending] = useActionState(updateServiceStatus, initial);
  const forward = options.filter((status) => status !== "CANCELADO");
  const canCancel = options.includes("CANCELADO");

  return (
    <div className="space-y-4">
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 text-clay">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="rounded-xl bg-sky-soft px-3 py-2 text-pine-dark">
          {state.success}
        </p>
      ) : null}
      {pending ? (
        <p role="status" className="sr-only">
          Guardando cambios…
        </p>
      ) : null}
      {forward.length > 0 ? (
        <form action={action} className="space-y-3" aria-busy={pending}>
          <input type="hidden" name="serviceId" value={serviceId} />
          {forward.map((status) => (
            <button
              key={status}
              type="submit"
              name="status"
              value={status}
              disabled={pending}
              className="min-h-14 w-full rounded-2xl bg-pine px-5 text-lg font-bold text-white hover:bg-pine-dark"
            >
              {ACTION_LABEL[status]}
            </button>
          ))}
        </form>
      ) : null}
      {canCancel ? (
        <details className="rounded-2xl border border-line bg-white px-4 py-3">
          <summary className="min-h-11 font-bold text-clay">{cancelLabel}</summary>
          <p className="mt-2 text-sm text-muted">Esta acción deja el servicio como cancelado.</p>
          <form action={action} className="mt-3">
            <input type="hidden" name="serviceId" value={serviceId} />
            <button
              type="submit"
              name="status"
              value="CANCELADO"
              disabled={pending}
              className="min-h-11 rounded-full border border-clay px-4 font-bold text-clay"
            >
              Confirmar cancelación
            </button>
          </form>
        </details>
      ) : null}
    </div>
  );
}
