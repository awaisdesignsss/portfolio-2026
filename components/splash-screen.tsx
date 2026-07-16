"use client";

import React from "react";

/**
 * Full-screen intro splash.
 *  - shows only on the first visit of a browser session (sessionStorage)
 *  - a full-width bar at screen centre fills 0→100% with a live counter
 *  - at 100% the bar flares and the black panel tears into two halves,
 *    revealing the hero behind it
 *  - locks scroll while up; skipped entirely under reduced motion / repeat visit
 *
 * When the splash begins its tear (or immediately when it is skipped) it adds
 * `.hero-reveal` to <html>, which drives the hero's staggered entrance in CSS.
 */
export default function SplashScreen() {
  // null = undetermined (SSR / pre-effect); nothing renders so there is no
  // hydration mismatch. The effect decides the real phase on the client.
  const [phase, setPhase] = React.useState<"init" | "load" | "tear" | "gone">("init");
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const html = document.documentElement;
    const reveal = () => html.classList.add("hero-reveal");

    let seen = false;
    try { seen = !!sessionStorage.getItem("awais-splash"); } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Repeat visit or reduced motion: no splash, but still let the hero enter.
    if (seen || reduce) {
      setPhase("gone");
      reveal();
      return;
    }

    setPhase("load");
    html.style.overflow = "hidden";

    const DURATION = 1900; // time to fill the bar
    const start = performance.now();
    let loaded = document.readyState === "complete";
    const onLoad = () => { loaded = true; };
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    let raf = 0;
    let doneTimer: ReturnType<typeof setTimeout>;
    let torn = false;

    const finish = () => {
      setPhase("gone");
      html.style.overflow = "";
    };
    const startTear = () => {
      if (torn) return;
      torn = true;
      try { sessionStorage.setItem("awais-splash", "1"); } catch {}
      setProgress(100);
      setPhase("tear");
      reveal(); // hero rises in as the halves part
      doneTimer = setTimeout(finish, 900);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      // Ease toward 99% over DURATION, then hold until the page has loaded.
      let p = Math.min(99, Math.round((elapsed / DURATION) * 100));
      if (loaded && elapsed >= DURATION) p = 100;
      setProgress(p);
      if (p >= 100) { startTear(); return; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Safety net: never trap the page behind the splash.
    const failSafe = setTimeout(startTear, DURATION + 4000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(doneTimer);
      clearTimeout(failSafe);
      window.removeEventListener("load", onLoad);
      html.style.overflow = "";
    };
  }, []);

  if (phase === "init" || phase === "gone") return null;

  return (
    <div className={`intro${phase === "tear" ? " intro--tear" : ""}`} aria-hidden="true">
      <div className="intro__half intro__half--top" />
      <div className="intro__half intro__half--bottom" />
      <div className="intro__center">
        <span className="intro__bar">
          <span className="intro__bar-fill" style={{ transform: `scaleX(${progress / 100})` }} />
        </span>
        <span className="intro__count">
          {progress}
          <span className="intro__pct">%</span>
        </span>
      </div>
    </div>
  );
}
