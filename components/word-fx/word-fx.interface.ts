import type { ElementType } from "react";

export interface IWordFxProps {
  /** Plain text. Pass an array to insert a `<br />` between lines. */
  text: string | string[];
  /** Rendered tag (defaults to `p`). */
  as?: ElementType;
  className?: string;
}
