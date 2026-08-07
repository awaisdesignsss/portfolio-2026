import { BehanceIcon, DribbbleIcon, LinkedinIcon, WhatsappIcon } from "@/assets/icons";

export const SITE_EMAIL = "hello@awaisdesigns.com";
export const EMAIL_HREF = `mailto:${SITE_EMAIL}`;
export const WHATSAPP_HREF = "https://wa.me/923027778210";
export const PHONE_DISPLAY = "+92 302 7778210";
export const COPYRIGHT = "© 2026 M. Awais";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export const SOCIAL_LINKS = [
  { href: "https://www.linkedin.com/in/awaisdesigns", label: "LinkedIn", Icon: LinkedinIcon },
  { href: "https://dribbble.com/awaisdesigns", label: "Dribbble", Icon: DribbbleIcon },
  { href: "https://www.behance.net/awais_designs", label: "Behance", Icon: BehanceIcon },
  { href: WHATSAPP_HREF, label: "Whatsapp", Icon: WhatsappIcon },
];
