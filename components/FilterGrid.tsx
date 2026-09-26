"use client";

import { useState, type ReactNode } from "react";

/** Filter chips over a grid. Every item stays in the HTML so search engines see them all. */
export function FilterGrid({ label, allLabel = "All", items }: { label: string; allLabel?: string; items: { key: string; group: string; node: ReactNode }[] }) {
  const [active, setActive] = useState(allLabel);
  const groups = [allLabel, ...Array.from(new Set(items.map((i) => i.group)))];
  const shown = items.filter((i) => active === allLabel || i.group === active).length;
  return (
    <>
      {groups.length > 2 ? (
        <div className="filter" role="group" aria-label={label}>
          {groups.map((g) => (
            <button key={g} type="button" className="chip" aria-pressed={active === g} onClick={() => setActive(g)}>{g}</button>
          ))}
        </div>
      ) : null}
      <p className="sr-only" aria-live="polite">{shown} shown</p>
      <div className="cards">
        {items.map((i) => (
          <div key={i.key} hidden={active !== allLabel && i.group !== active}>{i.node}</div>
        ))}
      </div>
    </>
  );
}
