"use client";

import React from "react";
import BlockLoader from "@/components/ui/block-loader";

/**
 * Full-screen intro splash built on BlockLoader. Preserves the UX of the
 * original static splash:
 *  - shows only on the first visit of a browser session (sessionStorage)
 *  - locks page scroll while visible
 *  - respects prefers-reduced-motion (short hold, no long animation)
 *  - holds for a minimum duration, then lifts like a curtain
 */
export default function SplashScreen() {
  // null = undetermined (SSR / pre-effect) so nothing renders and there is no
  // hydration mismatch; the effect decides true/false on the client.
  const [visible, setVisible] = React.useState<boolean | null>(null);
  const [hiding, setHiding] = React.useState(false);

  React.useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem("awais-splash");
    } catch {}
    if (seen) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const html = document.documentElement;
    html.style.overflow = "hidden";

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const MIN = reduce ? 300 : 1600;
    const start = performance.now();

    let timer: ReturnType<typeof setTimeout>;
    const dismiss = () => {
      const wait = Math.max(0, MIN - (performance.now() - start));
      timer = setTimeout(() => {
        // Mark "seen" only on real dismissal. Writing it earlier breaks under
        // React StrictMode's double-invoked effects (the second run would
        // early-return and never reschedule this timer).
        try {
          sessionStorage.setItem("awais-splash", "1");
        } catch {}
        setHiding(true);
        html.style.overflow = "";
      }, wait);
    };

    if (document.readyState === "complete") dismiss();
    else window.addEventListener("load", dismiss, { once: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", dismiss);
      html.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      onTransitionEnd={() => hiding && setVisible(false)}
      className={cnCurtain(hiding)}
    >
      <BlockLoader
        blockColor="bg-brand"
        borderColor="border-brand"
        size={80}
        gap={6}
        speed={1.2}
      />
    </div>
  );
}

function cnCurtain(hiding: boolean) {
  return [
    "fixed inset-0 z-[9999] flex items-center justify-center",
    "bg-brand-black",
    "transition-transform duration-700 ease-[cubic-bezier(0.7,0,0.3,1)]",
    hiding ? "-translate-y-full" : "translate-y-0",
  ].join(" ");
}
