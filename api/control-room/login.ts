import { timingSafeEqual } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireEnv } from "../_lib/env.js";
import { isTrustedOrigin } from "../_lib/origin.js";
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from "../_lib/rateLimit.js";
import { createSession } from "../_lib/session.js";
import { logSecurityEvent } from "../_lib/auditLog.js";

const GENERIC_ERROR = "Código incorrecto. Verifique e tente novamente.";
const LOCKOUT_ERROR =
  "Demasiadas tentativas incorrectas. Tente novamente dentro de alguns minutos.";

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Different lengths would short-circuit timingSafeEqual, so pad to a
  // matching, fixed-size buffer first — the whole point is that a wrong
  // code takes the same time to reject regardless of how much of it matched.
  const max = Math.max(bufA.length, bufB.length, 32);
  const padded = (buf: Buffer) => Buffer.concat([buf, Buffer.alloc(max - buf.length)]);
  return bufA.length === bufB.length && timingSafeEqual(padded(bufA), padded(bufB));
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store, private");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!isTrustedOrigin(req)) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const rateLimit = await checkRateLimit(req);
  if (rateLimit.locked) {
    logSecurityEvent("access_locked_out");
    res.status(429).json({ error: LOCKOUT_ERROR });
    return;
  }

  const code = typeof req.body?.code === "string" ? req.body.code : "";

  let expected: string;
  try {
    expected = requireEnv("CONTROL_ROOM_ACCESS_CODE");
  } catch {
    // Fail closed: an unconfigured server must never accept any code.
    res.status(503).json({ error: "Serviço indisponível. Tente novamente mais tarde." });
    return;
  }

  if (!code || !constantTimeEquals(code, expected)) {
    await recordFailedAttempt(req, res);
    logSecurityEvent("access_denied");
    res.status(401).json({ error: GENERIC_ERROR });
    return;
  }

  resetRateLimit(res);
  await createSession(res);
  logSecurityEvent("access_granted");
  res.status(200).json({ authenticated: true });
}
