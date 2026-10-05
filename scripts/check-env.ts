import { loadEnvFile } from "../lib/load-env";

loadEnvFile();

const project = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const emulator = Boolean(process.env.FIRESTORE_EMULATOR_HOST && process.env.FIREBASE_AUTH_EMULATOR_HOST);
const hasAdmin = Boolean(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY);

if (project && apiKey && (emulator || hasAdmin)) {
  process.exit(0);
}

console.error(`
Falta la configuración de Firebase.

Para un proyecto remoto, copie .env.example a .env y complete:
  NEXT_PUBLIC_FIREBASE_API_KEY
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
  NEXT_PUBLIC_FIREBASE_PROJECT_ID
  FIREBASE_PROJECT_ID
  FIREBASE_CLIENT_EMAIL
  FIREBASE_PRIVATE_KEY

Luego ejecute npm run seed y npm run dev.
Los pasos están en el README.

Para probar sin una cuenta de Google:
  npm run dev:emulator
`);
process.exit(1);
