import type { Metadata } from "next";
import WorkeasyContent from "@/components/work/cases/workeasy-content";

export const metadata: Metadata = {
  title: "WorkEasy — Case Study — M. Awais",
  description: "A dated workforce app people avoided, redesigned into a mobile experience where employees and managers can actually finish the job on their phone.",
};

export default function Page() {
  return <WorkeasyContent />;
}
