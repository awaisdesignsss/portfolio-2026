import type { Metadata } from "next";
import FoodhubContent from "@/components/work/cases/foodhub-content";

export const metadata: Metadata = {
  title: "FoodHub — Case Study — M. Awais",
  description: "An ordering app for local restaurants, designed so a hungry person can go from open to checkout in under a minute.",
};

export default function Page() {
  return <FoodhubContent />;
}
