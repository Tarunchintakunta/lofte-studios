import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` warns during SSR. Motion setup must run before paint (so a
 * "from" animation never flashes its resolved state first), so on the client we
 * want the layout effect and on the server a no-op.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** True when the visitor has asked the OS to reduce motion. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
