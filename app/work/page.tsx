import type { Metadata } from "next";
import WorkContent from "@/components/work/work-content";

export const metadata: Metadata = {
  title: "Work — M. Awais, UX/UI & Product Designer",
  description:
    "Selected product and UX work by M. Awais across fintech, healthcare, commerce, SaaS, and banking.",
};

export default function WorkPage() {
  return <WorkContent />;
}
