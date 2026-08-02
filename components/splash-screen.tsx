"use client";

import React from "react";

/**
 * Intro splash (home only). Plays when `.splashing` is on <html>, which the
 * inline script in app/layout adds before first paint for a first visit on
 * the home route (skipped for reduced motion / repeat visits / other routes).
 *
 * Choreography:
 *   1. A slim 8px loading bar at nav width sits empty (white outline) on a
 *      black field, centred in the viewport.
 *   2. It fills white, holding at the centre — the loading beat.
 *   3. Once full it travels up to the nav's position.
 *   4. On arrival it grows to the nav's height, opening out of the bar into
 *      the nav's shape.
 *   5. Hand-off: the real nav (logo / menu / button) fades in as the bar
 *      fades out.
 *   6. The black field dissolves away, revealing the photo, and the hero copy
 *      slides in from either side (driven by `.hero-reveal` in styles.css).
 */
const SETUP = 80;
const FILL = 950; // fills in place at the centre
const RISE = 600; // then travels up to the nav
const GROW = 520; // bar opens out into the nav's height
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

    // Measure the real nav: the bar matches its width up front and grows
    // into its height on arrival.
    const nav = document.querySelector<HTMLElement>(".nav");
    const r = nav?.getBoundingClientRect();
    if (r && r.width > 0) pill.style.width = `${r.width}px`;
    const navH = r && r.height > 0 ? r.height : 60;
    const navCx = r ? r.left + r.width / 2 : window.innerWidth / 2;
    const navCy = r ? r.top + r.height / 2 : 40;
    const dx = navCx - window.innerWidth / 2;
    // Aim the bar's centre at the nav's centre. The -50% in the transform is
    // relative to the element's own height, so this stays correct as the bar
    // grows — it opens about the same point it travelled to.
    const dy = navCy - window.innerHeight / 2;
    void pill.offsetWidth; // commit the start state before transitions

    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    // 2. fill the bar where it stands, at the centre of the screen
    at(SETUP, () => pill.classList.add("is-filled"));
    // 3. once full, send it up to the nav
    at(SETUP + FILL, () => {
      pill.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    });
    // 4. open the bar out into the nav's height
    at(SETUP + FILL + RISE, () => {
      pill.style.height = `${navH}px`;
    });
    // 5. hand off: fade the real nav in, fade the bar out
    at(SETUP + FILL + RISE + GROW, () => {
      html.classList.add("nav-in");
      pill.classList.add("is-gone");
    });
    // 6. dissolve the field, slide the hero copy in
    at(SETUP + FILL + RISE + GROW + HANDOFF_GAP, () => {
      html.classList.add("hero-reveal");
      intro.classList.add("is-clearing");
    });
    // done — release the page and remember for this session
    at(SETUP + FILL + RISE + GROW + HANDOFF_GAP + REVEAL_WINDOW, () => {
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
