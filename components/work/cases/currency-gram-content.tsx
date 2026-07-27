"use client";

import React from "react";
import Wordmark from "@/components/ui/wordmark";

/** Case study "currency-gram", authored to match the repo's case-study structure. */
export default function CurrencyGramContent() {

  React.useEffect(() => {
    const cleanups: Array<() => void> = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    if (!reduceMotion) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
        });
      }, { rootMargin: "0px 0px -10% 0px" });
      document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
      cleanups.push(() => io.disconnect());
    }

    return () => { cleanups.forEach((fn) => fn()); };
  }, []);

  return (
    <>
      <nav className="nav">
          <a className="nav__logo" href="/" aria-label="M. Awais, home"><Wordmark /></a>
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

          <section className="pagehead cs-hero">
            <a className="cs-hero__back" href="/work">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M10.5 3.5L3.5 10.5M3.5 10.5H9M3.5 10.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              All work
            </a>
            <p className="cs-hero__niche">Fintech · Digital Banking</p>
            <h1 className="cs-hero__title">Currency Gram</h1>
            <p className="cs-hero__summary">A money transfer app that worked technically but failed emotionally, redesigned across mobile and web so sending money feels less like math and more like a conversation.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Lead Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">12 weeks · 2025</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2025</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">Fintech · Digital Banking</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "url(/assets/images/work/case-currency-gram.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #14564e 0%, #0c3833 55%, #05201c 100%)" } as React.CSSProperties} role="img" aria-label="Currency Gram cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>The app worked, but it didn't feel human. Users completed transfers, but barely. Drop-off was high, support tickets kept climbing, and the gifting feature, one of the product's best ideas, was almost invisible.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I was the Lead Product Designer. Over twelve weeks I redesigned the end-to-end experience across mobile and web, rebuilding the transfer flow, surfacing trust at the right moments, and giving beneficiaries real context.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>Sending money became faster and calmer. Transfers complete quicker, saved beneficiaries get reused far more often, and satisfaction climbed from passive to promoter in a single release.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">-38%<span></span></p><p className="cs-metric__label">Transfer completion time, from 6.4 down to 3.9 minutes</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">2.4x<span></span></p><p className="cs-metric__label">Increase in beneficiary reuse, with 44% fewer re-entry errors</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">+41<span> NPS</span></p><p className="cs-metric__label">Net Promoter Score, moving from 18 to 59</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">The drop-off wasn't a flow problem. It was a trust problem.</h2>
                <div className="prose"><p>After digging through session recordings, support ticket patterns, and interviews with freelancers and everyday users, the same thing kept surfacing. People weren't leaving because the app was broken. They were leaving because it never made them feel safe enough to continue. Fees showed up after they had committed. Transfer status vanished into a vague 'processing' state. And the beneficiary system, meant to save time, felt like starting over every single time.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">Three weeks of questions before a single screen.</h2>
                <div className="prose"><p>Before I opened Figma, I spent three weeks mapping the problem. I analyzed session recordings, ran interviews, audited support tickets, and tore down Wise, Revolut, and Payoneer to see how they earn trust. That led to a signed problem brief and a ranked list of trust failure points. From there I sketched eight flow concepts, shortlisted two, gut-checked them with users, then built a full design system and ran two rounds of moderated testing, logging fourteen iterations before handoff.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "radial-gradient(120% 120% at 30% 30%, #14564e 0%, #0c3833 55%, #05201c 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "radial-gradient(120% 120% at 80% 60%, #14564e 0%, #0c3833 55%, #05201c 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">Lead with transparency, not fine print.</h2>
                <div className="prose"><p>The redesign made four structural shifts. Fee disclosure moved up to the amount entry screen, before any commitment, so the full cost is always clear. The transfer flow compressed from seven steps to three, built around one mental model: who, how much, done. A live status layer replaced 'processing' with real-time progress, estimated arrival, and plain language for every state. And beneficiary profiles were rebuilt to surface context, the last transfer, the preferred method, a quick-send shortcut, turning a cold list into something that feels like a relationship. It did not add features. It removed every reason to hesitate.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "radial-gradient(120% 120% at 50% 25%, #14564e 0%, #0c3833 55%, #05201c 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/phlex65">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">Phlex65</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/asap">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">ASAP</span>
            </a>
          </nav>

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
