"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Mobile nav open/close state — replaces the old document-level
 * `.nav__toggle` click listener that flipped `is-open` via classList.
 *
 * Open also flags `<html>`, which holds the page still behind the
 * full-height sheet: styles.css kills native overflow and SmoothScroll
 * stops Lenis off the same class.
 */
export function useSiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("nav-open", isOpen);
    return () => html.classList.remove("nav-open");
  }, [isOpen]);

  return {
    isOpen,
    toggle,
    toggleLabel: isOpen ? "Close menu" : "Menu",
    navClassName: cn("nav", isOpen && "is-open"),
  };
}
