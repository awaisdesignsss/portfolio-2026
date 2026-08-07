"use client";

import React from "react";
import Wordmark from "@/components/ui/wordmark";
import NavWhatsapp from "@/components/ui/nav-whatsapp";

/** Case study "azaq", authored to match the repo's case-study structure. */
export default function AzaqContent() {

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
          <div className="nav__actions">
            <NavWhatsapp />
            <a href="mailto:hello@awaisdesigns.com" className="nav__cta">Email me</a>
          </div>
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
            <p className="cs-hero__niche">Enterprise · Digital Transformation</p>
            <h1 className="cs-hero__title">AZAQ - Relia</h1>
            <p className="cs-hero__summary">Relia, an FMCG arm of a major Saudi group, moved off D365 and paper onto a web platform that turns Customer Onboarding and Trade Spending into tracked, digital approvals.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Sole Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">4 months · 2025</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2025</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">Enterprise · FMCG</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "url(/assets/images/work/case-azaq.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #33465e 0%, #1e2b3a 55%, #0c1420 100%)" } as React.CSSProperties} role="img" aria-label="AZAQ - Relia cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>Relia ran Customer Onboarding and Trade Spending on Microsoft D365 and paper. Approvals bounced back and forth, and a salesman sometimes had to physically deliver a document to the Account Representative to move things along. Salesmen and customers were both worn down by it.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I was the sole designer, working with a business analyst to design the platform. I delivered the Customer Onboarding and Trade Spending modules. More were planned, but the client's internal circumstances paused the rest.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>A web platform that makes onboarding smooth and approvals traceable. More customers get onboarded, and the salesmen are far less bogged down in the process.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">4-stage<span></span></p><p className="cs-metric__label">Approval chain digitized: Salesman, Clerk, Account Rep, Manager</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">2<span> modules</span></p><p className="cs-metric__label">Customer Onboarding and Trade Spending, live on the platform</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">0<span> hand-offs</span></p><p className="cs-metric__label">No more documents delivered in person to earn an approval</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">Approvals that traveled by hand.</h2>
                <div className="prose"><p>Relia's process was paperwork and patience. Every onboarding and every trade spending request moved through a chain of approvals and rejections, mostly on paper and inside D365. When it stalled, a salesman would sometimes have to hand-carry a document to the Account Representative just to keep it moving. It was slow, it was frustrating for everyone in the chain, and it kept good customers waiting.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">Map the chain, then make it flow.</h2>
                <div className="prose"><p>The heart of both modules is an approval workflow that runs from the Salesman to the Clerk to the Account Representative to the Manager. I designed for each of those roles and the moments where things used to break down, so a request moves forward on its own instead of by hand. Trade Spending covers a lot of ground here, from activity proposals and business development agreements between the two parties to promotional activities and claims, so it needed structure that could hold all of it clearly.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/azaq-1.jpg) center/cover no-repeat, radial-gradient(120% 120% at 30% 30%, #33465e 0%, #1e2b3a 55%, #0c1420 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/azaq-2.jpg) center/cover no-repeat, radial-gradient(120% 120% at 80% 60%, #33465e 0%, #1e2b3a 55%, #0c1420 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">A web platform, made for the people who use it.</h2>
                <div className="prose"><p>The client asked for a mobile app. I pushed for web instead, and the reason was practical. Salesmen work from tablets, where an optimized web view sits comfortably, and the clerks, account reps, and managers all work on larger screens where a proper web interface is far easier than a phone. So the platform reads well on a tablet in the field and on a desktop in the office, and everyone in the approval chain gets a view that fits how they actually work.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "url(/assets/images/work/gallery/azaq-3.jpg) center/cover no-repeat, radial-gradient(120% 120% at 50% 25%, #33465e 0%, #1e2b3a 55%, #0c1420 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/ai-native-scheduler">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">Worky - AI Native Scheduler</span>
            </a>
            <a className="cs-pager__link cs-pager__link--next" href="/work/workeasy">
              <span className="cs-pager__dir">Next</span>
              <span className="cs-pager__name">WorkEasy</span>
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
              <h3 className="footer__tagline">Calm, clear design for products people love to use.</h3>
              <div className="footer__contacts">
                <a href="mailto:hello@awaisdesigns.com" className="footer__contact-link">
                  <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  hello@awaisdesigns.com
                </a>
                <div className="footer__contact-row">
                  <a href="https://wa.me/923027778210" target="_blank" rel="noopener noreferrer" className="footer__contact-link">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true"><path d="M1 8L8 1M8 1H2M8 1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    +92 302 7778210
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
