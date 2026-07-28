import type { Metadata } from "next";
import ContactContent from "@/components/contact/contact-content";

export const metadata: Metadata = {
  title: "Contact · M. Awais, Senior Product Designer",
  description:
    "Have a product to build, a redesign to revisit, or a design problem to talk through? A quick message is the fastest way to reach me.",
};

export default function ContactPage() {
  return <ContactContent />;
}
