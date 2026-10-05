import {
  FieldValue,
  Timestamp,
  type DocumentData,
  type DocumentSnapshot,
  type Query,
} from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/lib/firebase";
import { isRole, isStatus, type AppRole, type Status } from "@/lib/labels";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
  phone: string | null;
  duoId: string | null;
  duoRole: string | null;
  duoName: string | null;
};

export type DuoRecord = {
  id: string;
  name: string;
  description: string | null;
  memberIds: string[];
};

export type ServiceRecord = {
  id: string;
  address: string;
  zone: string | null;
  notes: string | null;
  scheduledAt: Date;
  durationHours: number;
  priceBs: number;
  status: Status;
  clientId: string;
  client: { id: string; name: string; phone: string | null; email: string };
  assignments: {
    employeeId: string;
    employee: { id: string; name: string; phone: string | null; duoRole: string | null };
  }[];
};

function textOrNull(value: unknown) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function toDate(value: unknown) {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") {
    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return new Date(0);
}

async function duoNameMap() {
  const snapshot = await adminDb().collection("duos").get();
  return new Map(snapshot.docs.map((doc) => [doc.id, String(doc.data().name ?? "")]));
}

function parseUser(id: string, data: DocumentData, duos: Map<string, string>): UserRecord | null {
  if (!isRole(String(data.role ?? ""))) return null;
  const duoId = textOrNull(data.duoId);
  return {
    id,
    name: String(data.name ?? ""),
    email: String(data.email ?? "").toLowerCase(),
    role: data.role,
    phone: textOrNull(data.phone),
    duoId,
    duoRole: textOrNull(data.duoRole),
    duoName: duoId ? duos.get(duoId) ?? null : null,
  };
}

export async function getUser(id: string) {
  const [snapshot, duos] = await Promise.all([
    adminDb().collection("users").doc(id).get(),
    duoNameMap(),
  ]);
  if (!snapshot.exists) return null;
  return parseUser(snapshot.id, snapshot.data() ?? {}, duos);
}

export async function listUsers() {
  const [snapshot, duos] = await Promise.all([
    adminDb().collection("users").get(),
    duoNameMap(),
  ]);
  return snapshot.docs
    .map((doc) => parseUser(doc.id, doc.data(), duos))
    .filter((user): user is UserRecord => user !== null);
}

export async function listEmployees() {
  const users = await listUsers();
  return users
    .filter((user) => user.role === "EMPLOYEE")
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

export async function listDuos(): Promise<DuoRecord[]> {
  const [snapshot, employees] = await Promise.all([
    adminDb().collection("duos").get(),
    listEmployees(),
  ]);
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      name: String(doc.data().name ?? ""),
      description: textOrNull(doc.data().description),
      memberIds: employees.filter((employee) => employee.duoId === doc.id).map((employee) => employee.id),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));
}

