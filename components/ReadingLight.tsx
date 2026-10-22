"use client";

import { useEffect, useRef, useState } from "react";

const KEY = "rh-reading-light";

/**
 * "Light page" for blog posts: the article body switches to dark text on warm paper, easier for long reading in
 * daylight. The rest of the site stays dark. The choice is remembered on this device.
 */
export function ReadingLight() {
  const btn = useRef<HTMLButtonElement>(null);
  const [light, setLight] = useState(false);

  useEffect(() => {
    try { setLight(localStorage.getItem(KEY) === "1"); } catch { /* storage blocked: stay dark */ }
  }, []);

  useEffect(() => {
    const section = btn.current?.closest(".section--post");
    if (light) section?.setAttribute("data-light", "");
    else section?.removeAttribute("data-light");
  }, [light]);

  const toggle = () => {
    const next = !light;
    setLight(next);
    try { localStorage.setItem(KEY, next ? "1" : "0"); } catch { /* not remembered, still works */ }
  };

  return (
    <button ref={btn} type="button" className="reading-light" aria-pressed={light} onClick={toggle}>
      <span aria-hidden="true" className="reading-light__dot" />
      {light ? "Dark page" : "Light page"}
    </button>
  );
}
