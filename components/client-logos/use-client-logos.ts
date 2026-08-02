import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { CLIENTS } from "./client-logos.data";
import type { IClient } from "./client-logos.interface";

/**
 * Cursor-following chip logic for the logo wall.
 *
 * The old rAF loop lerped 0.22 of the remaining distance per frame; a
 * near-critically damped spring at this stiffness settles on the same
 * timescale without overshooting.
 */
const CHIP_SPRING = { stiffness: 300, damping: 34, mass: 1 };

export default function useClientLogos() {
  const gridRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  // `content` holds the last shown detail (kept during fade-out); `visible`
  // toggles the chip on/off.
  const [content, setContent] = useState<IClient | null>(null);
  const [visible, setVisible] = useState(false);

  const chipX = useMotionValue(0);
  const chipY = useMotionValue(0);
  const springX = useSpring(chipX, CHIP_SPRING);
  const springY = useSpring(chipY, CHIP_SPRING);

  useEffect(() => {
    const grid = gridRef.current;
    const chip = chipRef.current;
    if (!grid || !chip) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let shown = false;
    let current: string | null = null;

    const setTarget = (e: PointerEvent) => {
      // Offset from the cursor (clear of the custom cursor ring); flip near
      // the viewport edges so the chip never clips.
      const off = 22;
      const w = chip.offsetWidth || 220;
      const h = chip.offsetHeight || 90;
      let x = e.clientX + off;
      let y = e.clientY + off;
      if (x + w > window.innerWidth - 10) x = e.clientX - off - w;
      if (y + h > window.innerHeight - 10) y = e.clientY - off - h;
      if (shown) {
        chipX.set(x);
        chipY.set(y);
      } else {
        // Snap to the pointer the first frame it appears, then ease-follow —
        // jump() propagates straight through the attached springs.
        chipX.jump(x);
        chipY.jump(y);
        shown = true;
      }
    };

    const onMove = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.(".logos__card") as HTMLElement | null;
      const name = card?.dataset.name ?? null;
      if (name !== current) {
        current = name;
        if (name) {
          const c = CLIENTS.find((x) => x.name === name);
          if (c) setContent(c);
          setVisible(true);
          shown = false; // every fresh hover snaps before it eases, like the old loop
        } else {
          setVisible(false);
        }
      }
      // Keep tracking even between cards so the chip trails during fade-out.
      setTarget(e);
    };

    const onLeave = () => {
      current = null;
      shown = false;
      setVisible(false);
    };

    grid.addEventListener("pointermove", onMove);
    grid.addEventListener("pointerleave", onLeave);

    return () => {
      grid.removeEventListener("pointermove", onMove);
      grid.removeEventListener("pointerleave", onLeave);
    };
  }, [chipX, chipY]);

  return { gridRef, chipRef, content, visible, springX, springY };
}
