"use client";

import { useState } from "react";
import { clamp, mapRange, smoothstep } from "@/lib/utils";

type FilmLayer = {
  src: string;
  poster: string;
  opacity: number;
  preload: "auto" | "metadata" | "none";
};

function windowOpacity(progress: number, start: number, end: number, fade = 0.03) {
  const inAmount = smoothstep(mapRange(progress, start, start + fade));
  const outAmount = 1 - smoothstep(mapRange(progress, end - fade, end));
  return clamp(inAmount * outAmount);
}

export function Film({ progress }: { progress: number }) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  const layers: FilmLayer[] = [
    {
      src: "/films/signal.mp4",
      poster: "/films/signal-poster.jpg",
      opacity: 1 - smoothstep(mapRange(progress, 0.222, 0.255)),
      preload: "auto",
    },
    {
      src: "/films/colossus.mp4",
      poster: "/films/colossus-poster.jpg",
      opacity: windowOpacity(progress, 0.222, 0.415, 0.032),
      preload: "metadata",
    },
    {
      src: "/films/reveal.mp4",
      poster: "/films/reveal-poster.jpg",
      opacity: windowOpacity(progress, 0.39, 0.715, 0.032),
      preload: "metadata",
    },
    {
      src: "/films/footer-loop.mp4",
      poster: "/films/reveal-poster.jpg",
      opacity: windowOpacity(progress, 0.685, 1.01, 0.035),
      preload: "metadata",
    },
  ];

  return (
    <div className="film" aria-hidden="true">
      <div
        className={`boot${ready || failed ? " off" : ""}`}
        style={{ backgroundImage: "url(/films/signal-poster.jpg)" }}
      />
      {layers.map((layer) => (
        <video
          key={layer.src}
          className="film-video"
          style={{ opacity: layer.opacity }}
          src={layer.src}
          poster={layer.poster}
          autoPlay
          muted
          loop
          playsInline
          preload={layer.preload}
          onCanPlay={layer.src === "/films/signal.mp4" ? () => setReady(true) : undefined}
          onError={layer.src === "/films/signal.mp4" ? () => setFailed(true) : undefined}
        />
      ))}
      <div className="film-grade" />
      <div className="film-warm" style={{ opacity: windowOpacity(progress, 0.39, 0.63, 0.04) }} />
      <div className="film-dark" style={{ opacity: windowOpacity(progress, 0.55, 1.01, 0.06) }} />
      <div className="vignette" />
      <div className="grain" />
      <p className={`boot-note${ready || failed ? " off" : ""}`}>
        {failed ? "The film could not load" : "The film is loading"}
        <b>{failed ? "— poster mode" : "— a moment"}</b>
      </p>
    </div>
  );
}
