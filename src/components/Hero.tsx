import { MaputoSkyline } from "./MaputoSkyline";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <MaputoSkyline />
      <div className="hero__content">
        <div className="hero__text">
          <h1 id="hero-title" className="hero__title">
            Sistemas de Monitoria e Gestão
          </h1>
          <p className="hero__subtitle">
            Acesso integrado aos serviços de transporte da Área Metropolitana
            de Maputo
          </p>
          <p className="status-badge">
            <span className="status-badge__dot" aria-hidden="true" />
            Todos os sistemas operacionais
          </p>
        </div>
        <p className="hero__caption">
          TRANSPORTES
          <br />
          PARA UMA ÁREA METROPOLITANA
          <br />
          MAIS CONECTADA
        </p>
      </div>
    </section>
  );
}
