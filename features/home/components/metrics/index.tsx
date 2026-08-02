"use client";

import Reveal from "@/components/reveal";
import { useCountUp } from "./use-count-up";
import { METRICS } from "./metrics.data";
import type { IMetric } from "./metrics.interface";

/**
 * Metrics strip — three numbers that count up from zero when scrolled
 * into view. Each item rises in on the old 110ms stagger; the count-up
 * itself lives in useCountUp and is skipped under reduced motion.
 */

function MetricItem({ metric, index }: { metric: IMetric; index: number }) {
  // The in-view ref sits on the number itself, matching the old observer
  // which watched .metrics__number rather than the item.
  const { ref, display } = useCountUp(metric.value);

  return (
    <Reveal className="metrics__item" variant="rise" delay={index * 0.11}>
      <p className="metrics__number" ref={ref}>
        {display}
        {metric.affix !== undefined && <span className="metrics__affix">{metric.affix}</span>}
      </p>
      <p className="metrics__label">{metric.label}</p>
    </Reveal>
  );
}

export default function Metrics() {
  return (
    <section className="metrics section--light">
      <div className="container">
        <div className="metrics__grid">
          {METRICS.map((metric, i) => (
            <MetricItem key={metric.label} metric={metric} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
