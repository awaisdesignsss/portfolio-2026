import type { Metadata } from "next";
import AzoriaContent from "@/components/work/cases/azoria-content";

export const metadata: Metadata = {
  title: "Azoria — Case Study — M. Awais",
  description: "A luxury resort in Bali, freed from Airbnb and a patchwork of third-party tools, with one app for staying, playing padel, training, and working, all run from a single admin.",
};

export default function Page() {
  return <AzoriaContent />;
}
