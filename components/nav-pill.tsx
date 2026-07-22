"use client";

import React from "react";
import { usePathname } from "next/navigation";

/**
 * Sliding nav indicator. A single pill (`.nav__pill`, rendered inside each
 * `.nav__menu`) glides to whichever link is hovered and rests under the
 * current-page link when idle. The link the pill sits under is marked
 * `.is-lit` so its label flips to read on the amber fill.
 *
 * Driven globally and re-wired on route change (the layout — and this
 * effect — persist, but each page mounts its own nav).
 */
export default function NavPill() {
  const pathname = usePathname();

  React.useEffect(() => {
    // Scope to the real nav — the cursor loupe may clone a `.nav__menu` into
    // its stage, and that clone can precede the real one in document order.
    const menu = document.querySelector<HTMLElement>(".nav .nav__menu");
    const pill = menu?.querySelector<HTMLElement>(".nav__pill");
    if (!menu || !pill) return;

    const PAD_X = 14;
    const links = () => Array.from(menu.querySelectorAll<HTMLElement>(".nav__link"));
    const activeLink = () =>
      links().find((l) => l.getAttribute("aria-current") === "page") ?? null;

    let lit: HTMLElement | null = null;
    const light = (link: HTMLElement | null) => {
      if (lit === link) return;
      lit?.classList.remove("is-lit");
      link?.classList.add("is-lit");
      lit = link;
    };

    const place = (link: HTMLElement | null, animate: boolean) => {
      if (!link) {
        pill.style.opacity = "0";
        light(null);
        return;
      }
      if (!animate) pill.style.transition = "none";
      pill.style.opacity = "1";
      pill.style.width = `${link.offsetWidth + PAD_X * 2}px`;
      pill.style.height = `${link.offsetHeight}px`;
      pill.style.transform = `translate(${link.offsetLeft - PAD_X}px, ${link.offsetTop}px)`;
      light(link);
      if (!animate) {
        void pill.offsetWidth; // flush, then restore the transition
        pill.style.transition = "";
      }
    };

    const onOver = (e: Event) => {
      const link = (e.target as Element)?.closest?.(".nav__link") as HTMLElement | null;
      if (link && menu.contains(link)) place(link, true);
    };
    const onLeave = () => place(activeLink(), true);
    const onResize = () => place(lit ?? activeLink(), false);

    menu.addEventListener("pointerover", onOver);
    menu.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);

    // Initial rest position — once now, and again after fonts settle so the
    // measured widths are final.
    requestAnimationFrame(() => place(activeLink(), false));
    document.fonts?.ready.then(() => place(lit ?? activeLink(), false)).catch(() => {});

    return () => {
      menu.removeEventListener("pointerover", onOver);
      menu.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return null;
}
