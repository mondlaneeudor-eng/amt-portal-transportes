import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isTrustedOrigin } from "../_lib/origin.js";
import { endSession } from "../_lib/session.js";
import { logSecurityEvent } from "../_lib/auditLog.js";

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

  endSession(res);
  logSecurityEvent("session_ended");
  res.status(200).json({ authenticated: false });
}
