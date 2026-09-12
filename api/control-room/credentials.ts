import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySession } from "../_lib/session.js";
import { loadServiceCredentials } from "../_lib/credentials.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store, private");

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const authenticated = await verifySession(req, res);
  if (!authenticated) {
    res.status(401).json({ error: "Sessão inválida ou expirada." });
    return;
  }

  res.status(200).json({ services: loadServiceCredentials() });
}
