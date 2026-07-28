import type { Metadata } from "next";
import AboutContent from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About · M. Awais, Senior Product Designer",
  description:
    "M. Awais is a Senior Product Designer in Lahore who turns dense, technical products into something people understand on the first try. Six years across fintech, healthcare, hospitality, SaaS, and enterprise.",
};

export default function AboutPage() {
  return <AboutContent />;
}
