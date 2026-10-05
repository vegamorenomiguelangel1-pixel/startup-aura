# Aura

Panel web para coordinar el **Servicio Dúo Inclusivo** de [Aura](https://www.auraservicio.com) en Santa Cruz de la Sierra, Bolivia.

> Limpiamos espacios, transformamos vidas.

Un dúo —una persona con discapacidad o tutor, junto a un compañero de apoyo— hace limpiezas de 4 a 5 horas por **250 Bs**. Esta primera versión es la herramienta interna para solicitar, asignar y seguir esos servicios. No cobra, no habla con WhatsApp y no rastrea el mapa.

## Requisitos

- Node.js 20 o superior
- npm

No hace falta una base en la nube ni correo real.

## Cómo correrlo

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

`npm run dev` prepara el entorno local si todavía no existe:

1. Crea `.env` con `DATABASE_URL` y `AUTH_SECRET` de desarrollo (ver `.env.example`).
2. Crea la base SQLite en `prisma/dev.db`.
3. Carga las cuentas y los servicios de demostración.

Esos datos se pueden volver a generar sin borrar lo que ya creaste. Para empezar de cero:

```bash
npm run db:reset
```

## Cuentas de demostración

También están en la pantalla de ingreso. No son accesos reales.

| Rol | Nombre | Correo | Contraseña |
| --- | --- | --- | --- |
| Administración | Brenda Segovia Quiroga | `admin@auraservicio.com` | `aura-admin` |
| Equipo dúo | Ana Rojas (compañero de apoyo) | `ana.rojas@auraservicio.com` | `aura-equipo` |
| Equipo dúo | Mateo Vargas (integrante del dúo) | `mateo.vargas@auraservicio.com` | `aura-equipo` |
| Cliente | Patricia Suárez | `patricia.suarez@auraservicio.com` | `aura-cliente` |

Ana y Mateo forman el **Dúo Inclusivo 1**.

## Cómo probar cada flujo

El reloj de la app es el de Santa Cruz (`America/La_Paz`, GMT-4).

### Cliente

1. Ingresa como Patricia.
2. En **Solicitar**, indica dirección, zona, fecha y hora. El precio queda en 250 Bs.
3. En **Mis servicios** verás la solicitud como **Solicitado**.
4. Ábrela para ver el historial. Mientras no tenga dúo, puedes cancelarla.

### Equipo dúo

1. Ingresa como Ana o como Mateo.
2. En **Inicio** está el servicio de hoy; en **Agenda**, el horario por día.
3. Abre el servicio asignado y avanza el estado: **Voy en camino** → **Empezar el servicio** → **Terminar servicio**.
4. También puedes cancelarlo, con un motivo opcional.
5. La otra persona del dúo ve el mismo servicio y el estado ya actualizado.

### Administración

1. Ingresa como Brenda.
2. El **Resumen** cuenta los servicios por estado.
3. En **Servicios**, abre la visita de Av. Irala (Centro), que sigue **Solicitada**, y asigna el Dúo Inclusivo 1. Pasa a **Asignado**.
4. En **Dúos** puedes armar otra pareja con personas del equipo que todavía no estén en un dúo.
5. En **Usuarios** puedes crear cuentas y cambiar rol o contraseña. Siempre debe quedar al menos una cuenta de administración.

## Qué hay en los datos de ejemplo

- Una limpieza **completada** en Equipetrol.
- Una **asignada para hoy** en Las Palmas, lista para que el dúo cambie el estado.
- Una **asignada para mañana** en Urubó.
- Una **solicitada** en el Centro, todavía sin dúo.

## Arquitectura

- Next.js (App Router) + TypeScript + Tailwind CSS.
- SQLite con Prisma. No hay servicios de pago.
- Sesión en una cookie `httpOnly` firmada con `jose`. Las contraseñas se guardan con bcrypt.
- El acceso de cada pantalla se comprueba con el rol guardado en la base, no solo con la cookie.
- Estados del servicio: `solicitado` → `asignado` → `en_camino` → `en_progreso` → `completado`, o `cancelado` mientras sigue abierto.
- La interfaz está en español (es-BO). La tipografía del cuerpo es Atkinson Hyperlegible.

Rutas principales: `/` , `/login`, `/cliente`, `/empleado`, `/admin`.

## Scripts

```bash
npm test       # reglas de estado y horario de Bolivia
npm run lint
npm run build
npm run db:seed
```

## Fuera de esta versión

Pagos, WhatsApp, anuncios, mapa o GPS, aplicación nativa y despliegue a producción.
