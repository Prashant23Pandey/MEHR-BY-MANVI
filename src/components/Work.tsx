"use client";

import { WORK_CARDS } from "@/lib/content";
import {
  workCardState,
  workChartProgress,
  workSceneOpacity,
} from "@/lib/timeline";

const TICKS = Array.from({ length: 33 }, (_, index) => index + 1);

export function Work({ progress }: { progress: number }) {
  const scene = workSceneOpacity(progress);
  const chart = workChartProgress(progress);
  const percent = Math.round(chart * 100);
  const active = WORK_CARDS.reduce((best, _card, index) => {
    const state = workCardState(progress, index);
    return state.opacity > best.opacity ? { index, opacity: state.opacity } : best;
  }, { index: 0, opacity: 0 }).index;

  return (
    <section
      className="pf scene"
      style={{ opacity: scene }}
      aria-hidden={scene < 0.05 ? "true" : undefined}
    >
      <div className="pf-axis" aria-hidden="true">
        <div className="pf-axis-line" />
        <div
          className="pf-ticks"
          style={{ transform: `translateY(${(0.5 - chart) * 220}px)` }}
        >
          {TICKS.map((tick) => (
            <i
              key={tick}
              className={tick % 5 === 0 ? "long" : undefined}
              style={{ top: `${tick * 3}%` }}
            />
          ))}
        </div>
        <div
          className="pf-head"
          style={{ top: `${22 + chart * 52}%`, opacity: scene }}
        >
          <b>{percent}%</b>
        </div>
      </div>

      <div className="pf-fix">
        {WORK_CARDS.map((card, index) => {
          const state = workCardState(progress, index);
          const isActive = active === index;
          const lineTransform = `translateX(${(1 - state.local) * 115}%)`;
          return (
            <article
              key={card.id}
              className={`pf-g${state.local > 0.15 ? " on" : ""}`}
              style={{
                width: card.width,
                opacity: state.opacity,
                transform: `translateY(${(1 - state.local) * 12}px)`,
                visibility: state.opacity > 0.01 ? "visible" : "hidden",
              }}
              aria-hidden={isActive ? undefined : "true"}
            >
              <span className="pf-chip" style={{ width: card.chipWidth }}>
                <b>{card.chip}</b>
              </span>
              <h2 className="pf-h" style={{ width: card.width }}>
                {card.head.map((line) => (
                  <span className="ln" key={line}>
                    <i style={{ transform: lineTransform }}>{line}</i>
                  </span>
                ))}
              </h2>
              <p className="pf-b" style={{ marginTop: index === 2 ? 27 : 26 }}>
                {card.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
