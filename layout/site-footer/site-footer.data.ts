import { NAV_LINKS } from "@/constants";

/** Footer copy — the strings the old JSX carried inline. */
export const FOOTER_EYEBROW = "Contact";
export const FOOTER_CTA_HEADING = "Get in touch";
export const FOOTER_CTA_LABEL = "Let's talk";
export const FOOTER_TAGLINE = "Calm, clear design for products people love to use.";

/** Nav links plus the zero-padded index the footer prints beside each label. */
export const FOOTER_LINKS = NAV_LINKS.map((link, i) => ({
  ...link,
  num: String(i + 1).padStart(2, "0"),
}));
