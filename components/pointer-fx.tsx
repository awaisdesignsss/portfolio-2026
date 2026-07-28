"use client";

import React from "react";

/** Buttons and the header menu links magnify. For a nav link the whole
 *  `.nav__menu` is cloned so the sliding pill shows inside the loupe too. */
const ZOOM_TARGET = 'button, [role="button"], .nav__cta, .nav__wa, .nav__link, [class*="btn"]';

const LENS_R = 48; // lens radius (px) — matches the hover ring in CSS
const ZOOM = 1.2; // magnification factor (20% larger)
const LIGHT_LUMA = 150; // backdrop luminance above which we go dark-on-light

/**
 * Global pointer-driven motion, mounted once at the root:
 *
 *  1. Custom cursor — a dot at the pointer plus a spring-lagging ring.
 *     Colour adapts to the backdrop luminance sampled under the pointer
 *     (light on dark, dark on light).
 *  2. Zoom-glass lens — over text / links / buttons the ring becomes a
 *     circular magnifier: a live clone of the hovered element is scaled
 *     about the pointer and clipped to the disc, so the content beneath
 *     appears magnified like a glass loupe.
 *  3. Mouse parallax — writes smoothed `--mx` / `--my` to <html> so CSS
 *     layers drift at different speeds (see styles.css MOUSE PARALLAX).
 *
 * Gated to fine-pointer devices, disabled under reduced motion.
 */
