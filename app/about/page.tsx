import type { Metadata } from "next";
import AboutContent from "@/components/about/about-content";

export const metadata: Metadata = {
  title: "About — M. Awais, UX/UI & Product Designer",
  description:
    "M. Awais is a UX/UI and product designer who turns complex systems into products people understand. Eight years across fintech, healthcare, and commerce.",
};

export default function AboutPage() {
  return <AboutContent />;
}
