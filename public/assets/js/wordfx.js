/* ─────────────────────────────────────────────────────────────
   wordfx — per-word hover choreography (reusable)

   Usage: add the `data-wordfx` attribute to any text element:
     <p class="bio__statements" data-wordfx>Some sentence…</p>

   Each word is wrapped in a <span class="wordfx"> carrying its own
   --wr / --wl / --ws (rotation / lift / scale) custom properties, so
   every word answers the cursor with a slightly different move. The
   hover styling itself lives in styles.css (.wordfx). Pairs with a
   `prefers-reduced-motion` fallback there.
   ───────────────────────────────────────────────────────────── */
(function () {
  function wrap(el) {
    if (el.dataset.wordfxDone) return;           // idempotent
    var words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach(function (w, i) {
      var s = document.createElement('span');
      s.className = 'wordfx';
      s.textContent = w;
      var rot = (((i * 137) % 61) - 30) / 10;    // -3.0 … +3.0 deg
      var lift = 0.06 + ((i * 89) % 5) / 100;    // 0.06 … 0.10 em
      var scale = 1.03 + ((i * 53) % 5) / 100;   // 1.03 … 1.07
      s.style.setProperty('--wr', rot.toFixed(1) + 'deg');
      s.style.setProperty('--wl', '-' + lift.toFixed(2) + 'em');
      s.style.setProperty('--ws', scale.toFixed(2));
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    el.dataset.wordfxDone = '1';
  }

  function init() {
    document.querySelectorAll('[data-wordfx]').forEach(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
