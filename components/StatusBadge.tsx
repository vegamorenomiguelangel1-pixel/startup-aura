import { STATUS_LABEL, type Status } from "@/lib/labels";

const tone: Record<Status, string> = {
  SOLICITADO: "bg-paper text-ink border-line",
  ASIGNADO: "bg-sky-soft text-pine-dark border-pine/20",
  EN_CAMINO: "bg-gold-soft text-gold-deep border-gold",
  EN_PROGRESO: "bg-pine text-white border-pine",
  COMPLETADO: "bg-pine-dark text-white border-pine-dark",
  CANCELADO: "bg-clay-soft text-clay border-clay/30",
};

function Icon({ status }: { status: Status }) {
  const common = "h-4 w-4 shrink-0";
  if (status === "COMPLETADO" || status === "ASIGNADO") {
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
        <path
          d="M3 8.2 6.2 11.5 13 4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "CANCELADO") {
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
        <path
          d="M4 4l8 8M12 4l-8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (status === "EN_CAMINO") {
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
        <path
          d="M3 8h9M9 4.5 12.5 8 9 11.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (status === "EN_PROGRESO") {
    return (
      <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
        <circle cx="8" cy="8" r="5.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 5.2V8l2 1.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className={common} aria-hidden="true">
      <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-bold ${tone[status]}`}
    >
      <Icon status={status} />
      {STATUS_LABEL[status]}
    </span>
  );
}
