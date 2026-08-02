import type { CSSProperties, ElementType, ReactNode } from "react";

export type TRevealVariant = "rise" | "rise-left" | "rise-right" | "fade";

export interface IRevealProps {
  children?: ReactNode;
  /** Rendered tag — the element itself becomes the motion element, so CSS selectors keep matching. */
  as?: ElementType;
  variant?: TRevealVariant;
  /** Stagger delay in seconds (the old per-group `--rd`). */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  /** Pass-through for tag-specific attributes (href, id, aria-*, …). */
  [key: string]: unknown;
}
