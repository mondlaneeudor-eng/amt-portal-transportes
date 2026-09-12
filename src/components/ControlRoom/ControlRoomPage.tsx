import { useCallback, useEffect, useRef, useState } from "react";
import type { ServiceCredential } from "../../lib/controlRoomApi";
import { CredentialCard } from "./CredentialCard";

const PASSWORD_AUTO_HIDE_MS = 30_000;

interface ControlRoomPageProps {
  services: ServiceCredential[];
  onLogout: () => void;
}

export function ControlRoomPage({ services, onLogout }: ControlRoomPageProps) {
  const [visiblePasswordId, setVisiblePasswordId] = useState<string | null>(null);
  const hideTimer = useRef<number | null>(null);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  useEffect(() => clearHideTimer, [clearHideTimer]);

  function handleTogglePassword(id: string) {
    clearHideTimer();
    setVisiblePasswordId((current) => {
      if (current === id) return null;
      hideTimer.current = window.setTimeout(() => {
        setVisiblePasswordId(null);
      }, PASSWORD_AUTO_HIDE_MS);
      return id;
    });
  }

  return (
    <section className="control-room-page" aria-labelledby="control-room-page-title">
      <div className="control-room-page__header">
        <div>
          <h1 id="control-room-page-title" className="control-room-page__title">
            Sala de Controlo
          </h1>
          <p className="control-room-page__subtitle">
            Credenciais de acesso aos sistemas de monitoria e gestão
          </p>
        </div>
        <button type="button" className="control-room-page__logout" onClick={onLogout}>
          Terminar sessão
        </button>
      </div>

      <div className="control-room-grid">
        {services.map((service) => (
          <CredentialCard
            key={service.id}
            service={service}
            passwordVisible={visiblePasswordId === service.id}
            onTogglePassword={() => handleTogglePassword(service.id)}
          />
        ))}
      </div>

      <p className="control-room-page__notice">
        As credenciais apresentadas são de uso institucional. Não devem ser
        partilhadas com pessoas não autorizadas.
      </p>
    </section>
  );
}
