"use client";

import { useEffect, useRef } from "react";

/**
 * Circles one headshot on the contact sheet, chosen at random on each visit. Picked in the browser, since the
 * home page is cached for an hour and a server-side pick would show everyone the same person for that hour.
 */
export function ShortlistPick() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const items = ref.current?.closest("figure")?.querySelectorAll<HTMLLIElement>(".sheet__grid > li");
    if (items?.length) items[Math.floor(Math.random() * items.length)].classList.add("is-picked");
  }, []);
  return <span ref={ref} hidden />;
}
