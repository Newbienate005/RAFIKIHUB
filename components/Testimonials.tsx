"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Testimonial } from "@/lib/data";
import { haptic } from "@/lib/view-transition";
import { Photo } from "./Photo";

/** Where a flick would come to rest (Apple's projection), in px from the release point.
 *  0.99 is the "snappier" rate, right for paging; 0.998 (scrolling) would throw a gentle drag too far. */
const project = (velocity: number, rate = 0.99) => ((velocity / 1000) * rate) / (1 - rate);

type Drag = { id: number; x0: number; y0: number; dx: number; axis: "x" | "y" | null; samples: { x: number; t: number }[] };

/**
 * "Happy Members": one large quote at a time. It rotates every 7 seconds until someone takes over:
 * swipe it (1:1, with a flick to throw it on) or pick a dot. Quotes leave the way they're pushed and
 * the next one arrives from the other side. All quotes are in the HTML; rotation pauses on hover/focus
 * and is off for reduced motion.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1); // 1: the next quote comes in from the right
  const [paused, setPaused] = useState(false);
  const [userControlled, setUserControlled] = useState(false);
  const iRef = useRef(0);
  const dirRef = useRef<1 | -1>(1);
  const stage = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const n = items.length;

  /** Move to quote `to`, travelling in direction `d`. On a change of direction the waiting quotes are first
   *  moved, without animating, to the side they'll now come in from, so the incoming one slides the right way. */
  const go = (to: number, d: 1 | -1) => {
    const from = iRef.current;
    if (to === from) return;
    const s = stage.current;
    if (d !== dirRef.current && s) {
      s.classList.add("is-repositioning");
      s.style.setProperty("--dir", String(d));
      void s.offsetWidth; // apply the new side now, before the quote is made active
      s.classList.remove("is-repositioning");
    }
    dirRef.current = d;
    setDir(d);
    setLeaving(from);
    setI(to);
    iRef.current = to;
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused || userControlled || n < 2) return;
    const id = setInterval(() => go((iRef.current + 1) % n, 1), 7000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, userControlled, n]);

  const activeEl = () => stage.current?.querySelector<HTMLElement>(".rotator__item.is-active") ?? null;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (n < 2 || (e.pointerType === "mouse" && e.button !== 0)) return;
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, dx: 0, axis: null, samples: [{ x: e.clientX, t: e.timeStamp }] };
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = activeEl();
    if (!d || !el || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    if (!d.axis) {
      // Small threshold before committing, so scrolling the page past the quote still works
      if (Math.hypot(dx, e.clientY - d.y0) < 10) return;
      d.axis = Math.abs(dx) > Math.abs(e.clientY - d.y0) ? "x" : "y";
      if (d.axis === "y") return;
      try { stage.current?.setPointerCapture(e.pointerId); } catch { /* already released */ }
      stage.current?.classList.add("is-dragging");
      setPaused(true);
    }
    if (d.axis !== "x") return;
    d.dx = dx;
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();
    const width = stage.current?.offsetWidth || 1;
    el.style.transform = `translateX(${dx}px)`;
    el.style.opacity = String(1 - Math.min(1, Math.abs(dx) / width) * 0.75);
  };

  const onPointerEnd = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = activeEl();
    drag.current = null;
    if (!d || !el || d.axis !== "x") return;
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const velocity = last.t > first.t ? ((last.x - first.x) / (last.t - first.t)) * 1000 : 0; // px/s
    const width = stage.current?.offsetWidth || 1;
    const projected = d.dx + project(velocity);
    const threshold = width * 0.22;
    const to: 1 | -1 | 0 = e.type === "pointercancel" ? 0 : projected < -threshold ? 1 : projected > threshold ? -1 : 0;
    stage.current?.classList.remove("is-dragging");
    if (!to) {
      // Not far enough: settle back from exactly where it was let go
      el.style.transform = "";
      el.style.opacity = "";
      return;
    }
    // Keep it travelling the way it was thrown, at the finger's pace, while it fades out
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = Math.abs(velocity) > 300 ? Math.min(0.5, Math.max(0.2, 120 / Math.abs(velocity) + 0.15)) : 0.45;
    el.style.transition = `transform ${duration}s var(--ease-settle), opacity ${duration}s ease-out`;
    el.style.transform = reduce ? "" : `translateX(${d.dx + Math.sign(d.dx) * 90}px)`;
    el.style.opacity = "0";
    window.setTimeout(() => { el.style.transition = ""; el.style.transform = ""; el.style.opacity = ""; }, duration * 1000 + 80);
    setUserControlled(true);
    haptic();
    go((iRef.current + (to === 1 ? 1 : -1) + n) % n, to);
  };

  return (
    <div className="rotator" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div
        ref={stage}
        className="rotator__stage"
        style={{ "--dir": dir } as CSSProperties}
        aria-live={paused || userControlled ? "polite" : "off"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
      >
        {items.map((t, k) => (
          <figure key={t.name} className={`rotator__item${k === i ? " is-active" : k === leaving ? " is-leaving" : ""}`} aria-hidden={k !== i}>
            <blockquote>“{t.message}”</blockquote>
            <figcaption>
              <span className="quote__face"><Photo src={t.image ?? undefined} alt="" label={t.name} sizes="56px" /></span>
              <span><cite>{t.name}</cite><span className="role">{t.category}</span></span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="rotator__dots" role="group" aria-label="Choose a testimonial">
        {items.map((t, k) => (
          <button
            key={t.name}
            type="button"
            aria-label={`Quote from ${t.name}`}
            aria-pressed={k === i}
            onClick={() => {
              setUserControlled(true);
              // Travel the short way round
              const forward = (k - i + n) % n;
              go(k, forward <= n / 2 ? 1 : -1);
            }}
          />
        ))}
      </div>
    </div>
  );
}
