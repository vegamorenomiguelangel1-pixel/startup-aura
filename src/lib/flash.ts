export const OK_MESSAGES = {
  solicitado: "Servicio solicitado. Administración asignará un dúo.",
  estado: "Estado del servicio actualizado.",
  cancelado: "Servicio cancelado.",
  asignado: "Dúo asignado al servicio.",
  sin_duo: "Se retiró el dúo. El servicio volvió a solicitado.",
  usuario: "Usuario creado.",
  rol: "Usuario actualizado.",
  duo: "Dúo creado.",
  quitado: "Persona retirada del dúo.",
} as const;

export const ERROR_MESSAGES = {
  credenciales: "Correo o contraseña incorrectos.",
  transicion: "Ese cambio de estado no está permitido.",
  permiso: "No tienes permiso para hacer eso.",
  no_encontrado: "No encontramos ese servicio.",
  duo: "Elige un dúo con dos personas antes de asignarlo.",
  cerrado: "Este servicio ya terminó y no admite cambios.",
  correo: "Ese correo ya está registrado.",
  admin: "Debe quedar al menos una cuenta de administración.",
  distinto: "El integrante y el compañero de apoyo deben ser dos personas distintas.",
  ocupado: "Esas personas ya pertenecen a un dúo o no son del equipo.",
  password: "La contraseña nueva debe tener al menos 8 caracteres.",
  invalido: "Revisa los datos e inténtalo de nuevo.",
} as const;

export type OkCode = keyof typeof OK_MESSAGES;
export type ErrorCode = keyof typeof ERROR_MESSAGES;

export function okMessage(code: string | undefined) {
  if (!code || !(code in OK_MESSAGES)) return undefined;
  return OK_MESSAGES[code as OkCode];
}

export function errorMessage(code: string | undefined) {
  if (!code || !(code in ERROR_MESSAGES)) return undefined;
  return ERROR_MESSAGES[code as ErrorCode];
}

export function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}
