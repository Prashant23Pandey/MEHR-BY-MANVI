"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { HERO, MODEL_BEATS, NAV } from "@/lib/content";
import { activeBeat, MODEL_TIMELINE, SCENES } from "@/lib/timeline";
import { Film } from "@/components/Film";
import { Chrome } from "@/components/Chrome";
import { Menu } from "@/components/Menu";
import { HeroModel } from "@/components/HeroModel";
import { Work } from "@/components/Work";
import { Terms } from "@/components/Terms";
import { Questions } from "@/components/Questions";
import { Application } from "@/components/Application";
import { FooterScene } from "@/components/FooterScene";

const APPLY_AT = 0.75;

export function Experience() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { progress, scrollToProgress } = useScrollProgress(menuOpen);
  const pendingSkipRef = useRef(false);
  const menuWasOpenRef = useRef(false);

  const activeChapter = useMemo(() => {
    if (progress < SCENES.work.start) return "model";
    if (progress < SCENES.terms.start) return "work";
    if (progress < SCENES.questions.start) return "terms";
    if (progress < SCENES.apply.start) return "questions";
    return "";
  }, [progress]);

  const tag = useMemo(() => {
    if (progress < MODEL_TIMELINE.beats[0].start) return HERO.tag;
    const beat = MODEL_BEATS[Math.max(0, activeBeat(progress))];
    return beat?.tag ?? HERO.tag;
  }, [progress]);

  const tagVisible = progress > 0.018 && progress < SCENES.model.end - 0.004;

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
    document.body.classList.toggle("nav-open", menuOpen);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.classList.remove("nav-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      menuWasOpenRef.current = true;
      return;
    }
    if (!menuWasOpenRef.current) return;
    menuWasOpenRef.current = false;
    document.querySelector<HTMLButtonElement>(".menu")?.focus({ preventScroll: true });
  }, [menuOpen]);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return;
    const chapter = NAV.find((item) => item.id === hash);
    if (chapter) {
      const frame = requestAnimationFrame(() => scrollToProgress(chapter.at, true));
      return () => cancelAnimationFrame(frame);
    }
    if (hash === "apply") {
      const frame = requestAnimationFrame(() => scrollToProgress(APPLY_AT, true));
      return () => cancelAnimationFrame(frame);
    }
  }, [scrollToProgress]);

  useEffect(() => {
    if (!pendingSkipRef.current || progress < SCENES.apply.start) return;
    pendingSkipRef.current = false;
    const frame = requestAnimationFrame(() => {
      document.getElementById("apply-name")?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [progress]);

  return (
    <>
      <a
        className="skip"
        href="#apply"
        onClick={(event) => {
          event.preventDefault();
          if (progress >= SCENES.apply.start) {
            requestAnimationFrame(() => {
              document.getElementById("apply-name")?.focus({ preventScroll: true });
            });
          } else {
            pendingSkipRef.current = true;
          }
          scrollToProgress(APPLY_AT);
        }}
      >
        Skip to application
      </a>

      <main
        id="top"
        inert={menuOpen}
        aria-hidden={menuOpen ? "true" : undefined}
      >
        <section className="stage" aria-label="Pear — a partner in the upside">
          <div className="pin">
            <Film progress={progress} />
            <HeroModel progress={progress} onApply={() => scrollToProgress(APPLY_AT)} />
            <Work progress={progress} />
            <Terms progress={progress} />
            <Questions progress={progress} onNavigate={scrollToProgress} />
            <Application progress={progress} />
            <FooterScene progress={progress} onNavigate={scrollToProgress} />

            <Chrome
              activeChapter={activeChapter}
              tag={tag}
              tagVisible={tagVisible}
              hidden={menuOpen}
              menuOpen={menuOpen}
              onNavigate={scrollToProgress}
              onApply={() => scrollToProgress(APPLY_AT)}
              onToggleMenu={() => setMenuOpen((open) => !open)}
            />
          </div>
        </section>
      </main>

      <Menu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={scrollToProgress}
      />
    </>
  );
}
