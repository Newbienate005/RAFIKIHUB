"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { drawerGroups } from "@/lib/site";

/** Slide-in side menu for phones and tablets, grouped like the old site's header and footer. */
export function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (open) closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open]);

  return (
    <>
      <button ref={openRef} type="button" className="menu-button" aria-label="Open menu" aria-expanded={open} aria-controls="drawer" onClick={() => setOpen(true)}>
        <span /><span /><span />
      </button>
      <div className={`drawer-scrim${open ? " is-open" : ""}`} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="drawer" className={`drawer${open ? " is-open" : ""}`} aria-label="Menu" aria-hidden={!open} inert={!open}>
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
