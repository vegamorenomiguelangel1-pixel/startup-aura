"use client";

import { useActionState } from "react";
import { adminSetStatus, type ActionResult } from "@/app/actions/services";
import { SubmitButton } from "@/components/SubmitButton";
import { STATUS_LABEL, STATUSES, type Status } from "@/lib/labels";

const initial: ActionResult = {};

export function AdminStatusForm({ serviceId, status }: { serviceId: string; status: Status }) {
  const [state, formAction] = useActionState(adminSetStatus, initial);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="serviceId" value={serviceId} />
      <div>
        <label htmlFor="admin-status" className="mb-1 block font-bold">
          Corregir estado
        </label>
        <select
          id="admin-status"
          name="status"
          key={status}
          defaultValue={status}
          className="min-h-12 rounded-xl border border-line bg-white px-3"
        >
          {STATUSES.map((item) => (
            <option key={item} value={item}>
              {STATUS_LABEL[item]}
            </option>
          ))}
        </select>
      </div>
      <SubmitButton className="min-h-12 rounded-full border border-line px-4 font-bold">
        Guardar estado
      </SubmitButton>
      {state.error ? (
        <p role="alert" className="text-clay">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p role="status" className="text-pine-dark">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
