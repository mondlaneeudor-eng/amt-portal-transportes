interface UpdateBannerProps {
  onUpdate: () => void;
}

export function UpdateBanner({ onUpdate }: UpdateBannerProps) {
  return (
    <aside className="update-banner" role="status">
      <p className="update-banner__text">
        Está disponível uma nova versão do Portal AMT.
      </p>
      <button type="button" className="update-banner__button" onClick={onUpdate}>
        Actualizar
      </button>
    </aside>
  );
}
