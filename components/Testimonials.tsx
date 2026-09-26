"use client";

import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/data";
import { Photo } from "./Photo";

/**
 * "Happy Members": one large quote that rotates every 7 seconds, with dots to jump.
 * All quotes are in the HTML; rotation pauses on hover/focus and is off for reduced motion.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused || items.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % items.length), 7000);
    return () => clearInterval(id);
  }, [paused, items.length]);

  return (
    <div className="rotator" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="rotator__stage" aria-live={paused ? "polite" : "off"}>
        {items.map((t, n) => (
          <figure key={t.name} className={`rotator__item${n === i ? " is-active" : ""}`} aria-hidden={n !== i}>
            <blockquote>“{t.message}”</blockquote>
            <figcaption>
              <span className="quote__face"><Photo src={t.image ?? undefined} alt="" label={t.name} sizes="56px" /></span>
              <span><cite>{t.name}</cite><span className="role">{t.category}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="rotator__dots" role="group" aria-label="Choose a testimonial">
        {items.map((t, n) => (
          <button key={t.name} type="button" aria-label={`Quote from ${t.name}`} aria-pressed={n === i} onClick={() => setI(n)} />
        ))}
      </div>
    </div>
  );
}
