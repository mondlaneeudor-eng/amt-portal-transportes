import { useState } from "react";
import type { FormEvent } from "react";
import amtLogo from "../../assets/images/amt-logo.png";
import { Modal } from "../Modal";
import { ArrowRightIcon } from "../icons";

interface ControlRoomModalProps {
  loading: boolean;
  onSubmitCode: (code: string) => Promise<string | null>;
  onClose: () => void;
}

export function ControlRoomModal({ loading, onSubmitCode, onClose }: ControlRoomModalProps) {
  const [code, setCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!code || submitting || loading) return;
    setSubmitting(true);
    setError(null);
    const result = await onSubmitCode(code);
    setSubmitting(false);
    if (result) {
      setError(result);
      setCode("");
    }
  }

  return (
    <Modal
      titleId="control-room-modal-title"
      title="Acesso à Sala de Controlo"
      onClose={onClose}
    >
      <div className="control-room-modal">
        <img
          src={amtLogo}
          alt="Logótipo da Agência Metropolitana de Transportes"
          className="control-room-modal__logo"
          width={56}
          height={56}
        />
        <p className="modal-body">Introduza o código de acesso autorizado.</p>

        <form onSubmit={handleSubmit} className="control-room-form" autoComplete="off">
          <label htmlFor="control-room-code" className="control-room-form__label">
            Código de acesso
          </label>
          <div className="control-room-form__field">
            <input
              id="control-room-code"
              name="control-room-access-token"
              type={showCode ? "text" : "password"}
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-1p-ignore="true"
              data-lpignore="true"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              disabled={loading || submitting}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "control-room-error" : undefined}
              autoFocus
            />
            <button
              type="button"
              className="control-room-form__toggle"
              onClick={() => setShowCode((value) => !value)}
              aria-label={showCode ? "Ocultar código" : "Mostrar código"}
              disabled={loading || submitting}
            >
              {showCode ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {error && (
            <p id="control-room-error" className="control-room-form__error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="access-button control-room-form__submit"
            disabled={loading || submitting || !code}
          >
            <span>{submitting ? "A verificar…" : "Entrar"}</span>
            <ArrowRightIcon width={18} height={18} />
          </button>
        </form>
      </div>
    </Modal>
  );
}