export default function PointerFX() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const dotRef = React.useRef<HTMLDivElement>(null);
  const ringRef = React.useRef<HTMLDivElement>(null);
  const lensRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return; // touch / reduced motion: native cursor, no effects

    const html = document.documentElement;
    const el = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const lens = lensRef.current;
    const stage = stageRef.current;
    if (!el || !dot || !ring || !lens || !stage) return;

    html.classList.add("has-custom-cursor");

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let rx = px; // ring spring position
    let ry = py;
    let cx = 0; // smoothed parallax, published to CSS
    let cy = 0;
    let active = false;
    let hoverEl: Element | null = null; // the matched control (drives is-hover)
    let cloneSrc: Element | null = null; // element actually cloned/measured
    let navMenu: HTMLElement | null = null; // set when cloning a nav menu
    let clone: HTMLElement | null = null;
    let sampleCountdown = 0;
    let luma = 0; // last sampled backdrop luminance
    let isLight = false;

    // ── Solid backdrop behind a node ───────────────────────────────
    // Walk up to the first mostly-opaque background colour and return it
    // as an opaque rgb string plus its perceptual luminance.
    const solidBgFrom = (node: Element | null): { color: string; luma: number } | null => {
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        const m = bg.match(/rgba?\(([^)]+)\)/);
        if (m) {
          const p = m[1].split(",").map((n) => parseFloat(n));
          const a = p[3] === undefined ? 1 : p[3];
          if (a >= 0.5) {
            return {
              color: `rgb(${p[0]}, ${p[1]}, ${p[2]})`,
              luma: 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2],
            };
          }
        }
        node = node.parentElement;
      }
      return null;
    };

    // ── Choose / clone the element to magnify ──────────────────────
    const pickTarget = (x: number, y: number): Element | null => {
      const under = document.elementFromPoint(x, y) as Element | null;
      return under?.closest(ZOOM_TARGET) ?? null;
    };

    const setTarget = (next: Element | null) => {
      if (next === hoverEl) return;
      hoverEl = next;
      el.classList.toggle("is-hover", !!next);
      stage.replaceChildren();
      clone = null;
      cloneSrc = null;
      navMenu = null;
      if (!next) return;
      // Nav links magnify together with their sliding pill, so clone the whole
      // menu; everything else clones just the control.
      navMenu = next.matches(".nav__link")
        ? (next.closest(".nav__menu") as HTMLElement | null)
        : null;
      const src = navMenu ?? next;
      cloneSrc = src;
      const c = src.cloneNode(true) as HTMLElement;
      // Flatten the element's computed styles onto the clone so it renders
      // identically even when its look depends on ancestor context — e.g.
      // backgrounds driven by inherited CSS variables (var(--btn-bg)) that
      // wouldn't resolve on a detached node.
      const cs = getComputedStyle(src);
      let cssText = "";
      for (let i = 0; i < cs.length; i++) {
        const prop = cs[i];
        cssText += `${prop}:${cs.getPropertyValue(prop)};`;
      }
      c.style.cssText = cssText;
      c.style.position = "absolute";
      c.style.margin = "0";
      c.style.transform = "none";
      c.style.transition = "none";
      c.style.animation = "none";
      c.style.maxWidth = "none";
      c.style.pointerEvents = "none";
      c.removeAttribute("id");
      stage.appendChild(c);
      clone = c;
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!active) {
        active = true;
        el.classList.add("is-active");
      }
      setTarget(pickTarget(px, py));
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      // Parallax — ease toward the pointer, publish for CSS.
      const w = window.innerWidth;
      const h = window.innerHeight;
      cx += (((px / w) * 2 - 1) - cx) * 0.08;
      cy += (((py / h) * 2 - 1) - cy) * 0.08;
      html.style.setProperty("--mx", cx.toFixed(4));
      html.style.setProperty("--my", cy.toFixed(4));

      // Sample the backdrop for both the adaptive colour and the lens fill.
      // While hovering a control, use the colour *behind* it (its parent) so
      // the loupe disc matches the surrounding page, not the control itself.
      let backdrop: { color: string; luma: number } | null = null;
      if (cloneSrc) {
        backdrop = solidBgFrom(cloneSrc.parentElement ?? cloneSrc);
        if (backdrop) luma = backdrop.luma;
      } else if (--sampleCountdown <= 0) {
        sampleCountdown = 4;
        const found = solidBgFrom(document.elementFromPoint(px, py));
        if (found) luma = found.luma;
      }
      const nextLight = luma > LIGHT_LUMA;
      if (nextLight !== isLight) {
        isLight = nextLight;
        el.classList.toggle("is-light", isLight);
      }

      // Dot tracks the pointer exactly; ring spring-lags (snappier while
      // hovering so it frames the lens tightly).
      dot.style.transform = `translate3d(${px}px, ${py}px, 0)`;
      const follow = hoverEl ? 0.4 : 0.2;
      rx += (px - rx) * follow;
      ry += (py - ry) * follow;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

      // Lens — an opaque disc at the pointer showing the control magnified
      // about the pointer itself (true loupe). Scaling about an interior
      // point keeps the magnified control fully covering the real one, so
      // the backdrop fill only ever shows past the control's edges — never
      // as a dark patch over it.
      if (cloneSrc && clone) {
        const r = cloneSrc.getBoundingClientRect();
        clone.style.left = `${r.left}px`;
        clone.style.top = `${r.top}px`;
        clone.style.width = `${r.width}px`;
        clone.style.height = `${r.height}px`;
        stage.style.transform = `translate(${px * (1 - ZOOM)}px, ${py * (1 - ZOOM)}px) scale(${ZOOM})`;
        lens.style.clipPath = `circle(${LENS_R}px at ${px}px ${py}px)`;
        if (backdrop) lens.style.background = backdrop.color;

        // For a nav menu, keep the cloned pill + lit-link state mirrored to
        // the live one so the sliding pill animates inside the loupe too.
        if (navMenu) {
          const realPill = navMenu.querySelector<HTMLElement>(".nav__pill");
          const clonePill = clone.querySelector<HTMLElement>(".nav__pill");
          if (realPill && clonePill) {
            const ps = getComputedStyle(realPill);
            clonePill.style.transition = "none";
            clonePill.style.transform = ps.transform;
            clonePill.style.width = ps.width;
            clonePill.style.height = ps.height;
            clonePill.style.opacity = ps.opacity;
          }
          const realLinks = navMenu.querySelectorAll(".nav__link");
          const cloneLinks = clone.querySelectorAll(".nav__link");
          realLinks.forEach((rl, i) => {
            const cl = cloneLinks[i];
            if (cl) cl.className = rl.className;
          });
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      html.classList.remove("has-custom-cursor");
      html.style.removeProperty("--mx");
      html.style.removeProperty("--my");
    };
  }, []);

  return (
    <div ref={rootRef} className="cursor" aria-hidden="true">
      <div ref={lensRef} className="cursor__lens">
        <div ref={stageRef} className="cursor__stage" />
      </div>
      <div ref={ringRef} className="cursor__ring" />
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}
