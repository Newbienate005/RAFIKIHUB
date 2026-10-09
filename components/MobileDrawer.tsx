"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { drawerGroups } from "@/lib/site";
import { haptic } from "@/lib/view-transition";

/** Where a flick would come to rest (Apple's scroll-deceleration projection), in px from the release point. */
const project = (velocity: number, rate = 0.998) => ((velocity / 1000) * rate) / (1 - rate);

/** Past a boundary, follow less and less the further the finger goes: a soft edge, not a wall. */
const rubberband = (over: number, size: number, c = 0.55) => (over * size * c) / (size + c * Math.abs(over));

type Drag = { id: number; x0: number; y0: number; offset: number; axis: "x" | "y" | null; samples: { x: number; t: number }[] };

/**
 * Slide-in side menu for phones and tablets, grouped like the old site's header and footer.
 * Swipe it left to close: it tracks the finger 1:1, the scrim follows, and a flick throws it shut.
 */
export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Drag | null>(null);
  const swallowClick = useRef(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);

  const setDragging = (on: boolean) => {
    drawerRef.current?.classList.toggle("is-dragging", on);
    scrimRef.current?.classList.toggle("is-dragging", on);
  };

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (!open || (e.pointerType === "mouse" && e.button !== 0)) return;
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, offset: 0, axis: null, samples: [{ x: e.clientX, t: e.timeStamp }] };
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const el = drawerRef.current;
    if (!d || !el || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.axis) {
      // A little hysteresis before committing, so vertical scrolling inside the menu still works
      if (Math.hypot(dx, dy) < 10) return;
      d.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (d.axis === "y") return;
      try { el.setPointerCapture(e.pointerId); } catch { /* the pointer was already released */ }
      setDragging(true);
    }
    if (d.axis !== "x") return;
    const width = el.offsetWidth;
    // Left closes it (1:1, as far as fully closed); right is past its open position, so it resists
    d.offset = dx <= 0 ? Math.max(dx, -width) : rubberband(dx, width);
    d.samples.push({ x: e.clientX, t: e.timeStamp });
    while (d.samples.length > 2 && e.timeStamp - d.samples[0].t > 100) d.samples.shift();
    el.style.transform = `translateX(${d.offset}px)`;
    if (scrimRef.current) scrimRef.current.style.opacity = String(Math.max(0, 1 + Math.min(0, d.offset) / width));
  };

  const onPointerEnd = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    const el = drawerRef.current;
    drag.current = null;
    if (!d || !el || d.axis !== "x") return;
    swallowClick.current = true; // the drag shouldn't also count as a tap on a link
    window.setTimeout(() => { swallowClick.current = false; }, 0); // …but only the click that ends this drag
    const first = d.samples[0];
    const last = d.samples[d.samples.length - 1];
    const velocity = last.t > first.t ? ((last.x - first.x) / (last.t - first.t)) * 1000 : 0; // px/s
    const width = el.offsetWidth;
    // Decide from where the gesture was going, not just where it stopped
    const close = e.type !== "pointercancel" && d.offset + project(velocity) < -width / 2;
    // Hand the finger's speed to the settle: a fast flick finishes fast, a slow release eases out
    const remaining = close ? width + d.offset : Math.abs(d.offset);
    const duration = Math.abs(velocity) > 200 ? Math.min(0.42, Math.max(0.16, remaining / Math.abs(velocity))) : 0.42;
    el.style.transitionDuration = `${duration}s`;
    if (scrimRef.current) scrimRef.current.style.transitionDuration = `${duration}s`;
    setDragging(false);
    // Aim the transition straight at the end state, starting from exactly where the drawer is now
    el.style.transform = close ? "translateX(-100%)" : "";
    if (scrimRef.current) scrimRef.current.style.opacity = close ? "0" : "";
    if (close) { haptic(); setOpen(false); openRef.current?.focus(); }
    window.setTimeout(() => {
      el.style.transitionDuration = "";
      el.style.transform = "";
      if (scrimRef.current) { scrimRef.current.style.transitionDuration = ""; scrimRef.current.style.opacity = ""; }
    }, duration * 1000 + 50);
  };

  return (
    <>
      <button ref={openRef} type="button" className="menu-button" aria-label="Open menu" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
        <span /><span /><span />
      </button>
      <div ref={scrimRef} className={`drawer-scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside
        ref={drawerRef}
        id="drawer"
        className={`drawer${open ? " is-open" : ""}`}
        aria-label="Menu"
        aria-hidden={!open}
        inert={!open}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={(e) => { if (swallowClick.current) { e.preventDefault(); e.stopPropagation(); swallowClick.current = false; } }}
      >
        <div className="drawer__head">
          <span className="wordmark wordmark--light" aria-label="RafikiHub">RAFIKI<span>HUB</span></span>
          <button ref={closeRef} type="button" className="drawer__close" aria-label="Close menu" onClick={() => { setOpen(false); openRef.current?.focus(); }}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
        </div>
        <nav aria-label="Mobile">
          {drawerGroups.map((g) => (
            <div key={g.label} className="drawer__group">
              <h2>{g.label}</h2>
              <ul>
                {g.items.map((i) => (
                  <li key={i.href + i.label}>
                    <Link href={i.href} aria-current={pathname === i.href ? "page" : undefined}>{i.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
