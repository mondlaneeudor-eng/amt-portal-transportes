import { optionalEnv } from "./env.js";

export const CREDENTIAL_UNAVAILABLE_MESSAGE =
  "Credencial temporariamente indisponível. Contacte o responsável pelo sistema.";

export interface CredentialField {
  label: string;
  /** The actual secret value, or null when the env var is not configured. */
  value: string | null;
}

export interface CredentialLink {
  label: string;
  href: string;
}

export interface ServiceCredential {
  id: string;
  title: string;
  /** A single system address, when the service has exactly one. */
  address?: string;
  /** Multiple platform links, when the service exposes more than one (Transportes Municipais). */
  links?: CredentialLink[];
  identifier: CredentialField;
  password: CredentialField;
  instructions: string;
}

const ACCESS_INSTRUCTIONS =
  "Clique em “Aceder ao sistema”. Na página de autenticação, introduza o utilizador e a palavra-passe indicados abaixo.";

/**
 * Assembles the credential payload strictly from server-side environment
 * variables. Never called unless the caller already verified a valid
 * session — see api/control-room/credentials.ts. A missing variable never
 * falls back to a placeholder/test value: the field is reported as
 * unavailable and the client shows CREDENTIAL_UNAVAILABLE_MESSAGE instead.
 */
export function loadServiceCredentials(): ServiceCredential[] {
  return [
    {
      id: "transporte-escolar",
      title: "Transporte Escolar",
      address: "https://baza.paytech.tech",
      identifier: { label: "Utilizador", value: optionalEnv("SCHOOL_TRANSPORT_USERNAME") },
      password: { label: "Palavra-passe", value: optionalEnv("SCHOOL_TRANSPORT_PASSWORD") },
      instructions: ACCESS_INSTRUCTIONS,
    },
    {
      id: "transporte-bmm",
      title: "Transporte BMM",
      address: "https://www.autotraklive.com",
      identifier: { label: "E-mail", value: optionalEnv("BMM_USERNAME") },
      password: { label: "Palavra-passe", value: optionalEnv("BMM_PASSWORD") },
      instructions: ACCESS_INSTRUCTIONS,
    },
    {
      id: "transportes-municipais",
      title: "Transportes Municipais",
      links: [
        { label: "Gestão de Activos", href: "https://assetmanagement.vm.co.mz" },
        { label: "Relatórios", href: "https://assetreportes.vm.co.mz" },
      ],
      identifier: { label: "Utilizador", value: optionalEnv("MUNICIPAL_USERNAME") },
      password: { label: "Palavra-passe", value: optionalEnv("MUNICIPAL_PASSWORD") },
      instructions:
        "As mesmas credenciais dão acesso às duas plataformas abaixo — Gestão de Activos e Relatórios.",
    },
    {
      id: "transporte-intermodal",
      title: "Transporte Intermodal",
      address: "https://www.7-24Telematics.com",
      identifier: { label: "Login", value: optionalEnv("INTERMODAL_USERNAME") },
      password: { label: "Palavra-passe", value: optionalEnv("INTERMODAL_PASSWORD") },
      instructions: ACCESS_INSTRUCTIONS,
    },
  ];
}
