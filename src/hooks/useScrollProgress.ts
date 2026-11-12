"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clamp } from "@/lib/utils";

function getMaxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
}

export function useScrollProgress(paused = false) {
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(paused);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const interceptRef = useRef(false);

  useEffect(() => {
    pausedRef.current = paused;
    if (!paused) return;
    targetRef.current = window.scrollY;
    currentRef.current = window.scrollY;
  }, [paused]);

  const scrollToProgress = useCallback((value: number, immediate = false) => {
    const max = getMaxScroll();
    const target = clamp(value) * max;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (immediate || reduced || !interceptRef.current) {
      window.scrollTo({
        top: target,
        behavior: immediate || reduced ? "auto" : "smooth",
      });
      targetRef.current = target;
      currentRef.current = target;
      setProgress(clamp(value));
      return;
    }
    targetRef.current = target;
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    interceptRef.current = !reduced && window.innerWidth > 720;

    const syncFromScroll = () => {
      const max = getMaxScroll();
      currentRef.current = window.scrollY;
      targetRef.current = window.scrollY;
      setProgress(clamp(window.scrollY / max));
    };

    syncFromScroll();

    const onScroll = () => {
      if (Math.abs(window.scrollY - currentRef.current) > 2) {
        currentRef.current = window.scrollY;
        targetRef.current = window.scrollY;
        setProgress(clamp(window.scrollY / getMaxScroll()));
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!interceptRef.current || event.ctrlKey || pausedRef.current) return;
      event.preventDefault();
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      targetRef.current = clamp(
        targetRef.current + event.deltaY * unit * 2.15,
        0,
        getMaxScroll(),
      );
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!interceptRef.current || pausedRef.current) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A", "SUMMARY"].includes(
            target.tagName,
          ))
      ) {
        return;
      }
      const step = {
        ArrowDown: 90,
        ArrowUp: -90,
        PageDown: window.innerHeight * 0.9,
        PageUp: -window.innerHeight * 0.9,
        " ": window.innerHeight * 0.9,
        Home: -1e9,
        End: 1e9,
      }[event.key];
      if (step === undefined) return;
      event.preventDefault();
      targetRef.current = clamp(
        targetRef.current + step,
        0,
        getMaxScroll(),
      );
    };

    const onResize = () => {
      interceptRef.current =
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        window.innerWidth > 720;
      syncFromScroll();
    };

    const tick = (time: number) => {
      if (time - lastFrameRef.current > 1000 / 30) {
        lastFrameRef.current = time;
        if (!pausedRef.current) {
          if (interceptRef.current) {
            const diff = targetRef.current - currentRef.current;
            if (Math.abs(diff) > 0.5) {
              currentRef.current += diff * 0.16;
              window.scrollTo(0, currentRef.current);
            } else if (Math.abs(diff) > 0) {
              currentRef.current = targetRef.current;
              window.scrollTo(0, currentRef.current);
            }
          }
          setProgress(clamp(currentRef.current / getMaxScroll()));
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return { progress, scrollToProgress };
}
