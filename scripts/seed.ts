import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "../lib/firebase";
import { boliviaDate } from "../lib/format";
import { loadEnvFile } from "../lib/load-env";
import { DEMO_ACCOUNTS, DEMO_DUO, OFFER } from "../lib/offer";
import { isRole, type AppRole } from "../lib/labels";

loadEnvFile();

function authCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return "";
}

async function ensureAuthUser(email: string, password: string, name: string) {
  const auth = adminAuth();
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    if (authCode(error) !== "auth/user-not-found") throw error;
    return auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: true,
    });
  }
}

async function main() {
  const duoRef = adminDb().collection("duos").doc(DEMO_DUO.id);
  await duoRef.set(
    { name: DEMO_DUO.name, description: DEMO_DUO.description },
    { merge: true },
  );

  const users = new Map<string, string>();
  for (const account of DEMO_ACCOUNTS) {
    const authUser = await ensureAuthUser(account.email, account.password, account.name);
    const role = account.role as AppRole;
    const isEmployee = role === "EMPLOYEE";
    const ref = adminDb().collection("users").doc(authUser.uid);
    const existing = await ref.get();
    const storedRole = existing.data()?.role;
    if (!existing.exists || !isRole(String(storedRole ?? ""))) {
      await ref.set(
        {
          name: account.name,
          email: account.email,
          role,
          phone: account.phone,
          duoId: isEmployee ? DEMO_DUO.id : null,
          duoRole: account.duoRole,
        },
        { merge: true },
      );
    }
    const profile = (await ref.get()).data();
    const claimRole = profile?.role ?? role;
    await adminAuth().setCustomUserClaims(authUser.uid, { role: claimRole });
    users.set(account.email, authUser.uid);
  }

  const existingServices = await adminDb().collection("services").limit(1).get();
  if (!existingServices.empty) {
    console.log("Firestore ya tiene servicios. No se volvieron a crear los ejemplos.");
    return;
  }

  const clientId = users.get("camila.rojas@auraservicio.com");
  const anaId = users.get("ana.vargas@auraservicio.com");
  const luisId = users.get("luis.pena@auraservicio.com");
  if (!clientId || !anaId || !luisId) {
    throw new Error("Faltan las cuentas de demostración.");
  }

  const samples = [
    {
      address: "Condominio Urubó Village, calle 3, casa 12",
      zone: "Urubó",
      notes: "Casa de dos plantas. El portón es verde.",
      scheduledAt: boliviaDate(-3, 9),
      status: "COMPLETADO",
      assigneeIds: [anaId, luisId],
    },
    {
      address: "Av. San Martín, Edificio Equipetrol Norte, piso 6, depto 6B",
      zone: "Equipetrol",
      notes: "Dejar las llaves en portería al terminar. Hay dos dormitorios.",
      scheduledAt: boliviaDate(1, 8, 30),
      status: "ASIGNADO",
      assigneeIds: [anaId, luisId],
    },
    {
      address: "Calle Los Tajibos 145",
      zone: "Las Palmas",
      notes: "Tocar el timbre del portón. Prefieren productos sin fragancia fuerte.",
      scheduledAt: boliviaDate(4, 14),
      status: "SOLICITADO",
      assigneeIds: [],
    },
  ];

  for (const sample of samples) {
    await adminDb().collection("services").add({
      ...sample,
      scheduledAt: Timestamp.fromDate(sample.scheduledAt),
      durationHours: OFFER.durationHours,
      priceBs: OFFER.priceBs,
      clientId,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  console.log("Datos de demostración listos en Firebase.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
