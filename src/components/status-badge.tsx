import { isServiceStatus, STATUS_LABEL, type ServiceStatus } from "@/lib/status";

const styles: Record<ServiceStatus, string> = {
  SOLICITADO: "bg-gold-soft text-gold",
  ASIGNADO: "bg-sky-100 text-sky-950",
  EN_CAMINO: "bg-indigo-100 text-indigo-950",
  EN_PROGRESO: "bg-foam text-teal-dark",
  COMPLETADO: "bg-moss-soft text-moss",
  CANCELADO: "bg-sand text-ink",
};

export function StatusBadge({ status }: { status: string }) {
  if (!isServiceStatus(status)) {
    return <span className="rounded-full bg-sand px-3 py-1 text-sm font-bold">{status}</span>;
  }
  return (
    <span className={`inline-flex min-h-8 items-center rounded-full px-3 text-sm font-bold ${styles[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
