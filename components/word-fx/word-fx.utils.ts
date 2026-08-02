import type { CSSProperties } from "react";

/**
 * Deterministic per-word rotation / lift / scale — the same arithmetic the
 * old `lib/wordfx` DOM splitter used, so every word keeps answering the
 * cursor with its familiar move. The motion itself stays in CSS
 * (`.wordfx:hover`, gated behind prefers-reduced-motion).
 */
export function getWordFxStyle(index: number): CSSProperties {
  const rotation = (((index * 137) % 61) - 30) / 10;
  const lift = 0.06 + ((index * 89) % 5) / 100;
  const scale = 1.03 + ((index * 53) % 5) / 100;
  return {
    "--wr": `${rotation.toFixed(1)}deg`,
    "--wl": `-${lift.toFixed(2)}em`,
    "--ws": scale.toFixed(2),
  } as CSSProperties;
}
