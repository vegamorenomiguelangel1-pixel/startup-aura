export const SERVICE_STATUSES = [
  "SOLICITADO",
  "ASIGNADO",
  "EN_CAMINO",
  "EN_PROGRESO",
  "COMPLETADO",
  "CANCELADO",
] as const;

export type ServiceStatus = (typeof SERVICE_STATUSES)[number];

export const STATUS_LABEL: Record<ServiceStatus, string> = {
  SOLICITADO: "Solicitado",
  ASIGNADO: "Asignado",
  EN_CAMINO: "En camino",
  EN_PROGRESO: "En progreso",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

export const STATUS_DESCRIPTION: Record<ServiceStatus, string> = {
  SOLICITADO: "El cliente pidió el servicio y todavía no tiene dúo.",
  ASIGNADO: "Hay un dúo designado para la visita.",
  EN_CAMINO: "El dúo va hacia la dirección.",
  EN_PROGRESO: "La limpieza ya empezó.",
  COMPLETADO: "La jornada terminó.",
  CANCELADO: "El servicio se anuló.",
};

export const STATUS_ACTION_LABEL: Partial<Record<ServiceStatus, string>> = {
  EN_CAMINO: "Voy en camino",
  EN_PROGRESO: "Empezar el servicio",
  COMPLETADO: "Terminar servicio",
};

export const EMPLOYEE_NEXT: Partial<Record<ServiceStatus, ServiceStatus>> = {
  ASIGNADO: "EN_CAMINO",
  EN_CAMINO: "EN_PROGRESO",
  EN_PROGRESO: "COMPLETADO",
};

const EMPLOYEE_TRANSITIONS: Record<ServiceStatus, ServiceStatus[]> = {
  SOLICITADO: [],
  ASIGNADO: ["EN_CAMINO", "CANCELADO"],
  EN_CAMINO: ["EN_PROGRESO", "CANCELADO"],
  EN_PROGRESO: ["COMPLETADO", "CANCELADO"],
  COMPLETADO: [],
  CANCELADO: [],
};

export function isOpenStatus(status: ServiceStatus) {
  return status !== "COMPLETADO" && status !== "CANCELADO";
}

export function isServiceStatus(value: string): value is ServiceStatus {
  return (SERVICE_STATUSES as readonly string[]).includes(value);
}

export function canEmployeeTransition(from: ServiceStatus, to: ServiceStatus) {
  return EMPLOYEE_TRANSITIONS[from].includes(to);
}

export function canClientCancel(status: ServiceStatus) {
  return status === "SOLICITADO";
}

export function canAdminCancel(status: ServiceStatus) {
  return status !== "COMPLETADO" && status !== "CANCELADO";
}

export function canAssignDuo(status: ServiceStatus) {
  return status !== "COMPLETADO" && status !== "CANCELADO";
}

export function canUnassignDuo(status: ServiceStatus) {
  return status === "ASIGNADO";
}

export function statusChangeMessage(status: ServiceStatus, note?: string) {
  if (status === "CANCELADO") {
    return note ? `Servicio cancelado. Motivo: ${note}` : "Servicio cancelado.";
  }
  return `Estado actualizado a ${STATUS_LABEL[status]}.`;
}
