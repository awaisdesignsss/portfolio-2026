"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Cinematic smooth scroll (site-wide). Lenis scrolls the real window on a
 * rAF-driven lerp, so native scroll events and IntersectionObservers keep
 * firing — every existing scroll reveal / parallax still works, just gliding
 * on a weighted momentum curve instead of snapping.
 *
 * - Disabled entirely under prefers-reduced-motion (plain native scroll).
 * - Paused while the intro splash is up (`.splashing` on <html>), resumed the
 *   moment it clears, via a class MutationObserver.
 * - In-page anchor links (#work, etc.) glide to target through Lenis.
 * Touch is left native so mobile keeps its own momentum.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.08, // lower = longer, more cinematic glide
      wheelMultiplier: 0.95,
      smoothWheel: true,
    });

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Hold scroll during the intro splash; release when it clears.
    const html = document.documentElement;
    const sync = () =>
      html.classList.contains("splashing") ? lenis.stop() : lenis.start();
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });

    // Smooth in-page anchor navigation, clearing the fixed nav.
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      const id = a?.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -104, duration: 1.5 });
    };
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
