import { firebaseProjectId } from "@/lib/firebase";

export async function signInWithPassword(email: string, password: string) {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = firebaseProjectId();
  if (!apiKey || !projectId) {
    throw new Error("Falta NEXT_PUBLIC_FIREBASE_API_KEY o el id del proyecto.");
  }

  const emulator = process.env.FIREBASE_AUTH_EMULATOR_HOST;
  const url = emulator
    ? `http://${emulator}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { idToken?: string };
  return payload.idToken ?? null;
}
