"use client";

import { useEffect, useState, type ReactNode } from "react";

/** The site header's <header>, hidden while the visitor scrolls down and shown again as soon as they scroll up. */
export function AutoHideHeader({ children }: { children: ReactNode }) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return; // ignore jitter and trackpad nudges
      setHidden(y > last && y > 80); // never hide while the header still sits in its place at the top
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <header className="site-header" data-hidden={hidden || undefined}>{children}</header>;
}
