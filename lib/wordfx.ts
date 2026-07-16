/**
 * Per-word hover choreography.
 *
 * Splits the text of any `[data-wordfx]` element into `<span class="wordfx">`
 * words, each carrying its own rotation / lift / scale custom properties so it
 * answers the cursor with a slightly different move. Inline markup (a `<br>`
 * inside a heading, for example) is preserved rather than flattened.
 *
 * The motion itself lives in CSS (`.wordfx:hover`), which is gated behind
 * `prefers-reduced-motion`; wrapping words in spans is inert on its own, so
 * this can run unconditionally. Idempotent per element.
 */
const SELECTOR = "[data-wordfx]";

function styleWord(s: HTMLElement, i: number) {
  const rot = (((i * 137) % 61) - 30) / 10;
  const lift = 0.06 + ((i * 89) % 5) / 100;
  const scale = 1.03 + ((i * 53) % 5) / 100;
  s.style.setProperty("--wr", rot.toFixed(1) + "deg");
  s.style.setProperty("--wl", "-" + lift.toFixed(2) + "em");
  s.style.setProperty("--ws", scale.toFixed(2));
}

function wrap(el: HTMLElement) {
  if (el.dataset.wordfxDone) return;
  const nodes = Array.from(el.childNodes);
  el.textContent = "";
  let i = 0;
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      // Split on whitespace but keep the whitespace tokens so spacing and
      // line-relative gaps survive the rewrap.
      (node.textContent || "").split(/(\s+)/).forEach((tok) => {
        if (tok === "") return;
        if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(tok)); return; }
        const s = document.createElement("span");
        s.className = "wordfx";
        s.textContent = tok;
        styleWord(s, i++);
        el.appendChild(s);
      });
    } else {
      // Preserve <br> and any other inline nodes verbatim.
      el.appendChild(node.cloneNode(true));
    }
  });
  el.dataset.wordfxDone = "1";
}

/** Wrap every `[data-wordfx]` element under `root` (defaults to the document). */
export function applyWordfx(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>(SELECTOR).forEach(wrap);
}
