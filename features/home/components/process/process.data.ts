import type { IProcessStep } from "./process.interface";

/** Shared header/CTA copy — every panel repeats these verbatim. */
export const PROCESS_TAG = "Design Process";
export const PROCESS_CTA_LABEL = "Get started";
export const PROCESS_CTA_HREF = "#contact";

/** Dotted divider under each slide title (Figma node 2174:1457). */
export const PROCESS_DOT_COUNT = 6;

/** The four pinned slideshow stages, in scroll order. */
export const PROCESS_STEPS: IProcessStep[] = [
  {
    title: "Discover",
    image: "/assets/images/process/discover.png",
    alt: "Discover stage",
    counter: "01 / 04",
    description:
      "First I dig in. Research, real conversations with users, a hard look at the competition. I’d rather understand the problem properly than start pushing pixels and hope.",
  },
  {
    title: "Define",
    image: "/assets/images/process/define.png",
    alt: "Define stage",
    counter: "02 / 04",
    description:
      "Then I frame the real problem. Flows, structure, and one clear goal everyone agrees on, so we’re not quietly redesigning things halfway through.",
  },
  {
    title: "Design",
    image: "/assets/images/process/design.png",
    alt: "Design stage",
    counter: "03 / 04",
    description:
      "Now the fun part. Rough wireframes to polished screens, checked against real feedback at every step until it genuinely clicks.",
  },
  {
    title: "Deliver",
    image: "/assets/images/process/deliver.png",
    alt: "Deliver stage",
    counter: "04 / 04",
    description:
      "And I don’t vanish at handoff. Clean design systems, dev-ready specs, and I stick around through build and QA until it actually ships right.",
  },
];
