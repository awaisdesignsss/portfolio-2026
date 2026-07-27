import type { Metadata } from "next";
import Phlex65Content from "@/components/work/cases/phlex65-content";

export const metadata: Metadata = {
  title: "Phlex65 — Case Study — M. Awais",
  description: "A dated caregiving app, first modernized, then reimagined as a multi-tenant SaaS where any agency can sign up, bring its own caregivers, and serve the people who need care.",
};

export default function Page() {
  return <Phlex65Content />;
}
