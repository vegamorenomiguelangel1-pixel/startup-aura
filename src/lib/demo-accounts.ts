import type { DuoRole, Role } from "./roles";

export type DemoAccount = {
  role: Role;
  name: string;
  email: string;
  password: string;
  phone: string;
  duoRole?: DuoRole;
  blurb: string;
};

/** Cuentas locales de demostración. No son accesos reales de Aura. */
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: "ADMIN",
    name: "Brenda Segovia Quiroga",
    email: "admin@auraservicio.com",
    password: "aura-admin",
    phone: "+591 70000001",
    blurb: "Ve todos los servicios, asigna dúos y administra usuarios.",
  },
  {
    role: "EMPLOYEE",
    name: "Ana Rojas",
    email: "ana.rojas@auraservicio.com",
    password: "aura-equipo",
    phone: "+591 70000002",
    duoRole: "APOYO",
    blurb: "Forma parte del Dúo Inclusivo 1 como compañero de apoyo.",
  },
  {
    role: "EMPLOYEE",
    name: "Mateo Vargas",
    email: "mateo.vargas@auraservicio.com",
    password: "aura-equipo",
    phone: "+591 70000003",
    duoRole: "INTEGRANTE",
    blurb: "Forma parte del Dúo Inclusivo 1 como integrante del dúo.",
  },
  {
    role: "CLIENT",
    name: "Patricia Suárez",
    email: "patricia.suarez@auraservicio.com",
    password: "aura-cliente",
    phone: "+591 70000004",
    blurb: "Solicita limpiezas y sigue el estado de cada visita.",
  },
];
