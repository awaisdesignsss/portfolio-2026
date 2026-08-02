"use client";

import { motion } from "framer-motion";
import { LinkArrowIcon, StarIcon } from "@/assets/icons";
import Reveal from "@/components/reveal";
import { CLIENTS, LOGOS_LABEL } from "./client-logos.data";
import useClientLogos from "./use-client-logos";

/**
 * "Built for Ambitious Brands" — the client / employer logo wall.
 *
 * Real logos live in /public/assets/images/clients. Each card reveals a
 * different kind of detail on hover (role, impact stat, or a short review),
 * so the wall doubles as a set of tiny proof points.
 */
export default function ClientLogos() {
  const { gridRef, chipRef, content, visible, springX, springY } = useClientLogos();

  return (
    <section className="logos section--light">
      <div className="container">
        <div className="logos__header">
          <Reveal variant="rise" className="logos__label-wrap">
            <StarIcon className="logos__star" />
            <span className="logos__label">{LOGOS_LABEL}</span>
          </Reveal>
          <LinkArrowIcon className="logos__arrow" />
        </div>

        <div className="logos__grid" ref={gridRef}>
          {CLIENTS.map((c, i) => (
            <Reveal
              variant="rise"
              delay={i * 0.055}
              className="logos__card"
              key={c.name}
              data-name={c.name}
            >
              <img
                className="logos__logo"
                src={c.src}
                alt={c.name}
                loading="lazy"
                style={{
                  maxHeight: `${c.maxH ?? 40}px`,
                  ...(c.maxW ? { maxWidth: `${c.maxW}%` } : null),
                }}
              />
            </Reveal>
          ))}
        </div>
      </div>

      {/* Cursor-following detail chip (fixed; x/y springs feed the transform). */}
      <motion.div
        ref={chipRef}
        className={`logos__chip${visible ? " is-visible" : ""}`}
        aria-hidden="true"
        style={{ x: springX, y: springY }}
      >
        {content && (
          <>
            <span className="logos__chip-tag">{content.reveal.label}</span>
            <p className="logos__chip-text">{content.reveal.detail}</p>
            <span className="logos__chip-meta">
              {content.reveal.kind === "review" ? content.reveal.attribution : content.reveal.meta}
            </span>
          </>
        )}
      </motion.div>
    </section>
  );
}
