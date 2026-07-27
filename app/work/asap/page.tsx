import type { Metadata } from "next";
import AsapContent from "@/components/work/cases/asap-content";

export const metadata: Metadata = {
  title: "ASAP — Case Study — M. Awais",
  description: "A parts distribution company running 658 separate .NET websites, rebuilt as one Next.js CMS, with a site for every vertical and a single place to manage them all.",
};

export default function Page() {
  return <AsapContent />;
}
