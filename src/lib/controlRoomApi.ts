export interface CredentialField {
  label: string;
  value: string | null;
}

export interface CredentialLink {
  label: string;
  href: string;
}

export interface ServiceCredential {
  id: string;
  title: string;
  address?: string;
  links?: CredentialLink[];
  identifier: CredentialField;
  password: CredentialField;
  instructions: string;
}

async function parseError(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json();
    return typeof data?.error === "string" ? data.error : fallback;
  } catch {
    return fallback;
  }
}

export async function fetchSession(): Promise<boolean> {
  const res = await fetch("/api/control-room/session", {
    method: "GET",
    credentials: "same-origin",
  });
  return res.ok;
}

export async function login(code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const res = await fetch("/api/control-room/login", {
    method: "POST",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    return { ok: false, error: await parseError(res, "Não foi possível validar o código.") };
  }
  return { ok: true };
}

export async function logout(): Promise<void> {
  await fetch("/api/control-room/logout", { method: "POST", credentials: "same-origin" });
}

export async function fetchCredentials(): Promise<
  { ok: true; services: ServiceCredential[] } | { ok: false; error: string }
> {
  const res = await fetch("/api/control-room/credentials", {
    method: "GET",
    credentials: "same-origin",
  });
  if (!res.ok) {
    return { ok: false, error: await parseError(res, "Sessão inválida ou expirada.") };
  }
  const data = await res.json();
  return { ok: true, services: data.services };
}
