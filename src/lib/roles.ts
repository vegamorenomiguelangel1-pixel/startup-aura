export const ROLES = ["ADMIN", "EMPLOYEE", "CLIENT"] as const;
export type Role = (typeof ROLES)[number];

export const DUO_ROLES = ["INTEGRANTE", "APOYO"] as const;
export type DuoRole = (typeof DUO_ROLES)[number];

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: "Administración",
  EMPLOYEE: "Equipo dúo",
  CLIENT: "Cliente",
};

export const DUO_ROLE_LABEL: Record<DuoRole, string> = {
  INTEGRANTE: "Integrante del dúo",
  APOYO: "Compañero de apoyo",
};

export function isRole(value: string): value is Role {
  return (ROLES as readonly string[]).includes(value);
}

export function isDuoRole(value: string): value is DuoRole {
  return (DUO_ROLES as readonly string[]).includes(value);
}

export function homeForRole(role: Role) {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "EMPLOYEE":
      return "/empleado";
    case "CLIENT":
      return "/cliente";
  }
}

export function servicePath(role: Role, serviceId: string) {
  switch (role) {
    case "ADMIN":
      return `/admin/servicios/${serviceId}`;
    case "EMPLOYEE":
      return `/empleado/servicios/${serviceId}`;
    case "CLIENT":
      return `/cliente/servicios/${serviceId}`;
  }
}

export function safeNextPath(role: Role, raw: string) {
  const home = homeForRole(role);
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || raw.includes("://")) {
    return home;
  }
  if (raw === home || raw.startsWith(`${home}/`)) return raw;
  return home;
}