async function usersByIds(ids: string[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const duos = await duoNameMap();
  const found = new Map<string, UserRecord>();
  const firestore = adminDb();
  for (let index = 0; index < unique.length; index += 50) {
    const slice = unique.slice(index, index + 50);
    const refs = slice.map((id) => firestore.collection("users").doc(id));
    if (refs.length === 0) continue;
    const snapshots = await firestore.getAll(...refs);
    for (const snapshot of snapshots) {
      if (!snapshot.exists) continue;
      const user = parseUser(snapshot.id, snapshot.data() ?? {}, duos);
      if (user) found.set(user.id, user);
    }
  }
  return found;
}

function parseService(id: string, data: DocumentData, users: Map<string, UserRecord>): ServiceRecord | null {
  if (!isStatus(String(data.status ?? ""))) return null;
  const clientId = String(data.clientId ?? "");
  const client = users.get(clientId);
  const assigneeIds = Array.isArray(data.assigneeIds) ? data.assigneeIds.map(String) : [];
  return {
    id,
    address: String(data.address ?? ""),
    zone: textOrNull(data.zone),
    notes: textOrNull(data.notes),
    scheduledAt: toDate(data.scheduledAt),
    durationHours: Number(data.durationHours ?? 4.5),
    priceBs: Number(data.priceBs ?? 250),
    status: data.status,
    clientId,
    client: {
      id: clientId,
      name: client?.name ?? "Cliente",
      phone: client?.phone ?? null,
      email: client?.email ?? "",
    },
    assignments: assigneeIds.map((employeeId) => {
      const employee = users.get(employeeId);
      return {
        employeeId,
        employee: {
          id: employeeId,
          name: employee?.name ?? "Empleado",
          phone: employee?.phone ?? null,
          duoRole: employee?.duoRole ?? null,
        },
      };
    }),
  };
}

async function hydrate(docs: DocumentSnapshot[]) {
  const present = docs.filter((doc) => doc.exists);
  const ids: string[] = [];
  for (const doc of present) {
    const data = doc.data() ?? {};
    if (data.clientId) ids.push(String(data.clientId));
    if (Array.isArray(data.assigneeIds)) ids.push(...data.assigneeIds.map(String));
  }
  const users = await usersByIds(ids);
  return present
    .map((doc) => parseService(doc.id, doc.data() ?? {}, users))
    .filter((service): service is ServiceRecord => service !== null)
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

export async function listServices(filter?: { clientId?: string; assigneeId?: string }) {
  let query: Query = adminDb().collection("services");
  if (filter?.clientId) query = query.where("clientId", "==", filter.clientId);
  else if (filter?.assigneeId) query = query.where("assigneeIds", "array-contains", filter.assigneeId);
  const snapshot = await query.get();
  return hydrate(snapshot.docs);
}

export async function getService(id: string) {
  const snapshot = await adminDb().collection("services").doc(id).get();
  if (!snapshot.exists) return null;
  const [service] = await hydrate([snapshot]);
  return service ?? null;
}

export async function createService(input: {
  address: string;
  zone: string | null;
  notes: string | null;
  scheduledAt: Date;
  durationHours: number;
  priceBs: number;
  clientId: string;
}) {
  const ref = adminDb().collection("services").doc();
  await ref.set({
    address: input.address,
    zone: input.zone,
    notes: input.notes,
    scheduledAt: Timestamp.fromDate(input.scheduledAt),
    durationHours: input.durationHours,
    priceBs: input.priceBs,
    status: "SOLICITADO",
    clientId: input.clientId,
    assigneeIds: [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  });
  return ref.id;
}

export async function updateService(id: string, data: { status?: Status; assigneeIds?: string[] }) {
  await adminDb()
    .collection("services")
    .doc(id)
    .update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
}

function authErrorCode(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    return String((error as { code: unknown }).code);
  }
  return "";
}

export async function createAppUser(input: {
  name: string;
  email: string;
  password: string;
  role: AppRole;
  phone: string | null;
  duoId: string | null;
  duoRole: string | null;
}) {
  try {
    const created = await adminAuth().createUser({
      email: input.email,
      password: input.password,
      displayName: input.name,
      emailVerified: true,
    });
    await adminAuth().setCustomUserClaims(created.uid, { role: input.role });
    await adminDb().collection("users").doc(created.uid).set({
      name: input.name,
      email: input.email,
      role: input.role,
      phone: input.phone,
      duoId: input.role === "EMPLOYEE" ? input.duoId : null,
      duoRole: input.role === "EMPLOYEE" ? input.duoRole : null,
    });
    return { id: created.uid };
  } catch (error) {
    if (authErrorCode(error) === "auth/email-already-exists") {
      return { error: "exists" as const };
    }
    console.error(error);
    return { error: "failed" as const };
  }
}

export async function updateUserRole(userId: string, role: AppRole) {
  const ref = adminDb().collection("users").doc(userId);
  const snapshot = await ref.get();
  if (!snapshot.exists) return false;
  const current = snapshot.data() ?? {};
  await adminAuth().setCustomUserClaims(userId, { role });
  await ref.update({
    role,
    duoId: role === "EMPLOYEE" ? textOrNull(current.duoId) : null,
    duoRole: role === "EMPLOYEE" ? textOrNull(current.duoRole) : null,
  });
  return true;
}
