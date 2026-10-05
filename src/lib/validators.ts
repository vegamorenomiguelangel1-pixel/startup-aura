import { z } from "zod";
import { ZONES } from "./constants";
import { parsePazDateTime, todayKey } from "./format";
import { ROLES } from "./roles";

const zoneValues = ZONES as unknown as [string, ...string[]];
const roleValues = ROLES as unknown as [string, ...string[]];

export const loginSchema = z.object({
  email: z.email("Ingresa un correo válido."),
  password: z.string().min(1, "Ingresa tu contraseña."),
});

export const serviceSchema = z
  .object({
    address: z.string().trim().min(8, "Escribe la dirección completa.").max(200, "La dirección es demasiado larga."),
    zone: z.enum(zoneValues, "Elige una zona."),
    reference: z.string().trim().max(200, "La referencia es demasiado larga."),
    notes: z.string().trim().max(500, "Las notas son demasiado largas."),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elige una fecha."),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Elige una hora."),
  })
  .superRefine((value, ctx) => {
    const scheduledAt = parsePazDateTime(value.date, value.time);
    if (!scheduledAt) {
      ctx.addIssue({ code: "custom", path: ["date"], message: "Esa fecha no es válida." });
      return;
    }
    const startToday = parsePazDateTime(todayKey(), "00:00");
    if (startToday && scheduledAt < startToday) {
      ctx.addIssue({ code: "custom", path: ["date"], message: "Elige hoy o una fecha futura." });
    }
  });

export const userSchema = z.object({
  name: z.string().trim().min(3, "Escribe el nombre completo.").max(80, "El nombre es demasiado largo."),
  email: z.email("Ingresa un correo válido."),
  phone: z.string().trim().max(20, "El celular es demasiado largo."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres.").max(72, "La contraseña es demasiado larga."),
  role: z.enum(roleValues, "Elige un rol."),
});

export const duoSchema = z.object({
  name: z.string().trim().min(3, "Ponle un nombre al dúo.").max(60, "El nombre es demasiado largo."),
  apoyoId: z.string().min(1, "Elige al compañero de apoyo."),
  integranteId: z.string().min(1, "Elige al integrante del dúo."),
  notes: z.string().trim().max(300, "Las notas son demasiado largas."),
});

export const noteSchema = z.string().trim().max(300, "El motivo es demasiado largo.");
