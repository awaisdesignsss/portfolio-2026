"use client";

import React from "react";
import { applyWordfx } from "@/lib/wordfx";

/**
 * Work index page, ported from the original static work.html.
 * Design comes from the shared styles.css (imported in app/layout.tsx).
 * Nav toggle, reveal-on-scroll, and the industry filter are ported into
 * the effect below with listener/observer cleanup.
 */
export default function WorkContent() {

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

    // ── Industry filter ──
    (() => {
      const chips = Array.from(document.querySelectorAll<HTMLElement>(".workfilter__chip"));
      const cards = Array.from(document.querySelectorAll<HTMLElement>(".workcard"));
      const empty = document.querySelector<HTMLElement & { hidden: boolean }>(".workindex__empty");
      if (!chips.length) return;
      chips.forEach((chip) => {
        const onClick = () => {
          const filter = chip.dataset.filter;
          chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
          let shown = 0;
          cards.forEach((card) => {
            const match = filter === "all" || card.dataset.niche === filter;
            card.classList.toggle("is-hidden", !match);
            if (match) shown++;
          });
          if (empty) empty.hidden = shown !== 0;
        };
        chip.addEventListener("click", onClick);
        cleanups.push(() => chip.removeEventListener("click", onClick));
      });
    })();

    // ── wordfx: per-word hover choreography on section headings ──
    applyWordfx();

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <>
      <nav className="nav">
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><span className="brandmark" role="img" aria-label="Awais"></span></a>
          <div className="nav__menu">
            <a href="/" className="nav__link">Home</a>
            <a href="/work" className="nav__link" aria-current="page">Work</a>
            <a href="/about" className="nav__link">About</a>
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
              Selected Work
            </span>
            <h1 className="pagehead__title" data-wordfx>Products built to be understood.</h1>
            <p className="pagehead__lead">Six projects across fintech, healthcare, commerce, and SaaS. Every one started as a tangled mess of a problem — and ended as an interface that quietly gets out of the way.</p>
          </section>

          <section className="section workindex section--light">
            <div className="workfilter" role="group" aria-label="Filter projects by industry">
              <button className="workfilter__chip" data-filter="all" aria-pressed="true">All</button>
              <button className="workfilter__chip" data-filter="fintech" aria-pressed="false">Fintech</button>
              <button className="workfilter__chip" data-filter="healthcare" aria-pressed="false">Healthcare</button>
              <button className="workfilter__chip" data-filter="ecommerce" aria-pressed="false">E-commerce</button>
              <button className="workfilter__chip" data-filter="saas" aria-pressed="false">SaaS</button>
              <button className="workfilter__chip" data-filter="banking" aria-pressed="false">Banking</button>
              <button className="workfilter__chip" data-filter="food" aria-pressed="false">Food &amp; Drink</button>
            </div>

            <div className="workindex__grid">

              <a className="workcard reveal" href="/work/paywise-dashboard" data-niche="fintech" aria-label="Paywise Dashboard, fintech case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "radial-gradient(120% 120% at 70% 20%, #2a3a5a 0%, #1a2233 55%, #0d1320 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Fintech</span><span className="workcard__name">Paywise Dashboard</span></span>
                    <span className="workcard__year">2024</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/medflow" data-niche="healthcare" aria-label="MedFlow, healthcare case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "radial-gradient(120% 120% at 70% 20%, #1a5a52 0%, #103b38 55%, #07201d 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Healthcare</span><span className="workcard__name">MedFlow</span></span>
                    <span className="workcard__year">2024</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/luxe-marketplace" data-niche="ecommerce" aria-label="Luxe Marketplace, e-commerce case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "radial-gradient(120% 120% at 70% 20%, #b3702f 0%, #5a3010 55%, #2a1606 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">E-commerce</span><span className="workcard__name">Luxe Marketplace</span></span>
                    <span className="workcard__year">2023</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/datapulse" data-niche="saas" aria-label="DataPulse, SaaS case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "radial-gradient(120% 120% at 70% 20%, #3a3a6e 0%, #1f1f44 55%, #0c0c20 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">SaaS</span><span className="workcard__name">DataPulse</span></span>
                    <span className="workcard__year">2023</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/zenith-digital" data-niche="banking" aria-label="Zenith Digital, banking case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "radial-gradient(120% 120% at 70% 20%, #5a2a55 0%, #34203a 55%, #170c1a 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Banking</span><span className="workcard__name">Zenith Digital</span></span>
                    <span className="workcard__year">2022</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/foodhub" data-niche="food" aria-label="FoodHub, food and drink case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "radial-gradient(120% 120% at 70% 20%, #b58a2f 0%, #5a3a0a 55%, #2a1c04 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Food &amp; Drink</span><span className="workcard__name">FoodHub</span></span>
                    <span className="workcard__year">2022</span>
                  </div>
                </div>
              </a>

            </div>

            <p className="workindex__empty" hidden={true}>No projects in that industry yet.</p>
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
