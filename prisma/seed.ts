import { PrismaClient, type Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { DEMO_ACCOUNTS, DEMO_DUO, OFFER } from "../lib/offer";
import { boliviaDate } from "../lib/format";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash(DEMO_ACCOUNTS[0].password, 10);

  const duo = await prisma.duo.upsert({
    where: { name: DEMO_DUO.name },
    update: { description: DEMO_DUO.description },
    create: {
      name: DEMO_DUO.name,
      description: DEMO_DUO.description,
    },
  });

  const users = new Map<string, { id: string }>();

  for (const account of DEMO_ACCOUNTS) {
    const isEmployee = account.role === "EMPLOYEE";
    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: {},
      create: {
        name: account.name,
        email: account.email,
        passwordHash,
        role: account.role as Role,
        phone: account.phone,
        duoRole: account.duoRole,
        duoId: isEmployee ? duo.id : null,
      },
    });
    users.set(account.email, user);
  }

  const existing = await prisma.service.count();
  if (existing > 0) {
    console.log("La base ya tiene servicios. No se volvieron a crear los ejemplos.");
    return;
  }

  const clientId = users.get("camila.rojas@auraservicio.com")!.id;
  const anaId = users.get("ana.vargas@auraservicio.com")!.id;
  const luisId = users.get("luis.pena@auraservicio.com")!.id;

  await prisma.service.create({
    data: {
      address: "Condominio Urubó Village, calle 3, casa 12",
      zone: "Urubó",
      notes: "Casa de dos plantas. El portón es verde.",
      scheduledAt: boliviaDate(-3, 9),
      durationHours: OFFER.durationHours,
      priceBs: OFFER.priceBs,
      status: "COMPLETADO",
      clientId,
      assignments: {
        create: [{ employeeId: anaId }, { employeeId: luisId }],
      },
    },
  });

  await prisma.service.create({
    data: {
      address: "Av. San Martín, Edificio Equipetrol Norte, piso 6, depto 6B",
      zone: "Equipetrol",
      notes: "Dejar las llaves en portería al terminar. Hay dos dormitorios.",
      scheduledAt: boliviaDate(1, 8, 30),
      durationHours: OFFER.durationHours,
      priceBs: OFFER.priceBs,
      status: "ASIGNADO",
      clientId,
      assignments: {
        create: [{ employeeId: anaId }, { employeeId: luisId }],
      },
    },
  });

  await prisma.service.create({
    data: {
      address: "Calle Los Tajibos 145",
      zone: "Las Palmas",
      notes: "Tocar el timbre del portón. Prefieren productos sin fragancia fuerte.",
      scheduledAt: boliviaDate(4, 14),
      durationHours: OFFER.durationHours,
      priceBs: OFFER.priceBs,
      status: "SOLICITADO",
      clientId,
    },
  });

  console.log("Datos de demostración listos.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
