"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Mobile nav open/close state — replaces the old document-level
 * `.nav__toggle` click listener that flipped `is-open` via classList.
 */
export function useSiteHeader() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  return {
    isOpen,
    toggle,
    navClassName: cn("nav", isOpen && "is-open"),
  };
}
