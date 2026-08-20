"use client";

import { useEffect } from "react";

/**
 * One global pointermove listener drives the specular highlight on every
 * .glass surface, instead of each card wiring its own. Touch devices never
 * fire pointermove with a persistent hover position, so this is inert there
 * by default — no separate touch branch needed.
 */
export function GlassPointerTracker() {
  useEffect(() => {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let activeEl: HTMLElement | null = null;

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const target = event.target as HTMLElement | null;
      const glassEl = target?.closest<HTMLElement>(".glass") ?? null;

      if (glassEl !== activeEl) {
        activeEl?.style.removeProperty("--mx");
        activeEl?.style.removeProperty("--my");
        activeEl = glassEl;
      }

      if (!glassEl) return;
      const rect = glassEl.getBoundingClientRect();
      const mx = ((event.clientX - rect.left) / rect.width) * 100;
      const my = ((event.clientY - rect.top) / rect.height) * 100;
      glassEl.style.setProperty("--mx", `${mx}%`);
      glassEl.style.setProperty("--my", `${my}%`);
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
