# Aura

Panel web para gestionar el **Servicio Dúo Inclusivo** de [Aura](https://auraservicio.com) en Santa Cruz de la Sierra, Bolivia.

> Limpiamos espacios, transformamos vidas.

Un dúo —una persona con discapacidad o su tutor, junto a un compañero de apoyo— realiza limpiezas de 4 a 5 horas por **250 Bs**. Esta primera versión cubre la operación diaria: solicitar, asignar y seguir el estado. No incluye pagos, WhatsApp, mapas con GPS ni apps nativas.

## Quick start

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). El comando de desarrollo crea la base SQLite (`prisma/dev.db`) y carga los datos de demostración si todavía no hay servicios.

## Cuentas de demostración

Contraseña de todas: `Aura2026!`

| Rol | Nombre | Correo |
| --- | --- | --- |
| Administración | Marina Soliz | `admin@auraservicio.com` |
| Empleada (integrante del dúo) | Ana Vargas | `ana.vargas@auraservicio.com` |
| Empleado (compañero de apoyo) | Luis Peña | `luis.pena@auraservicio.com` |
| Cliente | Camila Rojas | `camila.rojas@auraservicio.com` |

En la pantalla de ingreso, el botón **Usar** rellena cada cuenta. Son personas ficticias para la demo, no el equipo fundador.

## Cómo probar cada flujo

### Cliente

1. Ingrese como `camila.rojas@auraservicio.com`.
2. Revise un servicio completado en Urubó, uno asignado en Equipetrol y uno solicitado en Las Palmas.
3. Abra **Solicitar servicio**, indique dirección, zona y fecha, y envíe.
4. Confirme que el nuevo servicio queda en **Solicitado**.
5. Puede cancelarlo mientras siga solicitado o asignado, antes de que el dúo salga.

### Empleado

1. Ingrese como `ana.vargas@auraservicio.com` o `luis.pena@auraservicio.com`.
2. Abra el servicio de Equipetrol (estado **Asignado**).
3. Avance el estado: **Voy en camino** → **Iniciar servicio** → **Finalizar servicio**.
4. El otro integrante del dúo ve el mismo servicio y el mismo estado.
5. El servicio de Las Palmas no aparece hasta que administración lo asigne.

### Administración

1. Ingrese como `admin@auraservicio.com`.
2. El inicio muestra la cantidad de servicios por estado. Cada número filtra la lista.
3. Abra el servicio solicitado de Las Palmas y pulse **Asignar Dúo Inclusivo 1**. Guarde.
4. El estado pasa a **Asignado** y Ana y Luis lo ven en su panel.
5. En **Usuarios** puede crear una cuenta y cambiar el rol de otra persona. No puede cambiar su propio rol.

Para volver a los tres servicios de ejemplo:

```bash
npm run db:reset
```

## Arquitectura

- **Next.js (App Router) + TypeScript + Tailwind CSS.** La interfaz está en español (`es-BO`).
- **Prisma + SQLite.** Un archivo local, sin servicios de pago. El esquema cubre usuarios, dúos, servicios y asignaciones.
- **Sesión propia.** Contraseñas con bcrypt y una cookie `httpOnly` firmada con JWT (HS256). No hace falta configurar correo.
- **Tres áreas.** `/cliente`, `/empleado` y `/admin`. El middleware exige sesión. Cada layout y cada server action vuelven a comprobar el rol en el servidor.
- **Estados del servicio.** `solicitado → asignado → en_camino → en_progreso → completado`, o `cancelado`. El precio por defecto es 250 Bs y la duración, 4 a 5 horas. Los horarios se guardan en hora de Bolivia (America/La_Paz).

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Prepara la base, siembra datos si faltan servicios y abre el servidor |
| `npm run lint` | ESLint |
| `npm run build` | Compila la aplicación |
| `npm run db:reset` | Borra la base local y vuelve a cargar la demo |

## Fuera de esta versión

Pagos, WhatsApp, anuncios, seguimiento GPS, aplicación nativa y configuración de despliegue en producción.

## Accesibilidad

Texto en Atkinson Hyperlegible, contraste alto, estados con texto e icono, botones grandes y etiquetas visibles. El producto es un servicio de inclusión: la interfaz tiene que poder usarse con teclado y lector de pantalla.
