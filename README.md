# Aura

Panel web para gestionar el **Servicio Dúo Inclusivo** de [Aura](https://auraservicio.com) en Santa Cruz de la Sierra, Bolivia.

> Limpiamos espacios, transformamos vidas.

Un dúo —una persona con discapacidad o su tutor, junto a un compañero de apoyo— realiza limpiezas de 4 a 5 horas por **250 Bs**. Esta versión guarda usuarios, dúos y servicios en **Firebase** (Authentication + Firestore), no en la máquina de quien desarrolla.

## Qué se usa de Firebase

- **Authentication**, con el proveedor Correo/contraseña. El formulario de ingreso sigue en el servidor: valida la contraseña con Firebase y guarda una cookie `httpOnly` de sesión.
- **Cloud Firestore**, para los perfiles, los dúos y los servicios. Las asignaciones van en el arreglo `assigneeIds` de cada servicio.
- El servidor usa el **Admin SDK**, que no pasa por las reglas de seguridad. Por eso las reglas niegan todo acceso directo desde el navegador: la clave web de Firebase es pública y no debe poder leer los servicios.

Los roles siguen siendo cliente, empleado y administración. La interfaz sigue en español.

## Proyecto de Firebase

1. Cree un proyecto en [Firebase console](https://console.firebase.google.com/). No hace falta activar facturación de Blaze para esta versión: Authentication y Firestore en el plan Spark alcanzan para el panel.
2. En **Authentication → Sign-in method**, active **Correo electrónico/contraseña**. No exija verificación de correo.
3. En **Firestore Database**, cree la base en **modo de producción**.
4. En **Project settings → General**, registre una app web y copie la configuración.
5. En **Project settings → Service accounts**, pulse **Generate new private key**. No suba ese JSON al repositorio. Copie solo estos campos al archivo `.env`:
   - `project_id` → `FIREBASE_PROJECT_ID` y `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (entre comillas, con los saltos de línea escritos como `\n`)
6. Pegue las reglas de `firestore.rules` en **Firestore → Rules** y publíquelas. También puede desplegarlas con `npx firebase deploy --only firestore:rules` después de `npx firebase login`.

Ejemplo de `.env` (los valores reales no se commitean):

```bash
cp .env.example .env
```

```bash
NEXT_PUBLIC_FIREBASE_API_KEY="la-api-key-web"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="su-proyecto.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="su-proyecto"
FIREBASE_PROJECT_ID="su-proyecto"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@su-proyecto.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## Cómo correrlo

Requiere Node.js 20 o superior.

```bash
npm install
npm run seed
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). `npm run dev` no arranca si faltan las variables. `npm run seed` crea las cuentas de demostración y, si todavía no hay servicios, los tres ejemplos.

### Emulador, sin cuenta de Google

Si todavía no hay un proyecto remoto, el mismo código puede hablar con los emuladores locales. Esos datos no salen de la máquina. Para datos compartidos use el proyecto de Firebase de arriba.

```bash
npm install
npm run dev:emulator
```

Hace falta Java (el emulador de Firestore lo usa). El comando levanta Authentication en el puerto 9099, Firestore en el 8080, siembra la demo y abre Next.js.

## Cuentas de demostración

Contraseña de todas: `Aura2026!`

| Rol | Nombre | Correo |
| --- | --- | --- |
| Administración | Marina Soliz | `admin@auraservicio.com` |
| Empleada (integrante del dúo) | Ana Vargas | `ana.vargas@auraservicio.com` |
| Empleado (compañero de apoyo) | Luis Peña | `luis.pena@auraservicio.com` |
| Cliente | Camila Rojas | `camila.rojas@auraservicio.com` |

`npm run seed` crea cada persona en Firebase Authentication y su perfil en Firestore (`users/{uid}`), con el rol en el documento y en un custom claim `role`. Si la cuenta ya existe, no cambia la contraseña ni pisa un perfil editado. El botón **Usar** de la pantalla de ingreso rellena el formulario. Son personas ficticias, no el equipo fundador.

Para volver a crear los tres servicios de ejemplo, borre los documentos de la colección `services` en la consola de Firestore y ejecute `npm run seed` otra vez. Con el emulador basta reiniciar `npm run dev:emulator`: cada arranque empieza vacío y siembra de nuevo.

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
5. En **Usuarios** puede crear una cuenta (también queda en Firebase Authentication) y cambiar el rol de otra persona. No puede cambiar su propio rol.

## Reglas de seguridad

El archivo `firestore.rules` niega lectura y escritura a cualquier cliente. El panel escribe con la cuenta de servicio, en el servidor, y vuelve a comprobar el rol en cada acción.

Si más adelante el navegador lee Firestore directo, las reglas tendrían que parecerse a esto (el claim `role` lo escribe el servidor):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function signedIn() {
      return request.auth != null;
    }
    function isAdmin() {
      return signedIn() && request.auth.token.role == 'ADMIN';
    }

    match /users/{userId} {
      allow read: if isAdmin() || (signedIn() && request.auth.uid == userId);
      allow write: if isAdmin();
    }

    match /duos/{duoId} {
      allow read: if signedIn();
      allow write: if isAdmin();
    }

    match /services/{serviceId} {
      allow read: if isAdmin()
        || resource.data.clientId == request.auth.uid
        || request.auth.uid in resource.data.assigneeIds;
      allow create: if request.auth.token.role == 'CLIENT'
        && request.resource.data.clientId == request.auth.uid
        && request.resource.data.status == 'SOLICITADO';
      allow update: if isAdmin()
        || (request.auth.token.role == 'EMPLOYEE'
            && request.auth.uid in resource.data.assigneeIds);
      allow delete: if false;
    }
  }
}
```

Ese bosquejo no está activo. El archivo que hay que publicar es `firestore.rules`.

## Arquitectura

- **Next.js (App Router) + TypeScript + Tailwind CSS.** La interfaz está en español (`es-BO`).
- **Firestore.** Colecciones `users`, `duos` y `services`. El precio por defecto es 250 Bs y la duración, 4 a 5 horas. Los horarios se guardan en hora de Bolivia (America/La_Paz).
- **Firebase Authentication.** Correo y contraseña. La sesión es una cookie `httpOnly` creada con el Admin SDK. El middleware solo comprueba que la cookie exista; cada pantalla y cada acción verifican la sesión y el rol en el servidor, leyendo el perfil en Firestore.
- **Tres áreas.** `/cliente`, `/empleado` y `/admin`.
- **Estados del servicio.** `solicitado → asignado → en_camino → en_progreso → completado`, o `cancelado`.

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Exige la configuración de Firebase y abre el servidor |
| `npm run seed` | Crea las cuentas demo y los servicios de ejemplo si faltan |
| `npm run dev:emulator` | Emuladores locales, siembra y servidor, sin proyecto remoto |
| `npm run lint` | ESLint |
| `npm run build` | Compila la aplicación |

## Fuera de esta versión

Pagos, WhatsApp, anuncios, seguimiento GPS, aplicación nativa y un plan de facturación de Firebase más allá de Authentication y Firestore.

## Accesibilidad

Texto en Atkinson Hyperlegible, contraste alto, estados con texto e icono, botones grandes y etiquetas visibles. El producto es un servicio de inclusión: la interfaz tiene que poder usarse con teclado y lector de pantalla.
