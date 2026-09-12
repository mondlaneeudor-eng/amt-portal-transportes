import { useState } from "react";
import amtLogo from "../assets/images/amt-logo.png";
import { HelpIcon, BellIcon, UserIcon, ChevronDownIcon } from "./icons";
import { HelpModal } from "./HelpModal";

export function Header() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="brand">
            <img
              src={amtLogo}
              alt="Logótipo da Agência Metropolitana de Transportes"
              className="brand__logo"
              width={48}
              height={48}
            />
            <span className="brand__name">
              Agência Metropolitana
              <br />
              de Transportes
            </span>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className="header-action header-action--help"
              onClick={() => setHelpOpen(true)}
            >
              <HelpIcon width={20} height={20} />
              <span>Ajuda</span>
            </button>

            <span className="header-divider" aria-hidden="true" />

            <button
              type="button"
              className="header-action header-action--icon-only"
              aria-label="Notificações"
            >
              <BellIcon width={20} height={20} />
              <span className="notification-dot" aria-hidden="true" />
            </button>

            <button type="button" className="control-room">
              <span className="control-room__avatar">
                <UserIcon width={16} height={16} />
              </span>
              <span>Sala de Controlo</span>
              <ChevronDownIcon width={16} height={16} />
            </button>
          </div>
        </div>
      </header>
      <div className="institutional-bar" role="presentation">
        <span className="institutional-bar__green" />
        <span className="institutional-bar__yellow" />
      </div>

      {helpOpen && <HelpModal onClose={() => setHelpOpen(false)} />}
    </>
  );
}
