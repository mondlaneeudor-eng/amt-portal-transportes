import { Modal } from "./Modal";

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <Modal titleId="help-modal-title" title="Ajuda" onClose={onClose}>
      <p className="modal-body">
        Para assistência no acesso aos sistemas, contacte o suporte técnico da
        AMT.
      </p>
    </Modal>
  );
}
