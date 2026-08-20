"use client";

import { useEffect } from "react";

const MAX_TILT_DEG = 5;

/**
 * One global pointermove listener drives the specular highlight on every
 * .glass surface, and the cursor tilt on every .glass.tile surface, instead
 * of each card wiring its own. Touch devices never fire pointermove with a
 * persistent hover position, so this is inert there by default — no
 * separate touch branch needed.
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

    function clear(el: HTMLElement | null) {
      el?.style.removeProperty("--mx");
      el?.style.removeProperty("--my");
      el?.style.removeProperty("--tilt-x");
      el?.style.removeProperty("--tilt-y");
    }

    function onPointerMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const target = event.target as HTMLElement | null;
      const glassEl = target?.closest<HTMLElement>(".glass") ?? null;

      if (glassEl !== activeEl) {
        clear(activeEl);
        activeEl = glassEl;
      }

      if (!glassEl) return;
      const rect = glassEl.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      glassEl.style.setProperty("--mx", `${(nx + 0.5) * 100}%`);
      glassEl.style.setProperty("--my", `${(ny + 0.5) * 100}%`);

      if (glassEl.classList.contains("tile")) {
        glassEl.style.setProperty("--tilt-y", `${nx * 2 * MAX_TILT_DEG}deg`);
        glassEl.style.setProperty("--tilt-x", `${-ny * 2 * MAX_TILT_DEG}deg`);
      }
    }

    document.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
