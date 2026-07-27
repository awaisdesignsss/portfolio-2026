"use client";

import React from "react";
import Wordmark from "@/components/ui/wordmark";

/** Case study "asap", authored to match the repo's case-study structure. */
export default function AsapContent() {

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
            <p className="cs-hero__niche">E-commerce · CMS Platform</p>
            <h1 className="cs-hero__title">ASAP</h1>
            <p className="cs-hero__summary">A parts distribution company running 658 separate .NET websites, rebuilt as one Next.js CMS, with a site for every vertical and a single place to manage them all.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Lead Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">Late 2025 to 2026</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2026</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">E-commerce · CMS</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "url(/assets/images/work/case-asap.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #1e5a6e 0%, #123f4a 55%, #08222a 100%)" } as React.CSSProperties} role="img" aria-label="ASAP cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>658 websites, each stuck on aging .NET, each with its own admin panel. Infrastructure ran about $85K a month, and with no central platform, the SEO and content teams couldn't stay in sync across sites.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I led a team of four designers. I designed the CMS and its full component system, then guided the team as we rebuilt every site through it, working alongside a separate engineering lead.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>One Next.js CMS running all 658 sites. Infrastructure dropped to about $32K a month, RFQs rose 10%, and every site is now managed from a single dashboard.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">62%<span> less</span></p><p className="cs-metric__label">Monthly infrastructure cost, from $85K down to $32K</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">658<span> → 1</span></p><p className="cs-metric__label">Legacy .NET sites unified into one Next.js CMS</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">+10%<span></span></p><p className="cs-metric__label">Increase in RFQs across the network of sites</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">658 sites, one system.</h2>
                <div className="prose"><p>The hard part was never a single screen. It was scale. Designing 658 sites by hand was impossible, and letting each one drift on its own was exactly the mess we were leaving behind. I had to build a system flexible enough to fit very different verticals, yet consistent enough that one team could run all of it. On top of that, the old setup gave every site its own admin, so the people handling SEO and content were working blind across the network.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">Themes by vertical, custom for the few that mattered.</h2>
                <div className="prose"><p>I grouped the 658 sites by vertical and designed a small set of themes, then mapped each site to the template that fit it. For the top ten sites, the ones that carried the most weight, I designed custom experiences. Everything else ran on shared theming, which is what made the scale manageable. Along the way I introduced JSON-based components so we could design new components at runtime with Claude and drop them straight into a site, which kept the team fast as the migration ramped up.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/asap-1.jpg) center/cover no-repeat, radial-gradient(120% 120% at 30% 30%, #1e5a6e 0%, #123f4a 55%, #08222a 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/asap-2.jpg) center/cover no-repeat, radial-gradient(120% 120% at 80% 60%, #1e5a6e 0%, #123f4a 55%, #08222a 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">A builder, plus one dashboard over everything.</h2>
                <div className="prose"><p>The CMS is a drag-and-drop website builder with a library of components and ready-made templates. Each site has its own admin controls inside the CMS, scoped to that site, while a master dashboard sits above all of them with network-wide insight. Shared SEO controls at the site level finally let the teams work in step, and are a big part of why RFQs went up. Around forty people now run the entire network from one place.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "url(/assets/images/work/gallery/asap-3.jpg) center/cover no-repeat, radial-gradient(120% 120% at 50% 25%, #1e5a6e 0%, #123f4a 55%, #08222a 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/currency-gram">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">Currency Gram</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/azaq">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">AZAQ - Relia</span>
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
