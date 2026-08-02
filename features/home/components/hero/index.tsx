"use client";

import { motion } from "framer-motion";
import { ArrowRightIcon } from "@/assets/icons";
import HeroAurora from "./components/hero-aurora";
import useMagnetic from "./use-magnetic";
import {
  HERO_AVAILABLE,
  HERO_BG,
  HERO_CTA_LABEL,
  HERO_DESCRIPTION,
  HERO_INTRO,
  HERO_MENU,
  HERO_NAME,
  HERO_SUBTITLE,
} from "./hero.data";

/**
 * Hero — the splash. Its entrance is pure CSS choreography (`.hero-reveal`
 * keyframes in styles.css), so no scroll-entrance motion here; the only JS
 * motion is the magnetic pull on the two primary actions.
 */
export default function Hero() {
  const btn = useMagnetic();
  const btnIcon = useMagnetic();

  return (
    <section className="hero">
      <img src={HERO_BG.src} alt={HERO_BG.alt} className="hero__bg" />
      <div className="hero__fx" aria-hidden="true">
        <HeroAurora />
      </div>

      <div className="hero__lead">
        <div className="hero__content">
          <div className="hero__info">
            <h2 className="hero__subtitle">{HERO_SUBTITLE}</h2>
            <p className="hero__description">{HERO_DESCRIPTION}</p>
          </div>
          <div className="hero__actions">
            <motion.a
              href="#work"
              className="hero__btn"
              style={{ x: btn.x, y: btn.y }}
              onPointerMove={btn.onPointerMove}
              onPointerLeave={btn.onPointerLeave}
            >
              {HERO_CTA_LABEL}
            </motion.a>
            <motion.a
              href="#work"
              className="hero__btn-icon"
              aria-label="Scroll down"
              style={{ x: btnIcon.x, y: btnIcon.y }}
              onPointerMove={btnIcon.onPointerMove}
              onPointerLeave={btnIcon.onPointerLeave}
            >
              <ArrowRightIcon />
            </motion.a>
          </div>
        </div>

        <p className="hero__name">{HERO_NAME}</p>
      </div>

      <p className="hero__intro">{HERO_INTRO}</p>

      <p className="hero__available"><span className="hero__bullet"></span>{HERO_AVAILABLE}</p>

      <ul className="hero__menu">
        {HERO_MENU.map(({ href, label, Icon }) => (
          <li className="hero__menu-item" key={label}>
            <a className="hero__menu-link" href={href} target="_blank" rel="noopener noreferrer">
              <span className="hero__menu-label">
                <Icon className="hero__menu-icon" />
                {label}
              </span>
              <ArrowRightIcon
                className="hero__menu-arrow"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
