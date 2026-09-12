import { SignJWT, jwtVerify } from "jose";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireEnv } from "./env.js";
import { appendSetCookie, clearCookie, readCookie, RATE_LIMIT_COOKIE } from "./cookies.js";

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 15 * 60;

/**
 * Serverless functions have no shared memory between invocations, so the
 * attempt counter travels in a server-signed (tamper-proof), HttpOnly
 * cookie rather than an in-process Map. The client can only reset it by
 * clearing cookies — a known trade-off of not provisioning a database or
 * KV store just for this counter.
 */
interface RateLimitState {
  count: number;
  lockUntil: number; // epoch ms; 0 when not locked
}

function secretKey() {
  return new TextEncoder().encode(requireEnv("SESSION_SECRET"));
}

async function readState(req: VercelRequest): Promise<RateLimitState> {
  const token = readCookie(req, RATE_LIMIT_COOKIE);
  if (!token) return { count: 0, lockUntil: 0 };
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return {
      count: typeof payload.count === "number" ? payload.count : 0,
      lockUntil: typeof payload.lockUntil === "number" ? payload.lockUntil : 0,
    };
  } catch {
    return { count: 0, lockUntil: 0 };
  }
}

async function writeState(res: VercelResponse, state: RateLimitState): Promise<void> {
  const token = await new SignJWT({ count: state.count, lockUntil: state.lockUntil })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${LOCKOUT_SECONDS}s`)
    .sign(secretKey());
  appendSetCookie(res, RATE_LIMIT_COOKIE, token, { maxAgeSeconds: LOCKOUT_SECONDS });
}

export interface RateLimitCheck {
  locked: boolean;
  remainingSeconds?: number;
}

export async function checkRateLimit(req: VercelRequest): Promise<RateLimitCheck> {
  const state = await readState(req);
  if (state.lockUntil > Date.now()) {
    return { locked: true, remainingSeconds: Math.ceil((state.lockUntil - Date.now()) / 1000) };
  }
  return { locked: false };
}

/** Call after a failed code attempt. Locks out for 15 minutes after the 5th. */
export async function recordFailedAttempt(req: VercelRequest, res: VercelResponse): Promise<void> {
  const state = await readState(req);
  const count = state.count + 1;
  const lockUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_SECONDS * 1000 : 0;
  await writeState(res, { count: lockUntil ? 0 : count, lockUntil });
}

export function resetRateLimit(res: VercelResponse): void {
  clearCookie(res, RATE_LIMIT_COOKIE);
}
