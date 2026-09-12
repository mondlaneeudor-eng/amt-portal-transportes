import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySession } from "../_lib/session.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store, private");

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const authenticated = await verifySession(req, res);
  res.status(authenticated ? 200 : 401).json({ authenticated });
}
