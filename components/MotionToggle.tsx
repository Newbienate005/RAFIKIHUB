"use client";

import { useEffect, useState } from "react";

const KEY = "rh-motion";
export const MOTION_EVENT = "rh-motion";

/** True when the visitor has paused the site's moving decoration (or asked their device for reduced motion). */
export function motionPaused() {
  if (typeof window === "undefined") return false;
  return document.documentElement.dataset.motion === "paused" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Pause / play for the home page's moving content: the background slideshow, the scrolling ticker and
 * the rotating testimonials. Anything that moves on its own for more than 5 seconds needs a way to stop
 * it (WCAG 2.2.2). The choice is remembered on this device. Hidden when reduced motion is on, since
 * nothing moves then.
 */
export function MotionToggle() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let saved = false;
    try { saved = localStorage.getItem(KEY) === "paused"; } catch {}
    if (saved) apply(true);
    setPaused(saved);
  }, []);

  function apply(p: boolean) {
    if (p) document.documentElement.dataset.motion = "paused";
    else delete document.documentElement.dataset.motion;
    window.dispatchEvent(new Event(MOTION_EVENT));
  }

  function toggle() {
    const next = !paused;
    setPaused(next);
    apply(next);
    try { localStorage.setItem(KEY, next ? "paused" : "playing"); } catch {}
  }

  return (
    <button type="button" className="motion-toggle" onClick={toggle} aria-pressed={paused} aria-label={paused ? "Play the moving background" : "Pause the moving background"}>
      {paused ? (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" /></svg>
      )}
      <span className="motion-toggle__text">{paused ? "Play" : "Pause"}</span>
    </button>
  );
}
