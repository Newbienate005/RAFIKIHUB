import { flushSync } from "react-dom";

/**
 * Runs a React state update inside a View Transition, so elements glide from where they were to where
 * they end up (spatial continuity) instead of jumping. Each moving element needs a unique
 * `view-transition-name`. Falls back to a plain update where unsupported or with reduced motion.
 */
export function withViewTransition(update: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduce) return update();
  doc.startViewTransition(() => flushSync(update));
}

/** A light tap on phones that support vibration, for meaningful moments only (a swipe that commits). */
export function haptic() {
  try { navigator.vibrate?.(8); } catch { /* not supported */ }
}
