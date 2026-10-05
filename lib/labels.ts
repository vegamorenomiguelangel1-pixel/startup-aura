export const STATUSES = [
  "SOLICITADO",
  "ASIGNADO",
  "EN_CAMINO",
  "EN_PROGRESO",
  "COMPLETADO",
  "CANCELADO",
] as const;

export type Status = (typeof STATUSES)[number];

export const ROLES = ["ADMIN", "EMPLOYEE", "CLIENT"] as const;

export type AppRole = (typeof ROLES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  SOLICITADO: "Solicitado",
  ASIGNADO: "Asignado",
  EN_CAMINO: "En camino",
  EN_PROGRESO: "En progreso",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};

export const STATUS_HELP: Record<Status, string> = {
  SOLICITADO: "El cliente pidió el servicio. Falta asignar el dúo.",
  ASIGNADO: "El dúo ya está asignado y todavía no sale.",
  EN_CAMINO: "El dúo va hacia el domicilio.",
  EN_PROGRESO: "La limpieza está en curso.",
  COMPLETADO: "El servicio terminó.",
  CANCELADO: "El servicio se canceló.",
};

export const ROLE_LABEL: Record<AppRole, string> = {
  ADMIN: "Administración",
  EMPLOYEE: "Empleado",
  CLIENT: "Cliente",
};

export const ACTION_LABEL: Record<Status, string> = {
  SOLICITADO: "Marcar como solicitado",
  ASIGNADO: "Marcar como asignado",
  EN_CAMINO: "Voy en camino",
  EN_PROGRESO: "Iniciar servicio",
  COMPLETADO: "Finalizar servicio",
  CANCELADO: "Cancelar servicio",
};

export const EMPLOYEE_TRANSITIONS: Record<Status, Status[]> = {
  SOLICITADO: [],
  ASIGNADO: ["EN_CAMINO", "CANCELADO"],
  EN_CAMINO: ["EN_PROGRESO", "CANCELADO"],
  EN_PROGRESO: ["COMPLETADO", "CANCELADO"],
  COMPLETADO: [],
  CANCELADO: [],
};

export function isStatus(value: string): value is Status {
  return (STATUSES as readonly string[]).includes(value);
}

export function isRole(value: string): value is AppRole {
  return (ROLES as readonly string[]).includes(value);
}

export function isHistoryStatus(status: Status) {
  return status === "COMPLETADO" || status === "CANCELADO";
}

export function homeForRole(role: AppRole) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "EMPLOYEE":
      return "/empleado";
    case "CLIENT":
      return "/cliente";
  }
}
