import type { Metadata } from "next";
import ContactContent from "@/components/contact/contact-content";

export const metadata: Metadata = {
  title: "Contact — M. Awais, UX/UI & Product Designer",
  description:
    "Start a project with M. Awais. Tell me what you're building, or reach out directly by email or phone.",
};

export default function ContactPage() {
  return <ContactContent />;
}
