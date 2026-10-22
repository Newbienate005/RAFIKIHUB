"use client";

import { useRef, useState } from "react";
import type { Testimonial } from "@/lib/data";
import { Photo } from "./Photo";

/** Quotes longer than this are cut to a few lines with "Read more", as on the old site */
const LONG = 170;

/**
 * "Happy members", laid out like the old rafikihub.com: a row of cards, each with a round photo, the quote,
 * the name in orange and "– role –". Swipe or scroll the row (it snaps card by card); the arrows do the same
 * for mouse and keyboard users. Nothing moves on its own.
 */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const row = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<Set<string>>(new Set());
  const page = (d: 1 | -1) => {
    const el = row.current;
    const card = el?.querySelector("li");
    if (el && card) el.scrollBy({ left: d * (card.getBoundingClientRect().width + 20), behavior: "smooth" });
  };

  return (
    <div className="tcards">
      <ul ref={row} className="tcards__row" aria-label="Testimonials from members">
        {items.map((t) => {
          const long = t.message.length > LONG;
          const shown = open.has(t.name);
          return (
            <li key={t.name} className="tcard">
              <span className="tcard__face"><Photo src={t.image ?? undefined} alt="" label={t.name} sizes="96px" /></span>
              <blockquote className={`tcard__quote${long && !shown ? " is-clamped" : ""}`}>“{t.message}”</blockquote>
              {long ? (
                <button type="button" className="tcard__more" aria-expanded={shown} onClick={() => setOpen((s) => { const n = new Set(s); if (n.has(t.name)) n.delete(t.name); else n.add(t.name); return n; })}>
                  {shown ? "Show less" : "Read more"}
                </button>
              ) : null}
              <p className="tcard__name">{t.name}</p>
              {t.category ? <p className="tcard__role">– {t.category} –</p> : null}
            </li>
          );
        })}
      </ul>
      {items.length > 1 ? (
        <div className="tcards__nav">
          <button type="button" className="tcards__arrow" aria-label="Previous testimonials" onClick={() => page(-1)}>←</button>
          <button type="button" className="tcards__arrow" aria-label="Next testimonials" onClick={() => page(1)}>→</button>
        </div>
      ) : null}
    </div>
  );
}
