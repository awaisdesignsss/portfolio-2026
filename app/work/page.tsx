import type { Metadata } from "next";
import WorkContent from "@/components/work/work-content";

export const metadata: Metadata = {
  title: "Work · M. Awais, Senior Product Designer",
  description:
    "Selected product and UX work by M. Awais across fintech, e-commerce, enterprise, workforce, hospitality, and healthcare.",
};

export default function WorkPage() {
  return <WorkContent />;
}
