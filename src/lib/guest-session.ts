import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const COOKIE_NAME = "lc-guest-sid";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 días

/** Devuelve el sessionId existente o crea uno nuevo y lo guarda en cookie. */
export async function getOrCreateGuestSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(COOKIE_NAME, id, {
    httpOnly: true,
    maxAge: MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
  return id;
}

/** Devuelve el sessionId si existe, o null. */
export async function getGuestSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

/** Elimina la cookie de sesión de invitado (después de completar el pedido). */
export async function clearGuestSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
