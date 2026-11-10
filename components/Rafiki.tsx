"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { DashboardRole } from "@/lib/dashboard";

/**
 * Rafiki: a short walkthrough of the dashboard, shown once per dashboard per browser.
 * Three rules: keep it short, go in the order people actually use it, and only show it once
 * the thing it points at is on screen (each step points at a section link in the sidebar or phone bar).
 */
type Step = { tab: string; kicker: string; title: string; text: string };
const steps: Record<DashboardRole, Step[]> = {
  performer: [
    { tab: "cv", kicker: "First", title: "Make your profile shine", text: "Add your photos, credits and skills in Edit CV. Casting directors see your profile before anything else." },
    { tab: "opportunities", kicker: "Then", title: "Find your next role", text: "Opportunities lists the open castings that fit you. Apply in one tap." },
    { tab: "agents", kicker: "Last", title: "Bring your agent", text: "Link your agent in My agents so they can put you forward for castings too." },
  ],
  casting: [
    { tab: "castings", kicker: "First", title: "See who applied", text: "My castings shows each of your castings and everyone who applied. Shortlist and book auditions from there." },
    { tab: "talent", kicker: "Then", title: "Find talent", text: "Search members by name, category, city and language, then open their profiles." },
    { tab: "roster", kicker: "Last", title: "Grow your roster", text: "Approve performers who ask you to represent them, then submit them to open castings." },
  ],
};

const SEEN = (role: DashboardRole) => `rafiki:${role}:v1`;
const seen = (role: DashboardRole) => { try { return localStorage.getItem(SEEN(role)) === "1"; } catch { return false; } };
const markSeen = (role: DashboardRole) => { try { localStorage.setItem(SEEN(role), "1"); } catch { /* private mode: it may show again */ } };

/** The section link a step points at, if it's actually on screen. */
function targetFor(tab: string) {
  const el = document.querySelector<HTMLElement>(`.dash-sections [data-tab="${tab}"]`);
  const r = el?.getBoundingClientRect();
  return el && r && r.width > 0 && r.height > 0 ? el : null;
}

export function Rafiki({ role }: { role: DashboardRole }) {
  const [list, setList] = useState<Step[]>([]);
  const [i, setI] = useState(0);
  const [pos, setPos] = useState<React.CSSProperties | null>(null);
  const next = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  // Only steps whose link exists (agents only get "My talents"); start once the page has painted
  useEffect(() => {
    if (seen(role)) return;
    const t = window.setTimeout(() => {
      const ready = steps[role].filter((s) => targetFor(s.tab));
      if (ready.length) setList(ready);
    }, 700);
    return () => window.clearTimeout(t);
  }, [role]);

  const step = list[i];
  const done = useCallback(() => { markSeen(role); setList([]); }, [role]);

  // Sit beside the link in the sidebar, or above it in the phone bar, and ring the link
  useLayoutEffect(() => {
    if (!step) return;
    const el = targetFor(step.tab);
    if (!el) { done(); return; }
    el.classList.add("is-rafiki-target");
    const place = () => {
      const r = el.getBoundingClientRect();
      const phone = window.innerWidth <= 900;
      setPos(phone
        ? { left: 12, right: 12, bottom: window.innerHeight - r.top + 12 }
        : { left: r.right + 16, top: Math.max(16, Math.min(r.top - 24, window.innerHeight - 260)) });
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => { el.classList.remove("is-rafiki-target"); window.removeEventListener("resize", place); window.removeEventListener("scroll", place); };
  }, [step, done]);

  useEffect(() => {
    if (!step) return;
    next.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") done(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, done]);

  if (!step || !pos) return null;
  const last = i === list.length - 1;
  return (
    <div className="rafiki" role="dialog" aria-labelledby={titleId} style={pos}>
      <p className="rafiki__kicker"><span className="rafiki__name">Rafiki</span> · {step.kicker}</p>
      <h2 id={titleId} className="rafiki__title">{step.title}</h2>
      <p className="rafiki__text">{step.text}</p>
      <div className="rafiki__foot">
        <span className="rafiki__dots" aria-label={`Step ${i + 1} of ${list.length}`}>
          {list.map((s, n) => <span key={s.tab} className={n === i ? "is-on" : undefined} />)}
        </span>
        <button type="button" className="rafiki__skip" onClick={done}>{last ? "Close" : "Skip"}</button>
        <button ref={next} type="button" className="btn btn--sun btn--sm" onClick={() => (last ? done() : setI(i + 1))}>
          {last ? "Done" : "Next"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
