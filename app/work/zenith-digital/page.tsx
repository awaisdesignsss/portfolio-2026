import type { Metadata } from "next";
import ZenithDigitalContent from "@/components/work/cases/zenith-digital-content";

export const metadata: Metadata = {
  title: "Zenith Digital — Case Study — M. Awais",
  description: "A mobile banking app rebuilt around trust and speed, so everyday money tasks take seconds and big moments feel safe.",
};

export default function Page() {
  return <ZenithDigitalContent />;
}
