import React from "react";

/**
 * "Built for Ambitious Brands" — the client / employer logo wall.
 *
 * Real logos live in /public/assets/images/clients. Each card reveals a
 * different kind of detail on hover (role, impact stat, or a short review),
 * so the wall doubles as a set of tiny proof points.
 *
 * ⚠️ PLACEHOLDER CONTENT — every `detail`, `meta`, and `attribution` below is a
 * realistic stand-in, not verified fact. Swap in the real numbers / quotes
 * (or tell Awais the real ones) before this goes live. Nothing here is a real
 * quote from the named company yet.
 */

type Reveal =
  | { kind: "role"; label: string; detail: string; meta: string }
  | { kind: "impact"; label: string; detail: string; meta: string }
  | { kind: "review"; label: string; detail: string; attribution: string };

type Client = {
  name: string;
  src: string;
  /** slightly different logo footprints read better when tuned per-mark */
  maxH?: number;
  maxW?: number;
  reveal: Reveal;
};

const CLIENTS: Client[] = [
  {
    name: "tkxel",
    src: "/assets/images/clients/tkxel.png",
    maxH: 34,
    reveal: {
      kind: "role",
      label: "What I did",
      detail: "Led design on enterprise dashboards and a shared design system across teams.",
      meta: "2021–2023 · Enterprise SaaS",
    },
  },
  {
    name: "OptimusFox",
    src: "/assets/images/clients/optimusfox.png",
    maxH: 30,
    reveal: {
      kind: "impact",
      label: "Impact",
      detail: "40% faster onboarding after the redesign.",
      meta: "2019–2021 · Web & Product",
    },
  },
  {
    name: "Code District",
    src: "/assets/images/clients/code-district.webp",
    maxH: 46,
    reveal: {
      kind: "review",
      label: "Review",
      detail: "“Awais turns messy requirements into interfaces our clients get instantly.”",
      attribution: "Design Lead · 2018–2019",
    },
  },
  {
    name: "ASAP Semiconductor",
    src: "/assets/images/clients/asap.jpeg",
    maxH: 52,
    reveal: {
      kind: "impact",
      label: "Impact",
      detail: "2.1× more quote requests from the redesigned purchasing flow.",
      meta: "2023 · Procurement",
    },
  },
  {
    name: "Relia",
    src: "/assets/images/clients/azaq-relia.jpeg",
    maxH: 54,
    maxW: 84,
    reveal: {
      kind: "role",
      label: "What I did",
      detail: "UX & UI for the bilingual (EN / AR) customer app, end to end.",
      meta: "2023 · Fintech",
    },
  },
  {
    name: "Maximum Impact Partners",
    src: "/assets/images/clients/maximum-impact-partners.png",
    maxH: 56,
    reveal: {
      kind: "review",
      label: "Review",
      detail: "“Clear, fast, and genuinely strategic — he gets the business, not just the pixels.”",
      attribution: "Founder · 2022",
    },
  },
  {
    name: "WorkEasy",
    src: "/assets/images/clients/workeasy.svg",
    maxH: 40,
    reveal: {
      kind: "impact",
      label: "Impact",
      detail: "Support tickets down 30% after the dashboard rework.",
      meta: "2022 · SaaS",
    },
  },
  {
    name: "Consultancy Outfit",
    src: "/assets/images/clients/consultancy-outfit.png",
    maxH: 34,
    reveal: {
      kind: "role",
      label: "What I did",
      detail: "Brand identity and marketing site, designed from scratch.",
      meta: "2021 · Consulting",
    },
  },
];

export default function ClientLogos() {
  return (
    <section className="logos section--light">
      <div className="container">
        <div className="logos__header">
          <div className="logos__label-wrap">
            <svg className="logos__star" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 0L7.91 4.59L12.5 6L7.91 7.41L6.5 12L5.09 7.41L0.5 6L5.09 4.59L6.5 0Z" fill="currentColor" />
            </svg>
            <span className="logos__label">Built for Ambitious Brands</span>
          </div>
          <svg className="logos__arrow" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="logos__grid">
          {CLIENTS.map((c) => (
            <div className="logos__card" key={c.name} data-reveal={c.reveal.kind}>
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

              <div className="logos__hover" aria-hidden="true">
                <span className="logos__hover-tag">{c.reveal.label}</span>
                <p className="logos__hover-text">{c.reveal.detail}</p>
                <span className="logos__hover-meta">
                  {c.reveal.kind === "review" ? c.reveal.attribution : c.reveal.meta}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
