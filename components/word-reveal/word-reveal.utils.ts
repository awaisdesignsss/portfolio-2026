import { WORD_SPREAD } from "./word-reveal.data";
import type { IWordPose, IWordToken } from "./word-reveal.interface";

/**
 * Split a line into words and the whitespace between them. The whitespace
 * tokens are kept so spacing and line wrapping survive the rewrap — the
 * same reason the old wordfx splitter preserved them.
 */
export function toWordTokens(line: string): IWordToken[] {
  return line
    .split(/(\s+)/)
    .filter((token) => token !== "")
    .map((token) => ({ value: token, isSpace: /^\s+$/.test(token) }));
}

/**
 * The pose a word reaches at full strength — the exact values the hover
 * choreography uses (`--wr` / `--ws` / `--wl` in lib/wordfx and styles.css),
 * so a scrolled word lands in the same attitude a hovered one does.
 */
export function getWordPose(index: number): IWordPose {
  return {
    rotation: (((index * 137) % 61) - 30) / 10,
    scale: 1.03 + ((index * 53) % 5) / 100,
    lift: -(0.06 + ((index * 89) % 5) / 100),
  };
}

/**
 * How lit a word is (0→1) given where the playhead sits. Falls off over
 * WORD_SPREAD words either side and is smoothstepped, so the wave eases in
 * and out of each word instead of ramping linearly through it.
 */
export function getWordIntensity(playhead: number, index: number): number {
  const distance = Math.abs(playhead - index);
  if (distance >= WORD_SPREAD) return 0;
  const t = 1 - distance / WORD_SPREAD;
  return t * t * (3 - 2 * t);
}
