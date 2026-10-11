"use client";

import { useState } from "react";

/**
 * A showreel that downloads nothing until someone presses play. A <video> with preload="metadata"
 * still pulls megabytes of an old-site MP4 on page load (the index sits at the end of those files),
 * so the player only goes in when it's asked for.
 */
export function LazyVideo({ src, title }: { src: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <video className="clip__video" controls autoPlay playsInline preload="auto" src={src} aria-label={title}>
        <a href={src}>Download {title}</a>
      </video>
    );
  }
  return (
    <button type="button" className="clip__start" onClick={() => setPlaying(true)}>
      <span className="clip__play" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
      </span>
      <span className="clip__label">Play<span className="sr-only">: {title}</span></span>
    </button>
  );
}
