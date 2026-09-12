import type { ServiceOption } from "../config/services";
import { Modal } from "./Modal";
import { ArrowRightIcon } from "./icons";

interface MunicipalModalProps {
  options: ServiceOption[];
  onClose: () => void;
}

export function MunicipalModal({ options, onClose }: MunicipalModalProps) {
  return (
    <Modal
      titleId="municipal-modal-title"
      title="Transportes Municipais"
      onClose={onClose}
    >
      <p className="modal-body">
        Seleccione a plataforma que pretende consultar.
      </p>
      <div className="modal-options">
        {options.map((option) => (
          <a
            key={option.href}
            className="modal-option-button"
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{option.label}</span>
            <ArrowRightIcon width={18} height={18} />
          </a>
        ))}
      </div>
    </Modal>
  );
}
