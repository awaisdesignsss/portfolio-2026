import type { Metadata } from "next";
import PaywiseDashboardContent from "@/components/work/cases/paywise-dashboard-content";

export const metadata: Metadata = {
  title: "Paywise Dashboard — Case Study — M. Awais",
  description: "A payments dashboard that turned a wall of transactions into a workspace finance teams could actually run their day from.",
};

export default function Page() {
  return <PaywiseDashboardContent />;
}
