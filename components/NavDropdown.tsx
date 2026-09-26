"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavGroup } from "@/lib/site";

/** Hover or click to open; Escape and outside clicks close it. */
export function NavDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const active = group.items.some((i) => pathname === i.href);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <div className="dropdown" ref={ref} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" className={`dropdown__toggle${active ? " is-active" : ""}`} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {group.label}
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" /></svg>
      </button>
      <div className="dropdown__panel" hidden={!open}>
        <ul>
          {group.items.map((i) => (
            <li key={i.href}>
              <Link href={i.href} aria-current={pathname === i.href ? "page" : undefined}>{i.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
