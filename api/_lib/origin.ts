import type { VercelRequest } from "@vercel/node";

/**
 * Rejects requests whose Origin (or Referer, as a fallback for browsers/
 * clients that omit Origin on same-site GETs) doesn't match the host the
 * request was actually served from. Same-origin only — this API has no
 * legitimate cross-origin caller.
 */
export function isTrustedOrigin(req: VercelRequest): boolean {
  const host = req.headers.host;
  if (!host) return false;

  const origin = req.headers.origin;
  if (typeof origin === "string") {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }

  const referer = req.headers.referer;
  if (typeof referer === "string") {
    try {
      return new URL(referer).host === host;
    } catch {
      return false;
    }
  }

  // No Origin/Referer at all (e.g. some same-site navigations) — allow,
  // rather than locking out legitimate same-site requests entirely.
  return true;
}
