"use client";

import React from "react";

/** Case study "luxe-marketplace", ported from the original static work/luxe-marketplace.html. */
export default function LuxeMarketplaceContent() {

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

          <section className="pagehead cs-hero">
            <a className="cs-hero__back" href="/work">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M10.5 3.5L3.5 10.5M3.5 10.5H9M3.5 10.5V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              All work
            </a>
            <p className="cs-hero__niche">E-commerce</p>
            <h1 className="cs-hero__title">Luxe Marketplace</h1>
            <p className="cs-hero__summary">A curated marketplace for independent makers, designed so the product photography carries the experience and checkout never breaks the spell.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">6 months</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2023</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">E-commerce / Marketplace</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "radial-gradient(120% 120% at 70% 20%, #b3702f 0%, #5a3010 55%, #2a1606 100%)" } as React.CSSProperties} role="img" aria-label="Luxe Marketplace cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>A generic storefront flattened every maker into the same template. The catalog looked cheap next to the goods, and browsing felt like work.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I designed the browse and product experience, the seller storefronts, and the checkout, partnering with a brand designer on the visual language.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>An editorial browse model, storefronts makers could shape, and a checkout that holds the premium feel all the way to confirmation.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">+34%<span></span></p><p className="cs-metric__label">Add-to-cart rate after the browse redesign</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">+19%<span></span></p><p className="cs-metric__label">Checkout completion on mobile</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">2.1x<span></span></p><p className="cs-metric__label">Average time spent per browsing session</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">Reading the real problem.</h2>
                <div className="prose"><p>Premium is fragile online. One default control, one cramped grid, and the whole thing reads as a template. The challenge was letting the products lead while keeping the system consistent enough to scale across thousands of makers.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">From questions to structure.</h2>
                <div className="prose"><p>I studied how people actually shop for considered goods, then built a browse model around large imagery and slow, deliberate pacing. We gave makers a storefront they could shape within rails, and rebuilt checkout to feel like part of the same world rather than a different app.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "radial-gradient(120% 120% at 30% 30%, #b3702f 0%, #5a3010 55%, #2a1606 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "radial-gradient(120% 120% at 80% 60%, #b3702f 0%, #5a3010 55%, #2a1606 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">What we shipped.</h2>
                <div className="prose"><p>Luxe leads with photography and restraint. Storefronts feel distinct without breaking the system, and the checkout carries the same calm confidence as the catalog, which is exactly where most marketplaces lose people.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "radial-gradient(120% 120% at 50% 25%, #b3702f 0%, #5a3010 55%, #2a1606 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/medflow">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">MedFlow</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/datapulse">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">DataPulse</span>
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
