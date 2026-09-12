import { parseCookie, stringifySetCookie } from "cookie";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isProduction } from "./env.js";

export const SESSION_COOKIE = "crc_session";
export const RATE_LIMIT_COOKIE = "crc_rl";

export function readCookie(req: VercelRequest, name: string): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  return parseCookie(header)[name];
}

interface SetCookieOptions {
  maxAgeSeconds: number;
}

/** Every cookie this API sets is HttpOnly + SameSite=Strict, Secure in production. */
export function appendSetCookie(
  res: VercelResponse,
  name: string,
  value: string,
  { maxAgeSeconds }: SetCookieOptions
) {
  const cookieStr = stringifySetCookie({
    name,
    value,
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    maxAge: maxAgeSeconds,
  });
  const existing = res.getHeader("Set-Cookie");
  const next = existing
    ? [...(Array.isArray(existing) ? existing : [String(existing)]), cookieStr]
    : [cookieStr];
  res.setHeader("Set-Cookie", next);
}

export function clearCookie(res: VercelResponse, name: string) {
  appendSetCookie(res, name, "", { maxAgeSeconds: 0 });
}
