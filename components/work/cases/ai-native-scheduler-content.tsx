"use client";

import React from "react";
import Wordmark from "@/components/ui/wordmark";
import NavWhatsapp from "@/components/ui/nav-whatsapp";

/** Case study "ai-native-scheduler", authored to match the repo's case-study structure. */
export default function AiNativeSchedulerContent() {

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
            <p className="cs-hero__niche">WorkEasy · AI & Workforce</p>
            <h1 className="cs-hero__title">Worky - AI Native Scheduler</h1>
            <p className="cs-hero__summary">An agentic scheduler for WorkEasy that builds a manager's shifts from their own rules, then hands back a draft they can question, edit, and approve. A vision piece designed to make AI scheduling something managers actually trust.</p>
            <dl className="cs-facts">
              <div><dt className="cs-facts__k">Role</dt><dd className="cs-facts__v">Sole Product Designer</dd></div>
              <div><dt className="cs-facts__k">Timeline</dt><dd className="cs-facts__v">2 months · part-time</dd></div>
              <div><dt className="cs-facts__k">Year</dt><dd className="cs-facts__v">2025</dd></div>
              <div><dt className="cs-facts__k">Industry</dt><dd className="cs-facts__v">AI · Workforce Management</dd></div>
            </dl>
          </section>

          <div className="cs-cover">
            <div className="cs-cover__media reveal" style={{ background: "url(/assets/images/work/case-ai-native-scheduler.jpg) center/cover no-repeat, radial-gradient(120% 120% at 70% 20%, #35408f 0%, #1e2450 55%, #0c0f26 100%)" } as React.CSSProperties} role="img" aria-label="Worky - AI Native Scheduler cover artwork"></div>
          </div>

          <section className="section cs-overview">
            <div className="cs-overview__grid">
              <div className="cs-overview__col reveal"><h2>The problem</h2><p>Building a shift schedule by hand is one of the most draining parts of a manager's week. Availability, skills, overtime caps, and shifting demand all have to be held in one head at once, every week, and a single wrong call ripples straight into payroll and morale.</p></div>
              <div className="cs-overview__col reveal"><h2>My role</h2><p>I designed the concept end to end as the sole designer, guided by my manager, over two months of part-time work. It was built to pitch to the client, so the whole thing is a vision piece: a working design for how agentic scheduling could live inside WorkEasy.</p></div>
              <div className="cs-overview__col reveal"><h2>The outcome</h2><p>A scheduler that does the heavy lifting and hands the manager a draft to approve, not a black box to obey. Every AI decision arrives with a plain-language reason, so trust is designed in from the first screen.</p></div>
            </div>
          </section>

          <section className="section cs-metrics">
            <div className="cs-metrics__grid">
              <div className="cs-metric reveal"><p className="cs-metric__num">90%<span> less</span></p><p className="cs-metric__label">Projected time to build a schedule, from hours to minutes</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">5<span></span></p><p className="cs-metric__label">Scheduling jobs the agent handles, from forecasting to filling gaps</p></div>
              <div className="cs-metric reveal"><p className="cs-metric__num">0<span> black boxes</span></p><p className="cs-metric__label">Every AI decision shown with a reason the manager can read</p></div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Challenge</p>
              <div>
                <h2 className="cs-block__title">AI that managers will actually trust.</h2>
                <div className="prose"><p>The promise of AI scheduling is easy to say and hard to earn. A manager will not hand their week to a system that produces a schedule with no explanation, because when it gets one shift wrong, cleaning it up is their problem. So the real challenge was never the automation. It was trust. The design had to let the agent do the heavy lifting while keeping the manager firmly in control, and it had to explain itself well enough that a manager would believe it before relying on it.</p></div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--dark">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Process</p>
              <div>
                <h2 className="cs-block__title">Teach the agent, then keep the human in charge.</h2>
                <div className="prose"><p>I designed the flow in two halves. First the manager teaches the agent the rules that matter to them: maximum hours and overtime caps, the skills or certifications each shift needs, who is available, and the coverage they have to hit. The agent draws on a knowledge base of past schedules, employee profiles, and historical demand to make its picks. Then it drafts. For the week or month the manager set, the agent produces a full list of shifts, choosing people based on their history, and hands it back. The manager stays the decision-maker at every step, free to edit a shift, reject it, or ask the agent to try again, and nothing is final until they say so.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/ai-native-scheduler-1.jpg) center/cover no-repeat, radial-gradient(120% 120% at 30% 30%, #35408f 0%, #1e2450 55%, #0c0f26 100%)" } as React.CSSProperties}></div>
                  <div className="cs-gallery__item reveal" style={{ background: "url(/assets/images/work/gallery/ai-native-scheduler-2.jpg) center/cover no-repeat, radial-gradient(120% 120% at 80% 60%, #35408f 0%, #1e2450 55%, #0c0f26 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <section className="section cs-block section--light">
            <div className="cs-block__inner">
              <p className="cs-block__kicker">Solution</p>
              <div>
                <h2 className="cs-block__title">A draft you can question, not an order you follow.</h2>
                <div className="prose"><p>The finished concept is an agentic scheduler that feels like a capable assistant rather than an autopilot. It generates the full schedule from the manager's rules, forecasts how many people a period needs, fills gaps, and resolves time-off clashes on its own. Every suggestion carries its reasoning in plain words, so the manager sees exactly why the agent picked someone, reasons like available, qualified, and under the overtime cap. Around the scheduler sit the supporting AI moments I also designed: smart timesheet corrections, automatic time-off decisions, attendance anomaly detection, and shift-swap matching, each following the same rule, do the work, then show why. It is a vision for AI in workforce management that earns its place by being transparent, not only fast.</p></div>
                <div className="cs-gallery">
                  <div className="cs-gallery__item cs-gallery__item--wide reveal" style={{ background: "url(/assets/images/work/gallery/ai-native-scheduler-3.jpg) center/cover no-repeat, radial-gradient(120% 120% at 50% 25%, #35408f 0%, #1e2450 55%, #0c0f26 100%)" } as React.CSSProperties}></div>
                </div>
              </div>
            </div>
          </section>

          <nav className="cs-pager" aria-label="More projects">
            <a className="cs-pager__link cs-pager__link--prev" href="/work/asap">
              <span className="cs-pager__dir">Previous</span>
              <span className="cs-pager__name">ASAP</span>
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
