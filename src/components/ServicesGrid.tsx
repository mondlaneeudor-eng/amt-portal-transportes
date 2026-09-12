import { useState } from "react";
import { services } from "../config/services";
import type { ServiceConfig } from "../config/services";
import { ServiceCard } from "./ServiceCard";
import { MunicipalModal } from "./MunicipalModal";

export function ServicesGrid() {
  const [activeOptions, setActiveOptions] = useState<ServiceConfig | null>(
    null
  );

  return (
    <section className="services-grid" aria-label="Sistemas disponíveis">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onOpenOptions={setActiveOptions}
        />
      ))}

      {activeOptions?.options && (
        <MunicipalModal
          options={activeOptions.options}
          onClose={() => setActiveOptions(null)}
        />
      )}
    </section>
  );
}
