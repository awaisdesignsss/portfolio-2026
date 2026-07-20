"use client";

import React from "react";

/**
 * Global pointer-driven motion, mounted once at the root:
 *
 *  1. Cursor trail — a soft amber glow that follows the cursor and fades,
 *     drawn on a full-screen canvas with additive blending.
 *  2. Mouse parallax — writes smoothed, centre-relative pointer coordinates
 *     to `--mx` / `--my` on <html> (range about -1..1). CSS layers translate
 *     by different multiples of these so background and foreground drift at
 *     different speeds.
 *
 * Both are gated to fine-pointer devices and disabled under reduced motion.
 * A single pointermove listener + one rAF loop feed both effects.
 */
export default function PointerFX() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return; // touch / reduced motion: no trail, no parallax

    const root = document.documentElement;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Parallax: target (tx/ty) chased by current (cx/cy) each frame.
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    // Trail particles.
    type P = { x: number; y: number; vx: number; vy: number; life: number; r: number };
    const parts: P[] = [];
    let prevX = 0;
    let prevY = 0;
    let hasPrev = false;

    const onMove = (e: PointerEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      // Parallax target, normalised to roughly [-1, 1] around the centre.
      tx = (x / w) * 2 - 1;
      ty = (y / h) * 2 - 1;

      // Emit trail particles along the travel segment so fast moves stay smooth.
      if (hasPrev) {
        const dx = x - prevX;
        const dy = y - prevY;
        const dist = Math.hypot(dx, dy);
        const steps = Math.max(1, Math.min(6, Math.floor(dist / 7)));
        for (let i = 0; i < steps; i++) {
          const t = i / steps;
          parts.push({
            x: prevX + dx * t,
            y: prevY + dy * t,
            vx: dx * 0.02,
            vy: dy * 0.02,
            life: 1,
            r: 9 + Math.min(dist, 42) * 0.28,
          });
        }
        if (parts.length > 140) parts.splice(0, parts.length - 140);
      }
      prevX = x;
      prevY = y;
      hasPrev = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      // Ease parallax toward the pointer and publish for CSS.
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      root.style.setProperty("--mx", cx.toFixed(4));
      root.style.setProperty("--my", cy.toFixed(4));

      // Redraw the trail.
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 0.045;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        p.x += p.vx;
        p.y += p.vy;
        const a = p.life;
        const r = p.r * (0.45 + p.life * 0.55);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0, `rgba(255, 216, 173, ${0.32 * a})`);
        g.addColorStop(0.4, `rgba(196, 114, 42, ${0.22 * a})`);
        g.addColorStop(1, "rgba(196, 114, 42, 0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      root.style.removeProperty("--mx");
      root.style.removeProperty("--my");
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-fx" aria-hidden="true" />;
}
