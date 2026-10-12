"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * A hero slide that waits until the page has finished loading (and the browser is idle) before it
 * fetches its photo. The first one shows about five seconds in, so there's time; meanwhile the page's
 * own content gets the bandwidth. The slide's fade timing runs in CSS from the start either way.
 */
export function DeferredSlide({ src, sizes }: { src: string; sizes: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // With reduced motion only the first photo is ever shown, so the rest never load
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let idle: number | undefined;
    const go = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => setReady(true));
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      if (idle !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idle);
    };
  }, []);
  return ready ? <Image src={src} alt="" fill sizes={sizes} loading="eager" fetchPriority="low" /> : null;
}
