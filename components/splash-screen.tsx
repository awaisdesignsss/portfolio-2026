"use client";

import React from "react";

/**
 * Intro splash (home only). Plays when `.splashing` is on <html>, which the
 * inline script in app/layout adds before first paint for a first visit on
 * the home route (skipped for reduced motion / repeat visits / other routes).
 *
 * Choreography:
 *   1. A nav-sized pill sits empty (white outline) on a black field, centred.
 *   2. It fills white (the loading beat).
 *   3. The filled pill docks up to the real nav's position; the real nav
 *      (logo / menu / button) fades in as the pill fades out.
 *   4. The black field dissolves away, revealing the photo.
 *   5. Left-side copy slides in from the left, right-side copy from the right
 *      (driven by `.hero-reveal` in styles.css).
 */
const SETUP = 80;
const FILL = 950;
const DOCK = 600;
const HANDOFF_GAP = 260;
const REVEAL_WINDOW = 1650;

export default function SplashScreen() {
  const introRef = React.useRef<HTMLDivElement>(null);
  const pillRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const html = document.documentElement;
    // Only run if the pre-paint script flagged this load for the splash.
    if (!html.classList.contains("splashing")) return;

    const intro = introRef.current;
    const pill = pillRef.current;
    if (!intro || !pill) {
      html.classList.remove("splashing"); // never trap the page
      return;
    }

    // Measure the real nav so the pill docks onto it exactly.
    const nav = document.querySelector<HTMLElement>(".nav");
    const r = nav?.getBoundingClientRect();
    if (r && r.width > 0) {
      pill.style.width = `${r.width}px`;
      pill.style.height = `${r.height}px`;
    }
    const navCx = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const navCy = r ? r.top + r.height / 2 : 40;
    const dx = navCx - window.innerWidth / 2;
    const dy = navCy - window.innerHeight / 2;
    void pill.offsetWidth; // commit the start state before transitions

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    // 2. fill the pill
    at(SETUP, () => pill.classList.add("is-filled"));
    // 3. dock to the nav position
    at(SETUP + FILL, () => {
      pill.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    });
    // hand off: fade the real nav in, fade the pill out
    at(SETUP + FILL + DOCK, () => {
      html.classList.add("nav-in");
      pill.classList.add("is-gone");
    });
    // 4 + 5. dissolve the field, slide the hero copy in
    at(SETUP + FILL + DOCK + HANDOFF_GAP, () => {
      html.classList.add("hero-reveal");
      intro.classList.add("is-clearing");
    });
    // done — release the page and remember for this session
    at(SETUP + FILL + DOCK + HANDOFF_GAP + REVEAL_WINDOW, () => {
      try {
        sessionStorage.setItem("awais-splash", "1");
      } catch {}
      html.classList.remove("splashing", "nav-in");
    });

    return () => {
      timers.forEach(clearTimeout);
      html.classList.remove("splashing", "nav-in");
    };
  }, []);

  return (
    <div ref={introRef} className="intro" aria-hidden="true">
      <div className="intro__field" />
      <div ref={pillRef} className="intro__pill">
        <div className="intro__fill" />
      </div>
    </div>
  );
}
