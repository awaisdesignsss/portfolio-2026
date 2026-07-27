"use client";

import React from "react";
import { applyWordfx } from "@/lib/wordfx";
import Wordmark from "@/components/ui/wordmark";

/**
 * Work index page. Same structure as the repo's work-content.tsx,
 * updated to list the six real case studies with matching filter chips.
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
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><Wordmark /></a>
          <div className="nav__menu">
            <span className="nav__pill" aria-hidden="true" />
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
            <p className="pagehead__lead">Six products across fintech, healthcare, hospitality, workforce, enterprise, and commerce. Each one began as a tangled operational problem and ended as an interface that quietly gets out of the way.</p>
          </section>

          <section className="section workindex section--light">
            <div className="workfilter" role="group" aria-label="Filter projects by industry">
              <button className="workfilter__chip" data-filter="all" aria-pressed="true">All</button>
              <button className="workfilter__chip" data-filter="ecommerce" aria-pressed="false">E-commerce</button>
              <button className="workfilter__chip" data-filter="workforce" aria-pressed="false">Workforce</button>
              <button className="workfilter__chip" data-filter="hospitality" aria-pressed="false">Hospitality</button>
              <button className="workfilter__chip" data-filter="healthcare" aria-pressed="false">Healthcare</button>
              <button className="workfilter__chip" data-filter="enterprise" aria-pressed="false">Enterprise</button>
              <button className="workfilter__chip" data-filter="fintech" aria-pressed="false">Fintech</button>
            </div>

            <div className="workindex__grid">

              <a className="workcard reveal" href="/work/currency-gram" data-niche="fintech" aria-label="Currency Gram, Fintech case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "url(/assets/images/work/case-currency-gram.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #14564e 0%, #0c3833 55%, #05201c 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Fintech</span><span className="workcard__name">Currency Gram</span></span>
                    <span className="workcard__year">2025</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/asap" data-niche="ecommerce" aria-label="ASAP, E-commerce case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "url(/assets/images/work/case-asap.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #1e5a6e 0%, #123f4a 55%, #08222a 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">E-commerce</span><span className="workcard__name">ASAP</span></span>
                    <span className="workcard__year">2026</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/azaq" data-niche="enterprise" aria-label="AZAQ, Enterprise case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "url(/assets/images/work/case-azaq.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #33465e 0%, #1e2b3a 55%, #0c1420 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Enterprise</span><span className="workcard__name">AZAQ</span></span>
                    <span className="workcard__year">2025</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/workeasy" data-niche="workforce" aria-label="WorkEasy, Workforce case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "url(/assets/images/work/case-workeasy.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #1a5a3a 0%, #103b28 55%, #072016 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Workforce</span><span className="workcard__name">WorkEasy</span></span>
                    <span className="workcard__year">2025</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/azoria" data-niche="hospitality" aria-label="Azoria, Hospitality case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "url(/assets/images/work/case-azoria.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #a86a3a 0%, #5a3418 55%, #2a1808 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Hospitality</span><span className="workcard__name">Azoria</span></span>
                    <span className="workcard__year">2026</span>
                  </div>
                </div>
              </a>

              <a className="workcard reveal" href="/work/phlex65" data-niche="healthcare" aria-label="Phlex65, Healthcare case study">
                <div className="workcard__cover">
                  <div className="workcard__media" style={{ background: "url(/assets/images/work/case-phlex65.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #4a2f6e 0%, #281a44 55%, #100a20 100%)" } as React.CSSProperties}></div>
                  <div className="workcard__scrim"></div>
                  <span className="workcard__go" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3.5 10.5L10.5 3.5M10.5 3.5H5M10.5 3.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div className="workcard__meta">
                    <span><span className="workcard__niche">Healthcare</span><span className="workcard__name">Phlex65</span></span>
                    <span className="workcard__year">2025</span>
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
