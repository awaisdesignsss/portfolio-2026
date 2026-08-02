"use client";

import Wordmark from "@/components/ui/wordmark";
import NavWhatsapp from "@/components/ui/nav-whatsapp";
import { EMAIL_HREF, NAV_LINKS } from "@/constants";
import { useSiteHeader } from "./use-site-header";
import type { ISiteHeaderProps } from "./site-header.interface";

export default function SiteHeader({ activeHref = "/" }: ISiteHeaderProps) {
  const { isOpen, toggle, toggleLabel, navClassName } = useSiteHeader();

  return (
    <nav className={navClassName}>
      <div className="nav__logo">
        <Wordmark />
      </div>
      <div className="nav__menu">
        {/* The global NavPill glides this pill under hovered/current links. */}
        <span className="nav__pill" aria-hidden="true" />
        {NAV_LINKS.map(({ href, label }) => (
          <a
            key={href}
            href={href}
            className="nav__link"
            aria-current={href === activeHref ? "page" : undefined}
          >
            {label}
          </a>
        ))}
      </div>
      <div className="nav__actions">
        <NavWhatsapp />
        <a href={EMAIL_HREF} className="nav__cta">Email me</a>
      </div>
      <button
        className="nav__toggle"
        aria-label={toggleLabel}
        aria-expanded={isOpen}
        onClick={toggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>
  );
}
