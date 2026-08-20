"use client";

import { useEffect, useState } from "react";

import type { Orientation } from "@/components/experience/scenes/cutoverLayout";

export function useOrientation(breakpoint = 760): Orientation {
  const [orientation, setOrientation] = useState<Orientation>("horizontal");

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const update = () => setOrientation(media.matches ? "vertical" : "horizontal");
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [breakpoint]);

  return orientation;
}
