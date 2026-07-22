"use client";

import React from "react";
import { applyWordfx } from "@/lib/wordfx";
import ClientLogos from "@/components/ui/client-logos";

/**
 * About page content, ported from the original static about.html.
 * Design comes from the shared styles.css (imported in app/layout.tsx).
 * Nav toggle, IntersectionObserver reveals, reasons stacking, and wordfx
 * are ported into the effect below with listener/observer cleanup.
 */
export default function AboutContent() {

  React.useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Mobile nav toggle ──
    const toggle = document.querySelector<HTMLElement>(".nav__toggle");
    const nav = document.querySelector<HTMLElement>(".nav");
    if (toggle && nav) {
      const onToggle = () => {
        nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(nav.classList.contains("is-open")));
      };
      toggle.addEventListener("click", onToggle);
      cleanups.push(() => toggle.removeEventListener("click", onToggle));
    }

    // ── Reveal on scroll ──
    if (!reduceMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px" });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    // ── Why work with me: stacking cards ──
    (() => {
      const wraps = Array.from(document.querySelectorAll<HTMLElement>(".reasons__card-wrap"));
      if (!wraps.length) return;
      let ticking = false;
      const readTops = () => wraps.map((w) => parseFloat(getComputedStyle(w).top) || 0);
      let stickyTops = readTops();
      function apply() {
        ticking = false;
        for (let i = 0; i < wraps.length; i++) {
          let behind = 0;
          for (let j = i + 1; j < wraps.length; j++) {
            if (wraps[j].getBoundingClientRect().top <= stickyTops[j] + 2) behind++;
          }
          const card = wraps[i].querySelector<HTMLElement>(".reasons__card");
          if (card) card.style.setProperty("--stacked", String(behind));
        }
      }
      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
      const onResize = () => { stickyTops = readTops(); apply(); };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("scroll", onScroll));
      cleanups.push(() => window.removeEventListener("resize", onResize));
      apply();
    })();

    // ── wordfx: per-word hover choreography (bio copy + section headings) ──
    applyWordfx();

    // ── Experience roadmap: cinematic center-focus carousel ──
    (() => {
      const root = document.querySelector<HTMLElement>("[data-roadmap]");
      if (!root) return;
      const viewport = root.querySelector<HTMLElement>(".roadmap__viewport");
      const track = root.querySelector<HTMLElement>(".roadmap__track");
      const stops = Array.from(root.querySelectorAll<HTMLElement>(".roadmap__stop"));
      if (!viewport || !track || !stops.length) return;
      const cards = stops.map((s) => s.querySelector<HTMLElement>(".roadmap__card"));
      const railFill = root.querySelector<HTMLElement>(".roadmap__rail-fill");
      const countCur = root.querySelector<HTMLElement>(".roadmap__count-cur");
      const btnPrev = root.querySelector<HTMLButtonElement>('[data-dir="prev"]');
      const btnNext = root.querySelector<HTMLButtonElement>('[data-dir="next"]');
      const n = stops.length;
      const clamp01 = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
      let active = 0;
      let target = 0;
      let programmatic = false;
      let progTimer: ReturnType<typeof setTimeout> | undefined;
      let ticking = false;

      function apply() {
        ticking = false;
        const vp = viewport!.getBoundingClientRect();
        const center = vp.left + vp.width / 2;
        const step =
          n > 1 ? Math.abs(stops[1].offsetLeft - stops[0].offsetLeft) || vp.width : vp.width;
        let best = 0;
        let bestDist = Infinity;
        for (let i = 0; i < n; i++) {
          const r = stops[i].getBoundingClientRect();
          const dist = Math.abs(r.left + r.width / 2 - center);
          if (dist < bestDist) { bestDist = dist; best = i; }
          const card = cards[i];
          if (card && !reduceMotion) {
            const e = clamp01(dist / step);
            card.style.transform = `scale(${(1 - e * 0.12).toFixed(4)})`;
            card.style.opacity = (1 - e * 0.5).toFixed(3);
            card.style.filter = e > 0.01 ? `blur(${(e * 3).toFixed(2)}px)` : "none";
          }
        }
        if (best !== active) {
          active = best;
          for (let i = 0; i < n; i++) {
            stops[i].dataset.state = i < active ? "past" : i === active ? "active" : "future";
          }
          if (countCur) countCur.textContent = String(active + 1).padStart(2, "0");
        }
        // While the user scrolls/drags manually, keep the button target in sync;
        // during a programmatic scroll, leave it so rapid clicks can queue ahead.
        if (!programmatic) target = active;
        // Progress normalized to the first→last "centered" scroll range so the
        // rail reads 0% on the first card and a full 100% on the last.
        const firstC = stops[0].offsetLeft - (vp.width - stops[0].offsetWidth) / 2;
        const lastC =
          stops[n - 1].offsetLeft - (vp.width - stops[n - 1].offsetWidth) / 2;
        const denom = lastC - firstC;
        const prog = denom > 0 ? clamp01((viewport!.scrollLeft - firstC) / denom) : 0;
        if (railFill) railFill.style.transform = `scaleX(${prog.toFixed(4)})`;
        if (btnPrev) btnPrev.disabled = active === 0;
        if (btnNext) btnNext.disabled = active === n - 1;
      }

      const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
      viewport.addEventListener("scroll", onScroll, { passive: true });
      cleanups.push(() => viewport.removeEventListener("scroll", onScroll));

      const scrollToIndex = (i: number) => {
        target = Math.max(0, Math.min(n - 1, i));
        const stop = stops[target];
        const left = stop.offsetLeft - (viewport.clientWidth - stop.offsetWidth) / 2;
        programmatic = true;
        if (progTimer) clearTimeout(progTimer);
        progTimer = setTimeout(() => { programmatic = false; }, 700);
        viewport.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
      };
      const onPrev = () => scrollToIndex(target - 1);
      const onNext = () => scrollToIndex(target + 1);
      btnPrev?.addEventListener("click", onPrev);
      btnNext?.addEventListener("click", onNext);
      cleanups.push(() => btnPrev?.removeEventListener("click", onPrev));
      cleanups.push(() => btnNext?.removeEventListener("click", onNext));
      cleanups.push(() => { if (progTimer) clearTimeout(progTimer); });

      const onKey = (e: KeyboardEvent) => {
        if (e.key === "ArrowRight") { e.preventDefault(); scrollToIndex(target + 1); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); scrollToIndex(target - 1); }
      };
      viewport.addEventListener("keydown", onKey);
      cleanups.push(() => viewport.removeEventListener("keydown", onKey));

      // Mouse drag to scroll (touch keeps native swipe + snap)
      let dragging = false;
      let startX = 0;
      let startScroll = 0;
      const onDown = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        dragging = true;
        startX = e.clientX;
        startScroll = viewport.scrollLeft;
        root.dataset.dragging = "true";
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        viewport.scrollLeft = startScroll - (e.clientX - startX);
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        delete root.dataset.dragging;
      };
      viewport.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      cleanups.push(() => viewport.removeEventListener("pointerdown", onDown));
      cleanups.push(() => window.removeEventListener("pointermove", onMove));
      cleanups.push(() => window.removeEventListener("pointerup", onUp));

      // Edge spacers = (viewport - card) / 2 so the first & last card can center.
      const measure = () => {
        const edge = Math.max(0, (viewport.clientWidth - stops[0].offsetWidth) / 2);
        track.style.setProperty("--edge", `${edge}px`);
      };
      const onResize = () => { measure(); apply(); };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));

      measure();
      requestAnimationFrame(() => {
        // center the first card without animation, then run the focus pass
        const first = stops[0];
        viewport.scrollLeft = Math.max(
          0,
          first.offsetLeft - (viewport.clientWidth - first.offsetWidth) / 2
        );
        apply();
      });
    })();

    // ── Stats: count up from zero when each number scrolls into view ──
    if (!reduceMotion) {
      const runCount = (el: HTMLElement) => {
        const textNode = Array.from(el.childNodes).find(
          (n) => n.nodeType === Node.TEXT_NODE && /\d/.test(n.textContent || "")
        );
        if (!textNode) return;
        const raw = (textNode.textContent || "").trim();
        const m = raw.match(/^(\d+)(\D*)$/);
        if (!m) return;
        const targetVal = parseInt(m[1], 10);
        const suffix = m[2];
        const dur = 1500;
        const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / dur);
          textNode.textContent = Math.round(easeOut(p) * targetVal) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else textNode.textContent = raw;
        };
        textNode.textContent = "0" + suffix;
        requestAnimationFrame(tick);
      };
      const cio = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { runCount(e.target as HTMLElement); cio.unobserve(e.target); }
          });
        },
        { rootMargin: "0px 0px -15% 0px" }
      );
      document.querySelectorAll<HTMLElement>(".about-stat__num").forEach((n) => cio.observe(n));
      cleanups.push(() => cio.disconnect());
    }

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <>
      <nav className="nav">
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><span className="brandmark" role="img" aria-label="Awais"></span></a>
          <div className="nav__menu">
            <span className="nav__pill" aria-hidden="true" />
            <a href="/" className="nav__link">Home</a>
            <a href="/work" className="nav__link">Work</a>
            <a href="/about" className="nav__link" aria-current="page">About</a>
            <a href="/contact" className="nav__link">Contact</a>
          </div>
          <a href="mailto:hello@awais.design" className="nav__cta">Email me</a>
          <button className="nav__toggle" aria-label="Menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </nav>

        <main>

          <section className="pagehead">
            <span className="pagehead__eyebrow">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
              About
            </span>
            <h1 className="pagehead__title" data-wordfx>Designer set on clarity, not decoration.</h1>
            <p className="pagehead__lead">I&rsquo;m M. Awais. For about eight years I&rsquo;ve helped teams take dense, technical products and turn them into something people understand on the first try — across fintech, healthcare, SaaS, and commerce.</p>

            <div className="about-showcase">
              <div className="about-showcase__stats">
                <div className="about-stat">
                  <span className="about-stat__num">8<span className="about-stat__affix">yrs</span></span>
                  <span className="about-stat__label">Designing products end to end</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat__num">40<span className="about-stat__affix">+</span></span>
                  <span className="about-stat__label">Products &amp; features I&rsquo;ve shipped</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat__num">4<span className="about-stat__affix">ind.</span></span>
                  <span className="about-stat__label">Fintech, health, commerce, SaaS</span>
                </div>
              </div>
            </div>
          </section>

          <section className="section experience section--light">
            <div className="rulebar">
              <h2 className="rulebar__eyebrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                Experience
              </h2>
              <span className="rulebar__aside">2018 — Now</span>
            </div>

            <div className="roadmap" data-roadmap>
              <div
                className="roadmap__viewport"
                tabIndex={0}
                role="group"
                aria-label="Career roadmap. Use the left and right arrow keys to move between roles."
              >
                <ol className="roadmap__track">
                  <span className="roadmap__line" aria-hidden="true"></span>

                  <li className="roadmap__stop" data-state="active">
                    <span className="roadmap__node" aria-hidden="true"></span>
                    <article className="roadmap__card">
                      <span className="roadmap__year">2023 — <em className="roadmap__now">Now</em></span>
                      <h3 className="roadmap__role" data-wordfx>Product Designer (Freelance)</h3>
                      <span className="roadmap__org">Independent</span>
                      <p className="roadmap__note">Designing products end to end for founders across fintech, SaaS, and commerce.</p>
                    </article>
                  </li>

                  <li className="roadmap__stop" data-state="future">
                    <span className="roadmap__node" aria-hidden="true"></span>
                    <article className="roadmap__card">
                      <span className="roadmap__year">2021 — 2023</span>
                      <h3 className="roadmap__role" data-wordfx>Senior Product Designer</h3>
                      <span className="roadmap__org">tkxel</span>
                      <p className="roadmap__note">Led design on enterprise dashboards and a shared design system used across teams.</p>
                    </article>
                  </li>

                  <li className="roadmap__stop" data-state="future">
                    <span className="roadmap__node" aria-hidden="true"></span>
                    <article className="roadmap__card">
                      <span className="roadmap__year">2019 — 2021</span>
                      <h3 className="roadmap__role" data-wordfx>Product Designer</h3>
                      <span className="roadmap__org">OptimusFox</span>
                      <p className="roadmap__note">UX and UI for web and mobile products across a range of client projects.</p>
                    </article>
                  </li>

                  <li className="roadmap__stop" data-state="future">
                    <span className="roadmap__node" aria-hidden="true"></span>
                    <article className="roadmap__card">
                      <span className="roadmap__year">2018 — 2019</span>
                      <h3 className="roadmap__role" data-wordfx>UI Designer</h3>
                      <span className="roadmap__org">Code District</span>
                      <p className="roadmap__note">Marketing sites and first design systems for early-stage startups.</p>
                    </article>
                  </li>
                </ol>
              </div>

              <div className="roadmap__hud">
                <span className="roadmap__count" aria-hidden="true">
                  <span className="roadmap__count-cur">01</span>
                  <span className="roadmap__count-sep">/</span>
                  <span className="roadmap__count-tot">04</span>
                </span>
                <span className="roadmap__rail" aria-hidden="true"><span className="roadmap__rail-fill"></span></span>
                <div className="roadmap__nav">
                  <button className="roadmap__btn" type="button" data-dir="prev" aria-label="Previous role">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button className="roadmap__btn" type="button" data-dir="next" aria-label="Next role">
                    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <ClientLogos />

          <section className="marquee section--light" aria-label="Disciplines and tools">
            <div className="marquee__track">
              <ul className="marquee__group">
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Product Strategy</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>UX Research</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Interaction Design</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Design Systems</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Prototyping</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Motion</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Accessibility</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Figma</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>HTML &amp; CSS</li>
              </ul>
              <ul className="marquee__group" aria-hidden="true">
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Product Strategy</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>UX Research</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Interaction Design</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Design Systems</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Prototyping</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Motion</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Accessibility</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>Figma</li>
                <li className="marquee__item"><svg width="16" height="16" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>HTML &amp; CSS</li>
              </ul>
            </div>
          </section>

          <section className="reasons section--dark">
            <div className="reasons__grid">

              <div className="reasons__intro">
                <div className="reasons__head">
                  <span className="reasons__eyebrow">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                    Why work with me
                  </span>
                  <svg className="reasons__arrowdown" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2.5 7.5L7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <h2 className="reasons__heading" data-wordfx>Better design,<br />simplified.</h2>
                <p className="reasons__lead">Think of it as design on tap. Senior-level work whenever you need it, refined until it&rsquo;s right, and shaped around your brand — never pulled off a template.</p>
                <div className="reasons__cta">
                  <a href="/contact" className="btn reasons__btn">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Contact me
                  </a>
                  <div className="reasons__social">
                    <div className="reasons__avatars">
                      <span className="reasons__avatar" style={{ background: "linear-gradient(135deg, #3a4a6e, #1a2233)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar" style={{ background: "linear-gradient(135deg, #1a5a52, #07201d)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar" style={{ background: "linear-gradient(135deg, #b3702f, #5a3010)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar" style={{ background: "linear-gradient(135deg, #5a2a55, #170c1a)" } as React.CSSProperties}></span>
                      <span className="reasons__avatar reasons__avatar--more">+81</span>
                    </div>
                    <span className="reasons__trust">Trusted by founders and product leads I&rsquo;ve worked with</span>
                  </div>
                </div>
              </div>

              <div className="reasons__cards">

                <div className="reasons__card-wrap" style={{ "--i": "0" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-1.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Predictable Pricing</h3>
                      <p className="reasons__card-desc">One flat monthly rate. No surprise invoices, no scope-creep math — just steady design work you can plan your budget around.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "1" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-2.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Limitless Requests</h3>
                      <p className="reasons__card-desc">Send over as many requests as you like. I&rsquo;ll keep tweaking and refining until it matches the picture in your head.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "2" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-3.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Fast Delivery</h3>
                      <p className="reasons__card-desc">Most requests land in a few days, not a few weeks. Quick to turn around — but never rushed where it counts.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "3" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-4.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Senior Design Craft</h3>
                      <p className="reasons__card-desc">You work directly with me — someone who&rsquo;s shipped real products — not a junior learning the ropes on your budget.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "4" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-5.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title" data-wordfx>Clear Collaboration</h3>
                      <p className="reasons__card-desc">Straight talk and simple updates, so you&rsquo;re never chasing me for status. You always know exactly where things stand.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__end" aria-hidden="true"></div>
              </div>
            </div>
          </section>

        </main>

        <footer className="footer section--dark">
          <div className="footer__contact">
            <div className="footer__contact-head">
              <span className="footer__eyebrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                Contact
              </span>
              <svg className="footer__arrowdown" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M7 2v10M2.5 7.5L7 12l4.5-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div className="footer__contact-title">
              <h2 className="footer__cta-heading" data-wordfx>Get in touch</h2>
              <a href="/contact" className="btn footer__cta-btn">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Let's talk
              </a>
            </div>
          </div>

          <div className="footer__plus-grid" aria-hidden="true">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="1.2"/></svg>
          </div>

          <div className="footer__main">
            <div className="footer__left">
              <h3 className="footer__tagline" data-wordfx>Calm, clear design for products people love to use.</h3>
              <div className="footer__contacts">
                <a href="mailto:hello@awais.design" className="footer__contact-link">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  hello@awais.design
                </a>
                <div className="footer__contact-row">
                  <a href="tel:+923417039563" className="footer__contact-link">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    +92 341 7039563
                  </a>
                  <span className="footer__copy">© 2026 M. Awais</span>
                </div>
              </div>
            </div>

            <nav className="footer__links">
              <a href="/" className="footer__link"><span className="footer__link-text">Home</span><span className="footer__link-num">01</span></a>
              <a href="/work" className="footer__link"><span className="footer__link-text">Work</span><span className="footer__link-num">02</span></a>
              <a href="/about" className="footer__link"><span className="footer__link-text">About</span><span className="footer__link-num">03</span></a>
              <a href="/contact" className="footer__link"><span className="footer__link-text">Contact</span><span className="footer__link-num">04</span></a>
            </nav>
          </div>
        </footer>
    </>
  );
}
