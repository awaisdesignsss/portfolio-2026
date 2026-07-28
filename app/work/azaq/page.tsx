import type { Metadata } from "next";
import AzaqContent from "@/components/work/cases/azaq-content";

export const metadata: Metadata = {
  title: "AZAQ - Relia · Case Study · M. Awais",
  description: "Relia, an FMCG arm of a major Saudi group, moved off D365 and paper onto a web platform that turns Customer Onboarding and Trade Spending into tracked, digital approvals.",
};

export default function Page() {
  return <AzaqContent />;
}
