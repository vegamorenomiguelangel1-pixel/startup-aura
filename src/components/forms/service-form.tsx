"use client";

import { useActionState } from "react";
import { createService } from "@/actions/services";
import { DEFAULT_PRICE_BS, ZONES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { ActionState } from "@/lib/form";
import { SubmitButton } from "../submit-button";
import { SelectField, TextAreaField, TextField } from "../ui";

export function ServiceForm({ minDate, defaultDate }: { minDate: string; defaultDate: string }) {
  const initial: ActionState = { values: { date: defaultDate, time: "08:00", zone: "Equipetrol" } };
  const [state, action] = useActionState(createService, initial);
  const values = { ...initial.values, ...state.values };
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4 rounded-2xl border border-line bg-paper p-5 sm:p-6">
      <p className="rounded-xl bg-foam px-4 py-3 text-teal-dark">
        Servicio Dúo Inclusivo · {formatPrice(DEFAULT_PRICE_BS)} · jornada de 4 a 5 horas. El horario es de Santa Cruz (GMT-4).
      </p>
      {state.error ? (
        <p role="alert" className="rounded-xl bg-clay-soft px-3 py-2 font-bold text-clay">
          {state.error}
        </p>
      ) : null}
      <TextField id="address" name="address" label="Dirección" required defaultValue={values.address} error={errors.address} autoComplete="street-address" hint="Calle, número y barrio." />
      <SelectField id="zone" name="zone" label="Zona" required defaultValue={values.zone} error={errors.zone}>
        {ZONES.map((zone) => (
          <option key={zone} value={zone}>
            {zone}
          </option>
        ))}
      </SelectField>
      <TextField id="reference" name="reference" label="Referencia" defaultValue={values.reference} error={errors.reference} hint="Opcional. Por ejemplo, color del portón o piso." />
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField id="date" name="date" type="date" label="Fecha" required min={minDate} defaultValue={values.date} error={errors.date} />
        <TextField id="time" name="time" type="time" label="Hora" required defaultValue={values.time} error={errors.time} />
      </div>
      <TextAreaField id="notes" name="notes" label="Notas para el dúo" defaultValue={values.notes} error={errors.notes} hint="Opcional. Mascotas, productos o ambientes que no hay que tocar." />
      <SubmitButton pendingLabel="Enviando solicitud…">Solicitar servicio</SubmitButton>
    </form>
  );
}
