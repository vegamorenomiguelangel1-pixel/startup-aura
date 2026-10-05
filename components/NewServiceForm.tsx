"use client";

import { useActionState } from "react";
import { createService, type ActionResult } from "@/app/actions/services";
import { SubmitButton } from "@/components/SubmitButton";
import { formatPrice } from "@/lib/format";
import { OFFER } from "@/lib/offer";

const initial: ActionResult = {};

export function NewServiceForm({
  defaultWhen,
  minWhen,
  maxWhen,
}: {
  defaultWhen: string;
  minWhen: string;
  maxWhen: string;
}) {
  const [state, formAction] = useActionState(createService, initial);

  return (
    <form action={formAction} className="space-y-5">
      <div className="rounded-2xl border border-gold bg-gold-soft px-4 py-3">
        <p className="font-bold">{OFFER.name}</p>
        <p>
          {OFFER.durationLabel} · {formatPrice(OFFER.priceBs)}
        </p>
      </div>
      <div>
        <label htmlFor="address" className="mb-1 block font-bold">
          Dirección <span className="text-clay">*</span>
        </label>
        <input
          id="address"
          name="address"
          required
          minLength={8}
          maxLength={200}
          autoComplete="street-address"
          placeholder="Calle, número, edificio o condominio"
          className="min-h-12 w-full rounded-xl border border-line bg-white px-3"
        />
      </div>
      <div>
        <label htmlFor="zone" className="mb-1 block font-bold">
          Zona o barrio
        </label>
        <input
          id="zone"
          name="zone"
          maxLength={80}
          placeholder="Ej. Equipetrol, Urubó"
          className="min-h-12 w-full rounded-xl border border-line bg-white px-3"
        />
      </div>
      <div>
        <label htmlFor="scheduledAt" className="mb-1 block font-bold">
          Fecha y hora <span className="text-clay">*</span>
        </label>
        <p id="when-hint" className="mb-1 text-sm text-muted">
          Horario de Bolivia (Santa Cruz).
        </p>
        <input
          id="scheduledAt"
          name="scheduledAt"
          type="datetime-local"
          required
          defaultValue={defaultWhen}
          min={minWhen}
          max={maxWhen}
          aria-describedby="when-hint"
          className="min-h-12 w-full rounded-xl border border-line bg-white px-3"
        />
      </div>
      <div>
        <label htmlFor="notes" className="mb-1 block font-bold">
          Indicaciones para el dúo
        </label>
        <textarea
          id="notes"
          name="notes"
          maxLength={500}
          rows={4}
          placeholder="Timbre, mascotas, productos o cómo llegar."
          className="w-full rounded-xl border border-line bg-white px-3 py-2"
        />
      </div>
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 text-clay">
          {state.error}
        </p>
      ) : null}
      <SubmitButton
        pendingLabel="Enviando solicitud…"
        className="min-h-12 w-full rounded-full bg-pine px-5 font-bold text-white hover:bg-pine-dark sm:w-auto"
      >
        Solicitar servicio
      </SubmitButton>
    </form>
  );
}
