"use client";

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { DashboardRole } from "@/lib/dashboard";

/**
 * Rafiki: a walkthrough of every section of the dashboard, shown once per dashboard per browser.
 * Each step points at a section link that is already on screen (sidebar, or the bottom bar on phones),
 * goes in the order the sections appear, and lists what a member can do there.
 */
type Step = { tab: string; title: string; text: string; points: string[] };
const steps: Record<DashboardRole, Step[]> = {
  performer: [
    { tab: "home", title: "Home", text: "Your account at a glance.", points: [
      "See your plan and when it ends, and pay or renew by M-Pesa",
      "Follow the checklist to finish your profile",
      "Keep your name, phone and country up to date",
      "Young performers and pets: upload the documents we need",
      "Rate a headshot or audition session you booked",
    ] },
    { tab: "opportunities", title: "Opportunities", text: "Castings you can apply for.", points: [
      "Browse open castings that fit your category and country",
      "Apply in one tap; the casting director gets your profile",
      "Track each application: new, shortlisted or audition booked",
      "Withdraw an application, or rate a casting you applied to",
    ] },
    { tab: "media", title: "My media", text: "What casting directors look at first.", points: [
      "Upload headshots; the first one is your main photo",
      "Add showreels: upload a video or paste a YouTube or Vimeo link",
      "Add voice clips for voice-over work",
    ] },
    { tab: "cv", title: "Edit CV", text: "The details casting directors search.", points: [
      "Playing age, height, appearance and measurements",
      "Credits, training, and skills with your level in each",
      "Name, photos, bio, reels and social links are in Edit my profile, on Home",
    ] },
    { tab: "agents", title: "My agents", text: "Let an agent put you forward.", points: [
      "Ask an agent on RafikiHub to represent you",
      "See who has approved you, and remove a link any time",
      "Looking for an agent? Read about RafikiHub Talent Management",
    ] },
  ],
  casting: [
    { tab: "home", title: "Overview", text: "Your account at a glance.", points: [
      "See your castings and how many people applied",
      "Post a new casting",
      "Pay or renew your plan by M-Pesa",
      "Keep your name, phone and country up to date",
    ] },
    { tab: "castings", title: "My castings", text: "Every casting you posted and who applied.", points: [
      "See each casting's status",
      "Move applicants along: new, shortlisted, audition booked or not selected",
      "Open an applicant's profile; they're emailed when their status changes",
      "Rate performers you worked with",
    ] },
    { tab: "talent", title: "Find talent", text: "Search the RafikiHub talent database.", points: [
      "Search by name, category, city, and language or accent",
      "Open any profile to see photos, reels and credits",
    ] },
    { tab: "roster", title: "My talents", text: "Your agency's roster.", points: [
      "Approve performers who ask you to represent them, or remove them",
      "Submit approved clients to open castings; they're emailed each time",
    ] },
  ],
};

const SEEN = (role: DashboardRole) => `rafiki:${role}:v2`;
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
  const card = useRef<HTMLDivElement>(null);
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
    el.scrollIntoView({ block: "nearest", inline: "nearest" });
    const place = () => {
      const r = el.getBoundingClientRect();
      const h = card.current?.offsetHeight ?? 320;
      setPos(window.innerWidth <= 900
        ? { left: 12, right: 12, bottom: window.innerHeight - r.top + 12 }
        : { left: r.right + 16, top: Math.max(16, Math.min(r.top - 24, window.innerHeight - h - 16)) });
    };
    place();
    const again = requestAnimationFrame(place); // once the card has its real height
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => { cancelAnimationFrame(again); el.classList.remove("is-rafiki-target"); window.removeEventListener("resize", place); window.removeEventListener("scroll", place); };
  }, [step, done]);

  useEffect(() => {
    if (!step) return;
    next.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") done(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, done]);

  if (!step) return null;
  const last = i === list.length - 1;
  return (
    <div ref={card} className="rafiki" role="dialog" aria-labelledby={titleId} style={pos ?? { visibility: "hidden" }}>
      <button type="button" className="rafiki__close" onClick={done} aria-label="Close the tour"><span aria-hidden="true">✕</span></button>
      <p className="rafiki__kicker"><span className="rafiki__name">Rafiki</span> · {i + 1} of {list.length}</p>
      <h2 id={titleId} className="rafiki__title">{step.title}</h2>
      <p className="rafiki__text">{step.text}</p>
      <ul className="rafiki__points">{step.points.map((p) => <li key={p}>{p}</li>)}</ul>
      <div className="rafiki__foot">
        <span className="rafiki__dots" aria-hidden="true">
          {list.map((s, n) => <span key={s.tab} className={n === i ? "is-on" : undefined} />)}
        </span>
        {i > 0 ? <button type="button" className="rafiki__skip" onClick={() => setI(i - 1)}>Back</button> : <button type="button" className="rafiki__skip" onClick={done}>Skip</button>}
        <button ref={next} type="button" className="btn btn--sun btn--sm" onClick={() => (last ? done() : setI(i + 1))}>
          {last ? "Done" : "Next"} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
