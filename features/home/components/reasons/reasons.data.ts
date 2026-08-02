import type { IAvatar, IReason } from "./reasons.interface";

export const REASONS_EYEBROW = "Why work with me";

/** Two heading lines — rendered with a <br /> between them, like the original markup. */
export const REASONS_HEADING = ["Senior design,", "thought through."];

export const REASONS_LEAD =
  "Senior-level design, thought through properly and shaped around your product, never pulled off a template. Here is what that looks like in practice.";

export const REASONS_CTA_LABEL = "Contact me";

export const REASONS_TRUST = "Trusted by founders and product leads I’ve worked with";

export const AVATARS: IAvatar[] = [
  {
    background:
      "url(/assets/images/avatars/avatar-1.jpg) center/cover no-repeat, linear-gradient(135deg, #3a4a6e, #1a2233)",
  },
  {
    background:
      "url(/assets/images/avatars/avatar-2.jpg) center/cover no-repeat, linear-gradient(135deg, #1a5a52, #07201d)",
  },
  {
    background:
      "url(/assets/images/avatars/avatar-3.jpg) center/cover no-repeat, linear-gradient(135deg, #b3702f, #5a3010)",
  },
  {
    background:
      "url(/assets/images/avatars/avatar-4.jpg) center/cover no-repeat, linear-gradient(135deg, #5a2a55, #170c1a)",
  },
];

export const AVATARS_MORE = "+81";

export const REASONS: IReason[] = [
  {
    icon: "/assets/images/reasons/icon-1.png",
    title: "Senior Craft, Hands-On",
    description:
      "You work with someone who has shipped real products across fintech, healthcare, and SaaS, doing the actual design, not passing it to a junior.",
  },
  {
    icon: "/assets/images/reasons/icon-2.png",
    title: "Problem First, Pixels Later",
    description:
      "I start with research and a clearly framed problem, so the work solves the right thing instead of just looking good.",
  },
  {
    icon: "/assets/images/reasons/icon-3.png",
    title: "Systems That Scale",
    description:
      "Clean design systems and dev-ready specs, so the design holds together and ships without friction.",
  },
  {
    icon: "/assets/images/reasons/icon-4.png",
    title: "Clear Collaboration",
    description:
      "Straight talk and simple updates. You always know exactly where things stand, no chasing.",
  },
  {
    icon: "/assets/images/reasons/icon-5.png",
    title: "In It Through Ship",
    description:
      "I don’t vanish at handoff. I stay through build and QA until it works in the real world.",
  },
];
