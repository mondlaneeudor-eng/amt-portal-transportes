import { useInstallPrompt } from "../hooks/useInstallPrompt";
import { CloseIcon } from "./icons";

export function InstallBanner() {
  const { visible, kind, install, dismiss } = useInstallPrompt();

  if (!visible || !kind) return null;

  return (
    <aside className="install-banner" role="dialog" aria-label="Instalar aplicação">
      <button
        type="button"
        className="install-banner__close"
        onClick={dismiss}
        aria-label="Fechar"
      >
        <CloseIcon width={16} height={16} />
      </button>

      {kind === "native" ? (
        <>
          <p className="install-banner__title">Instalar Portal AMT</p>
          <p className="install-banner__text">
            Adicione o portal ao seu dispositivo para aceder de forma mais
            rápida.
          </p>
          <div className="install-banner__actions">
            <button
              type="button"
              className="install-banner__primary"
              onClick={install}
            >
              Instalar
            </button>
            <button
              type="button"
              className="install-banner__secondary"
              onClick={dismiss}
            >
              Agora não
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="install-banner__title">Instalar Portal AMT</p>
          <p className="install-banner__text">
            Para instalar, toque em{" "}
            <span className="install-banner__icon" aria-hidden="true">
              ⬆️
            </span>{" "}
            Partilhar e seleccione{" "}
            <span className="install-banner__icon" aria-hidden="true">
              ➕
            </span>{" "}
            "Adicionar ao ecrã principal".
          </p>
          <div className="install-banner__actions">
            <button
              type="button"
              className="install-banner__secondary"
              onClick={dismiss}
            >
              Entendi
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
