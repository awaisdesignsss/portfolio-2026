import type { Metadata } from "next";
import DatapulseContent from "@/components/work/cases/datapulse-content";

export const metadata: Metadata = {
  title: "DataPulse — Case Study — M. Awais",
  description: "A product analytics tool that let non-analysts ask real questions of their data without learning a query language first.",
};

export default function Page() {
  return <DatapulseContent />;
}
