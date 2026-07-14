import type { Metadata } from "next";
import MedflowContent from "@/components/work/cases/medflow-content";

export const metadata: Metadata = {
  title: "MedFlow — Case Study — M. Awais",
  description: "A patient-flow tool that helped clinic staff see the whole floor at a glance and move people through care without the clipboard.",
};

export default function Page() {
  return <MedflowContent />;
}
