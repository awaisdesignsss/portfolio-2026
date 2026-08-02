import { SiteFooter, SiteHeader } from "@/layout";
import ClientLogos from "@/components/client-logos";
import { Hero, Metrics, Process, Reasons, Services, Work } from "./components";

/**
 * Homepage — the sections read in scroll order. Each section owns its
 * own markup, data and motion in its folder under ./components; the
 * shared chrome (nav + footer) lives in @/layout.
 */
export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <h1 className="sr-only">M. Awais, Senior Product Designer</h1>

        <Hero />
        <ClientLogos />
        <Process />
        <Work />
        <Services />
        <Metrics />
        <Reasons />
      </main>

      <SiteFooter />
    </>
  );
}
