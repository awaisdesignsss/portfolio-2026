import type { Metadata } from "next";
import AiNativeSchedulerContent from "@/components/work/cases/ai-native-scheduler-content";

export const metadata: Metadata = {
  title: "Worky - AI Native Scheduler · Case Study · M. Awais",
  description: "An agentic scheduler for WorkEasy that builds a manager's shifts from their own rules, then hands back a draft they can question, edit, and approve. A vision piece designed to make AI scheduling something managers actually trust.",
};

export default function Page() {
  return <AiNativeSchedulerContent />;
}
