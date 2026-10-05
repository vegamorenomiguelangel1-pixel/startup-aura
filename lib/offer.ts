export const OFFER = {
  name: "Servicio Dúo Inclusivo",
  priceBs: 250,
  durationLabel: "4 a 5 horas",
  durationHours: 4.5,
  tagline: "Limpiamos espacios, transformamos vidas.",
  city: "Santa Cruz de la Sierra, Bolivia",
  site: "https://auraservicio.com",
} as const;

export const DEMO_PASSWORD = "Aura2026!";

export const DEMO_ACCOUNTS = [
  {
    name: "Marina Soliz",
    email: "admin@auraservicio.com",
    password: DEMO_PASSWORD,
    role: "ADMIN",
    roleLabel: "Administración",
    phone: "70000001",
    duoRole: null,
  },
  {
    name: "Ana Vargas",
    email: "ana.vargas@auraservicio.com",
    password: DEMO_PASSWORD,
    role: "EMPLOYEE",
    roleLabel: "Empleada",
    phone: "72100011",
    duoRole: "Integrante del dúo",
  },
  {
    name: "Luis Peña",
    email: "luis.pena@auraservicio.com",
    password: DEMO_PASSWORD,
    role: "EMPLOYEE",
    roleLabel: "Empleado",
    phone: "72100022",
    duoRole: "Compañero de apoyo",
  },
  {
    name: "Camila Rojas",
    email: "camila.rojas@auraservicio.com",
    password: DEMO_PASSWORD,
    role: "CLIENT",
    roleLabel: "Cliente",
    phone: "72100033",
    duoRole: null,
  },
] as const;

export const DEMO_DUO = {
  name: "Dúo Inclusivo 1",
  description: "Persona con discapacidad o tutor, junto a un compañero de apoyo.",
} as const;
