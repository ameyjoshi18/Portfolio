"use client";

import { useEffect, useState } from "react";

import {
  resolveMotionPolicy,
  staticMotionPolicy,
  type MotionPolicy,
} from "@/lib/motion/policy";

type NavigatorCapabilities = Navigator & {
  connection?: { saveData?: boolean };
  deviceMemory?: number;
};

export function useMotionPolicy(): MotionPolicy {
  const [policy, setPolicy] = useState<MotionPolicy>(staticMotionPolicy);

  useEffect(() => {
    const media =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    const capabilities = navigator as NavigatorCapabilities;

    const update = () => {
      setPolicy(
        resolveMotionPolicy({
          reducedMotion: media?.matches ?? false,
          saveData: Boolean(capabilities.connection?.saveData),
          viewportWidth: window.innerWidth,
          hardwareConcurrency: capabilities.hardwareConcurrency,
          deviceMemory: capabilities.deviceMemory,
        }),
      );
    };

    update();
    media?.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      media?.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return policy;
}
