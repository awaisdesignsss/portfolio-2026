import type { Metadata } from "next";
import LuxeMarketplaceContent from "@/components/work/cases/luxe-marketplace-content";

export const metadata: Metadata = {
  title: "Luxe Marketplace — Case Study — M. Awais",
  description: "A curated marketplace for independent makers, designed so the product photography carries the experience and checkout never breaks the spell.",
};

export default function Page() {
  return <LuxeMarketplaceContent />;
}
