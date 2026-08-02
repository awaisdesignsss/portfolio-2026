import type { IClient } from "./client-logos.interface";

/**
 * ⚠️ PLACEHOLDER CONTENT — every `detail`, `meta`, and `attribution` below is a
 * realistic stand-in, not verified fact. Swap in the real numbers / quotes
 * (or tell Awais the real ones) before this goes live. Nothing here is a real
 * quote from the named company yet.
 */

export const LOGOS_LABEL = "Built for Ambitious Brands";

export const CLIENTS: IClient[] = [
  {
    name: "tkxel",
    src: "/assets/images/clients/tkxel.png",
    maxH: 34,
    reveal: {
      kind: "role",
      label: "What I did",
      detail: "Led design on enterprise dashboards and a shared design system across teams.",
      meta: "2025 to Now · Enterprise SaaS",
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
      meta: "2023 to 2024 · Web & Product",
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
      attribution: "Design Lead · 2024 to 2025",
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
    maxH: 92,
    maxW: 62,
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
    maxH: 74,
    reveal: {
      kind: "review",
      label: "Review",
      detail: "“Clear, fast, and genuinely strategic, he gets the business, not just the pixels.”",
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
