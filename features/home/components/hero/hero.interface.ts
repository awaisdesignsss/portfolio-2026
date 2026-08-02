import type { PointerEvent as ReactPointerEvent } from "react";
import type { MotionValue } from "framer-motion";

/** What `useMagnetic` hands a motion element: sprung offsets + pointer handlers. */
export interface IMagnetic {
  x: MotionValue<number>;
  y: MotionValue<number>;
  onPointerMove: (e: ReactPointerEvent<HTMLElement>) => void;
  onPointerLeave: () => void;
}
