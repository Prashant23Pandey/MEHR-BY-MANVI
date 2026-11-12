"use client";

import { TERMS } from "@/lib/content";
import { termStatementState, termsSceneOpacity } from "@/lib/timeline";

export function Terms({ progress }: { progress: number }) {
  const scene = termsSceneOpacity(progress);
  const first = termStatementState(progress, 0);
  const second = termStatementState(progress, 1);

  return (
    <section
      className="fin scene"
      style={{ opacity: scene }}
      aria-hidden={scene < 0.05 ? "true" : undefined}
    >
      <div className="terms-wash terms-wash--warm" style={{ opacity: first.opacity }} />
      <div className="terms-wash terms-wash--dark" style={{ opacity: second.opacity }} />

      {TERMS.map((term, index) => {
        const state = index === 0 ? first : second;
        return (
          <div
            key={term.id}
            className={`fin-g fin-g--${index}${state.local > 0.12 ? " on" : ""}`}
            data-f={index}
            style={{
              opacity: state.opacity,
              visibility: state.opacity > 0.01 ? "visible" : "hidden",
            }}
            aria-hidden={state.opacity < 0.4 ? "true" : undefined}
          >
            <div className="fin-top">
              <div className="fin-soak">
                <h2 className="fin-h" style={{ width: term.headWidth }}>
                  {term.head.map((line) => (
                    <span className="ln" key={line}>
                      <i
                        style={{
                          transform: `translateY(${(1 - state.local) * (index === 0 ? 120 : 175)}%)`,
                        }}
                      >
                        {line}
                      </i>
                    </span>
                  ))}
                </h2>
              </div>
            </div>
            <div className="fin-bot">
              <div className="fin-soak">
                <p className="fin-l" style={{ width: term.leadWidth }}>
                  {term.lead}
                </p>
                <div className="fin-row">
                  <span className="fin-chip">
                    <b>{term.chip}</b>
                  </span>
                  <p className="fin-s" style={{ width: term.smallWidth }}>
                    {term.small}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
