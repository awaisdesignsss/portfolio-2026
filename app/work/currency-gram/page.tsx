import type { Metadata } from "next";
import CurrencyGramContent from "@/components/work/cases/currency-gram-content";

export const metadata: Metadata = {
  title: "Currency Gram — Case Study — M. Awais",
  description: "A money transfer app that worked technically but failed emotionally, redesigned across mobile and web so sending money feels less like math and more like a conversation.",
};

export default function Page() {
  return <CurrencyGramContent />;
}
