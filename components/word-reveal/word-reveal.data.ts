/**
 * How many words to either side of the playhead are still lit. Larger reads
 * as a broad glow sweeping the sentence, smaller as a tight single-word
 * spotlight; ~1.4 lights the word plus a hint of its neighbours.
 */
export const WORD_SPREAD = 1.4;

/**
 * Words of runway before the first word and after the last, so the wave
 * enters and leaves the sentence instead of popping on mid-stride.
 */
export const WORD_LEAD = 1.6;
