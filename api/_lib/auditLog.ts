/**
 * Minimal security-event logging for the Sala de Controlo.
 *
 * This project provisions no database, so "infraestrutura adequada" here is
 * Vercel's own function log capture (Project → Logs in the dashboard) —
 * each line below is structured JSON on stdout, which Vercel timestamps and
 * retains on its own. Never log the access code, usernames, passwords, or
 * anything copied by the user — only the event kind and its own timestamp.
 */
export type SecurityEvent =
  | "access_granted"
  | "access_denied"
  | "access_locked_out"
  | "session_ended";

export function logSecurityEvent(event: SecurityEvent): void {
  console.log(
    JSON.stringify({
      scope: "control-room",
      event,
      at: new Date().toISOString(),
    })
  );
}
