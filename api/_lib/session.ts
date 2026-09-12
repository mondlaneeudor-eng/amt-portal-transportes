import { SignJWT, jwtVerify } from "jose";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireEnv } from "./env.js";
import { appendSetCookie, clearCookie, readCookie, SESSION_COOKIE } from "./cookies.js";

export const SESSION_MAX_AGE_SECONDS = 30 * 60; // 30 minutes of inactivity

function secretKey() {
  return new TextEncoder().encode(requireEnv("SESSION_SECRET"));
}

/** Issues a fresh 30-minute control-room session cookie. */
export async function createSession(res: VercelResponse): Promise<void> {
  const token = await new SignJWT({ scope: "control-room" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(secretKey());

  appendSetCookie(res, SESSION_COOKIE, token, { maxAgeSeconds: SESSION_MAX_AGE_SECONDS });
}

/**
 * Verifies the session cookie. When valid, also re-issues it with a fresh
 * 30-minute window on `res` (sliding expiry — 30 minutes of *inactivity*,
 * not a fixed absolute expiry) so continued use keeps the session alive.
 */
export async function verifySession(req: VercelRequest, res: VercelResponse): Promise<boolean> {
  const token = readCookie(req, SESSION_COOKIE);
  if (!token) return false;

  try {
    await jwtVerify(token, secretKey());
  } catch {
    return false;
  }

  // Sliding expiry: any authenticated request extends the session.
  await createSession(res);
  return true;
}

export function endSession(res: VercelResponse): void {
  clearCookie(res, SESSION_COOKIE);
}
