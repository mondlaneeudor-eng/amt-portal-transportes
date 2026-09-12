import type { ServiceConfig } from "../config/services";
import { BusIcon, TrainIcon, ArrowRightIcon } from "./icons";

interface ServiceCardProps {
  service: ServiceConfig;
  onOpenOptions?: (service: ServiceConfig) => void;
}

export function ServiceCard({ service, onOpenOptions }: ServiceCardProps) {
  const Icon = service.icon === "train" ? TrainIcon : BusIcon;

  return (
    <article className="service-card">
      <img
        src={service.image}
        alt={service.imageAlt}
        className="service-card__image"
        loading="lazy"
      />
      <div className="service-card__body">
        <span
          className="service-card__icon"
          style={{ backgroundColor: service.iconBg }}
        >
          <Icon width={22} height={22} />
        </span>
        <h3 className="service-card__title">{service.title}</h3>
        {service.extraInfo && (
          <p className="service-card__extra">{service.extraInfo}</p>
        )}
        <p className="service-card__description">{service.description}</p>

        <div className="service-card__footer">
          <p className="status-line">
            <span className="status-line__dot" aria-hidden="true" />
            Sistema operacional
          </p>

          {service.options ? (
            <button
              type="button"
              className="access-button"
              onClick={() => onOpenOptions?.(service)}
              aria-label={`Aceder ao sistema de ${service.title} (abre uma janela para escolher a plataforma)`}
            >
              <span>Aceder ao sistema</span>
              <ArrowRightIcon width={18} height={18} />
            </button>
          ) : (
            <a
              className="access-button"
              href={service.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Aceder ao sistema de ${service.title} (abre num novo separador)`}
            >
              <span>Aceder ao sistema</span>
              <ArrowRightIcon width={18} height={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
