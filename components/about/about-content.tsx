"use client";

import React from "react";

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

    // ── wordfx: per-word hover choreography ──
    (() => {
      const wrap = (el: HTMLElement) => {
        if (el.dataset.wordfxDone) return;
        const words = (el.textContent || "").trim().split(/\s+/);
        el.textContent = "";
        words.forEach((w, i) => {
          const s = document.createElement("span");
          s.className = "wordfx";
          s.textContent = w;
          const rot = (((i * 137) % 61) - 30) / 10;
          const lift = 0.06 + ((i * 89) % 5) / 100;
          const scale = 1.03 + ((i * 53) % 5) / 100;
          s.style.setProperty("--wr", rot.toFixed(1) + "deg");
          s.style.setProperty("--wl", "-" + lift.toFixed(2) + "em");
          s.style.setProperty("--ws", scale.toFixed(2));
          el.appendChild(s);
          if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
        });
        el.dataset.wordfxDone = "1";
      };
      document.querySelectorAll<HTMLElement>("[data-wordfx]").forEach(wrap);
    })();

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

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <>
      <nav className="nav">
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><span className="brandmark" role="img" aria-label="Awais"></span></a>
          <div className="nav__menu">
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
            <h1 className="pagehead__title">Designer set on clarity, not decoration.</h1>
            <p className="pagehead__lead">I'm M. Awais. For eight years I've helped teams turn dense, technical products into interfaces people understand on the first try, across fintech, healthcare, and commerce.</p>

            <div className="about-showcase">
              <div className="about-showcase__stats">
                <div className="about-stat">
                  <span className="about-stat__num">8<span className="about-stat__affix">yrs</span></span>
                  <span className="about-stat__label">Designing products end to end</span>
                </div>
                <div className="about-stat">
                  <span className="about-stat__num">60<span className="about-stat__affix">+</span></span>
                  <span className="about-stat__label">Products and features shipped</span>
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
              <span className="rulebar__eyebrow">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1.4"/></svg>
                Experience
              </span>
              <span className="rulebar__aside">2017 — Now</span>
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
                      <h3 className="roadmap__role">Lead Product Designer</h3>
                      <span className="roadmap__org">Northbeam</span>
                      <p className="roadmap__note">Own end-to-end design for the analytics platform across web and mobile.</p>
                    </article>
                  </li>

                  <li className="roadmap__stop" data-state="future">
                    <span className="roadmap__node" aria-hidden="true"></span>
                    <article className="roadmap__card">
                      <span className="roadmap__year">2021 — 2023</span>
                      <h3 className="roadmap__role">Senior UX Designer</h3>
                      <span className="roadmap__org">Finhaus</span>
                      <p className="roadmap__note">Rebuilt onboarding and the core dashboard for a fintech serving 40k businesses.</p>
                    </article>
                  </li>

                  <li className="roadmap__stop" data-state="future">
                    <span className="roadmap__node" aria-hidden="true"></span>
                    <article className="roadmap__card">
                      <span className="roadmap__year">2019 — 2021</span>
                      <h3 className="roadmap__role">Product Designer</h3>
                      <span className="roadmap__org">Studio Mura</span>
                      <p className="roadmap__note">Brand and product work for healthcare and commerce clients.</p>
                    </article>
                  </li>

                  <li className="roadmap__stop" data-state="future">
                    <span className="roadmap__node" aria-hidden="true"></span>
                    <article className="roadmap__card">
                      <span className="roadmap__year">2017 — 2019</span>
                      <h3 className="roadmap__role">UI Designer</h3>
                      <span className="roadmap__org">Independent</span>
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

          <section className="logos section--light">
            <div className="container">
              <div className="logos__header">
                <div className="logos__label-wrap">
                  <svg className="logos__star" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 0L7.91 4.59L12.5 6L7.91 7.41L6.5 12L5.09 7.41L0.5 6L5.09 4.59L6.5 0Z" fill="currentColor"/></svg>
                  <span className="logos__label">Built for Ambitious Brands</span>
                </div>
                <svg className="logos__arrow" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div className="logos__grid">
                <div className="logos__card"><span className="logos__name">Google</span></div>
                <div className="logos__card"><span className="logos__name">Spotify</span></div>
                <div className="logos__card"><span className="logos__name">Shopify</span></div>
                <div className="logos__card"><span className="logos__name">Slack</span></div>
                <div className="logos__card"><span className="logos__name">Adobe</span></div>
                <div className="logos__card"><span className="logos__name">Figma</span></div>
                <div className="logos__card"><span className="logos__name">Notion</span></div>
                <div className="logos__card"><span className="logos__name">Stripe</span></div>
              </div>
            </div>
          </section>

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
                <h2 className="reasons__heading">Better design,<br />simplified.</h2>
                <p className="reasons__lead">A design partnership that gives you flexible access to high-quality creative work, delivered quickly, refined continuously, and tailored to your brand.</p>
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
                    <span className="reasons__trust">Trusted by directors of influential companies</span>
                  </div>
                </div>
              </div>

              <div className="reasons__cards">

                <div className="reasons__card-wrap" style={{ "--i": "0" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-1.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title">Predictable Pricing</h3>
                      <p className="reasons__card-desc">Access dedicated design support through a simple monthly model. No hidden fees, no surprises, just consistent creative work tailored to your needs.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "1" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-2.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title">Limitless Requests</h3>
                      <p className="reasons__card-desc">Submit as many design requests as you need. I keep refining and improving until everything aligns perfectly with your vision.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "2" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-3.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title">Fast Delivery</h3>
                      <p className="reasons__card-desc">Speed meets quality. A streamlined workflow ensures your projects move forward quickly without sacrificing attention to detail.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "3" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-4.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title">Senior Design Craft</h3>
                      <p className="reasons__card-desc">Work with an experienced designer who understands strategy, aesthetics, and performance, delivering work that strengthens your brand.</p>
                    </div>
                  </article>
                </div>

                <div className="reasons__card-wrap" style={{ "--i": "4" } as React.CSSProperties}>
                  <article className="reasons__card">
                    <span className="reasons__icon"><img src="/assets/images/reasons/icon-5.png" alt="" /></span>
                    <div className="reasons__card-body">
                      <h3 className="reasons__card-title">Clear Collaboration</h3>
                      <p className="reasons__card-desc">Stay connected through simple, transparent communication that keeps feedback flowing and projects moving.</p>
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
              <h2 className="footer__cta-heading">Get in touch</h2>
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
              <h3 className="footer__tagline">Strategic design for brands that matter.</h3>
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
