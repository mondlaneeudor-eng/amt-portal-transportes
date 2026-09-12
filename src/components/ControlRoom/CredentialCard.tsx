import { useEffect, useState } from "react";
import type { ServiceCredential } from "../../lib/controlRoomApi";
import { BusIcon, TrainIcon, ArrowRightIcon } from "../icons";
import { CREDENTIAL_UNAVAILABLE_MESSAGE } from "./unavailable";
import { copyToClipboard } from "../../lib/clipboard";

const ICON_BY_SERVICE: Record<string, "bus" | "train"> = {
  "transporte-escolar": "bus",
  "transporte-bmm": "bus",
  "transportes-municipais": "bus",
  "transporte-intermodal": "train",
};

const MASKED_PASSWORD = "••••••••••";

type FieldKind = "identifier" | "password";
type CopyState = { field: FieldKind; ok: boolean } | null;

interface CredentialCardProps {
  service: ServiceCredential;
  passwordVisible: boolean;
  onTogglePassword: () => void;
}

export function CredentialCard({ service, passwordVisible, onTogglePassword }: CredentialCardProps) {
  const Icon = ICON_BY_SERVICE[service.id] === "train" ? TrainIcon : BusIcon;
  const [copyState, setCopyState] = useState<CopyState>(null);

  useEffect(() => {
    if (!copyState) return;
    const timer = window.setTimeout(() => setCopyState(null), 2000);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  async function copy(field: FieldKind, value: string | null) {
    if (!value) return;
    const ok = await copyToClipboard(value);
    setCopyState({ field, ok });
  }

  function copyLabel(field: FieldKind, defaultLabel: string) {
    if (copyState?.field !== field) return defaultLabel;
    return copyState.ok ? "Copiado com sucesso." : "Não foi possível copiar.";
  }

  return (
    <article className="credential-card">
      <span className="service-card__icon credential-card__icon">
        <Icon width={22} height={22} />
      </span>
      <h3 className="service-card__title">{service.title}</h3>

      {service.address && <p className="credential-card__address">{service.address}</p>}

      <p className="credential-card__instructions">{service.instructions}</p>

      <div className="credential-card__field">
        <span className="credential-card__field-label">{service.identifier.label}</span>
        <span className="credential-card__field-value">
          {service.identifier.value ?? CREDENTIAL_UNAVAILABLE_MESSAGE}
        </span>
        <button
          type="button"
          className="credential-card__copy"
          onClick={() => copy("identifier", service.identifier.value)}
          disabled={!service.identifier.value}
        >
          {copyLabel("identifier", `Copiar ${service.identifier.label.toLowerCase()}`)}
        </button>
      </div>

      <div className="credential-card__field">
        <span className="credential-card__field-label">{service.password.label}</span>
        <span className="credential-card__field-value credential-card__field-value--password">
          {service.password.value === null
            ? CREDENTIAL_UNAVAILABLE_MESSAGE
            : passwordVisible
              ? service.password.value
              : MASKED_PASSWORD}
        </span>
        {service.password.value && (
          <button type="button" className="credential-card__toggle" onClick={onTogglePassword}>
            {passwordVisible ? "Ocultar" : "Mostrar"}
          </button>
        )}
        <button
          type="button"
          className="credential-card__copy"
          onClick={() => copy("password", service.password.value)}
          disabled={!service.password.value}
        >
          {copyLabel("password", "Copiar palavra-passe")}
        </button>
      </div>

      <div className="credential-card__access">
        {service.links ? (
          service.links.map((link) => (
            <a
              key={link.href}
              className="access-button"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Aceder a ${link.label} (abre num novo separador)`}
            >
              <span>Aceder — {link.label}</span>
              <ArrowRightIcon width={18} height={18} />
            </a>
          ))
        ) : (
          <a
            className="access-button"
            href={service.address}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Aceder ao sistema de ${service.title} (abre num novo separador)`}
          >
            <span>Aceder ao sistema</span>
            <ArrowRightIcon width={18} height={18} />
          </a>
        )}
      </div>

      <p className="credential-card__restricted">Uso exclusivo de pessoal autorizado.</p>
    </article>
  );
}
