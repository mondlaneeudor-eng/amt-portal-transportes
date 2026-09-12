/**
 * Reads a required server-side secret from the environment.
 *
 * Throws (never returns a placeholder) when missing, so a misconfigured
 * deployment fails closed instead of silently accepting any code/credential.
 */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

/**
 * Same as `requireEnv`, but returns null instead of throwing when the
 * variable is missing — used for per-service credentials, where a single
 * missing value should degrade that one field gracefully rather than fail
 * the whole Sala de Controlo (see api/_lib/credentials.ts).
 */
export function optionalEnv(name: string): string | null {
  const value = process.env[name];
  return value ? value : null;
}

export function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}
