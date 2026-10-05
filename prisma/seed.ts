import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { DEFAULT_DURATION_HOURS, DEFAULT_PRICE_BS } from "../src/lib/constants";
import { DEMO_ACCOUNTS } from "../src/lib/demo-accounts";
import { pazDateTime } from "../src/lib/format";

const prisma = new PrismaClient();
const DUO_ID = "duo_inclusivo_1";

async function main() {
  for (const account of DEMO_ACCOUNTS) {
    const passwordHash = bcrypt.hashSync(account.password, 10);
    await prisma.user.upsert({
      where: { email: account.email },
      update: {
        name: account.name,
        passwordHash,
        role: account.role,
        phone: account.phone,
        duoRole: account.duoRole ?? null,
      },
      create: {
        name: account.name,
        email: account.email,
        passwordHash,
        role: account.role,
        phone: account.phone,
        duoRole: account.duoRole ?? null,
      },
    });
  }

  await prisma.duo.upsert({
    where: { id: DUO_ID },
    update: {
      name: "Dúo Inclusivo 1",
      notes: "Pareja de trabajo del Servicio Dúo Inclusivo en Santa Cruz.",
    },
    create: {
      id: DUO_ID,
      name: "Dúo Inclusivo 1",
      notes: "Pareja de trabajo del Servicio Dúo Inclusivo en Santa Cruz.",
    },
  });

  const nonEmployees = DEMO_ACCOUNTS.filter((account) => account.role !== "EMPLOYEE").map((account) => account.email);
  await prisma.user.updateMany({
    where: { email: { in: nonEmployees } },
    data: { duoId: null, duoRole: null },
  });

  for (const account of DEMO_ACCOUNTS.filter((item) => item.role === "EMPLOYEE")) {
    await prisma.user.update({
      where: { email: account.email },
      data: { duoId: DUO_ID, duoRole: account.duoRole ?? null },
    });
  }

  const serviceCount = await prisma.service.count();
  if (serviceCount > 0) {
    console.log("Base lista. Los servicios existentes se conservan.");
    return;
  }

  const users = await prisma.user.findMany({
    where: { email: { in: DEMO_ACCOUNTS.map((account) => account.email) } },
  });
  const byEmail = Object.fromEntries(users.map((user) => [user.email, user]));
  const client = byEmail["patricia.suarez@auraservicio.com"];
  const admin = byEmail["admin@auraservicio.com"];
  const ana = byEmail["ana.rojas@auraservicio.com"];
  const mateo = byEmail["mateo.vargas@auraservicio.com"];
  if (!client || !admin || !ana || !mateo) {
    throw new Error("Faltan usuarios de demostración.");
  }

  const completedAt = pazDateTime(-2, 8, 0);
  await prisma.service.create({
    data: {
      clientId: client.id,
      address: "Av. San Martín 1450, entre 4.º y 5.º anillo",
      zone: "Equipetrol",
      reference: "Edificio de esquina, departamento 3B",
      notes: "Dos dormitorios y baño. Hay un perro pequeño en el patio.",
      scheduledAt: completedAt,
      durationHours: DEFAULT_DURATION_HOURS,
      priceBs: DEFAULT_PRICE_BS,
      status: "COMPLETADO",
      duoId: DUO_ID,
      assignments: {
        create: [
          { employeeId: ana.id, duoRole: "APOYO" },
          { employeeId: mateo.id, duoRole: "INTEGRANTE" },
        ],
      },
      events: {
        create: [
          { actorId: client.id, message: "Servicio solicitado.", createdAt: new Date(completedAt.getTime() - 3 * 86400000) },
          { actorId: admin.id, message: "Se asignó Dúo Inclusivo 1: Ana Rojas (compañero de apoyo) y Mateo Vargas (integrante del dúo).", createdAt: new Date(completedAt.getTime() - 2 * 86400000) },
          { actorId: ana.id, message: "Estado actualizado a En camino.", createdAt: completedAt },
          { actorId: ana.id, message: "Estado actualizado a En progreso.", createdAt: new Date(completedAt.getTime() + 40 * 60000) },
          { actorId: mateo.id, message: "Estado actualizado a Completado.", createdAt: new Date(completedAt.getTime() + 5 * 3600000) },
        ],
      },
    },
  });

  const todayAt = pazDateTime(0, 9, 0);
  await prisma.service.create({
    data: {
      clientId: client.id,
      address: "Condominio Las Palmas, calle 8, casa 21",
      zone: "Las Palmas",
      reference: "Portón verde al final de la calle",
      notes: "Preferencia por productos sin aroma fuerte. La llave está con el portero.",
      scheduledAt: todayAt,
      durationHours: DEFAULT_DURATION_HOURS,
      priceBs: DEFAULT_PRICE_BS,
      status: "ASIGNADO",
      duoId: DUO_ID,
      assignments: {
        create: [
          { employeeId: ana.id, duoRole: "APOYO" },
          { employeeId: mateo.id, duoRole: "INTEGRANTE" },
        ],
      },
      events: {
        create: [
          { actorId: client.id, message: "Servicio solicitado.", createdAt: new Date(todayAt.getTime() - 2 * 86400000) },
          { actorId: admin.id, message: "Se asignó Dúo Inclusivo 1: Ana Rojas (compañero de apoyo) y Mateo Vargas (integrante del dúo).", createdAt: new Date(todayAt.getTime() - 86400000) },
        ],
      },
    },
  });

  const tomorrowAt = pazDateTime(1, 8, 30);
  await prisma.service.create({
    data: {
      clientId: client.id,
      address: "Urb. Urubó, calle Los Tajibos 88",
      zone: "Urubó",
      reference: "Casa de dos plantas, segundo ingreso",
      notes: "Limpiar planta baja y baños. No subir al estudio.",
      scheduledAt: tomorrowAt,
      durationHours: DEFAULT_DURATION_HOURS,
      priceBs: DEFAULT_PRICE_BS,
      status: "ASIGNADO",
      duoId: DUO_ID,
      assignments: {
        create: [
          { employeeId: ana.id, duoRole: "APOYO" },
          { employeeId: mateo.id, duoRole: "INTEGRANTE" },
        ],
      },
      events: {
        create: [
          { actorId: client.id, message: "Servicio solicitado.", createdAt: new Date(tomorrowAt.getTime() - 86400000) },
          { actorId: admin.id, message: "Se asignó Dúo Inclusivo 1: Ana Rojas (compañero de apoyo) y Mateo Vargas (integrante del dúo).", createdAt: new Date(tomorrowAt.getTime() - 2 * 3600000) },
        ],
      },
    },
  });

  const requestedAt = pazDateTime(3, 14, 0);
  await prisma.service.create({
    data: {
      clientId: client.id,
      address: "Av. Irala 320, 2.º anillo",
      zone: "Centro",
      reference: "Oficina en el primer piso, timbre Suárez",
      notes: "Local comercial pequeño. Ir después de las 14:00.",
      scheduledAt: requestedAt,
      durationHours: DEFAULT_DURATION_HOURS,
      priceBs: DEFAULT_PRICE_BS,
      status: "SOLICITADO",
      events: {
        create: [{ actorId: client.id, message: "Servicio solicitado." }],
      },
    },
  });

  console.log("Servicios de demostración creados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
