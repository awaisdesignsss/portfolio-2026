import type { IService } from "./services.interface";

export const SERVICES_EYEBROW = "Capabilities";

export const SERVICES: IService[] = [
  {
    num: "(01)",
    name: "Web Design",
    description:
      "Responsive sites built from scratch: quick to load, easy to read, and made to turn visitors into customers.",
    thumbBackground:
      "url(/assets/images/services/web-design.jpg), radial-gradient(120% 120% at 60% 25%, #2a3a5a 0%, #1a2233 55%, #0d1320 100%)",
  },
  {
    num: "(02)",
    name: "UI/UX Design",
    description:
      "Flows and screens that feel obvious to use, with just enough personality to stick in memory.",
    thumbBackground:
      "url(/assets/images/services/ui-ux-design.jpg), radial-gradient(120% 120% at 60% 25%, #1a5a52 0%, #103b38 55%, #07201d 100%)",
  },
  {
    num: "(03)",
    name: "Product Design",
    description:
      "The whole journey, from strategy and research to design, turned into something you can actually ship.",
    thumbBackground:
      "url(/assets/images/services/product-design.jpg), radial-gradient(120% 120% at 60% 25%, #b3702f 0%, #5a3010 55%, #2a1606 100%)",
  },
  {
    num: "(04)",
    name: "Branding",
    description:
      "A visual identity that actually looks like you, and tells people who you are before they read a word.",
    thumbBackground:
      "url(/assets/images/services/branding.jpg), radial-gradient(120% 120% at 60% 25%, #5a2a55 0%, #34203a 55%, #170c1a 100%)",
  },
  {
    num: "(05)",
    name: "UX Audit",
    description:
      "A close look at where people get stuck, and a plain list of fixes, ranked by what will move the needle most.",
    thumbBackground:
      "url(/assets/images/services/ux-audit.jpg), radial-gradient(120% 120% at 60% 25%, #3a3a6e 0%, #1f1f44 55%, #0c0c20 100%)",
  },
  {
    num: "(06)",
    name: "AI-Native Design",
    description:
      "AI-powered experiences that quietly do the heavy lifting, so there’s less busywork for your team.",
    thumbBackground:
      "url(/assets/images/services/ai-native-design.jpg), radial-gradient(120% 120% at 60% 25%, #b58a2f 0%, #5a3a0a 55%, #2a1c04 100%)",
  },
];
