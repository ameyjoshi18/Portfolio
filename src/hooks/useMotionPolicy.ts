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

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") || canvas.getContext("webgl"),
    );
  } catch {
    return false;
  }
}

export function useMotionPolicy(): MotionPolicy {
  const [policy, setPolicy] = useState<MotionPolicy>(staticMotionPolicy);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const capabilities = navigator as NavigatorCapabilities;

    const update = () => {
      setPolicy(
        resolveMotionPolicy({
          reducedMotion: media.matches,
          saveData: Boolean(capabilities.connection?.saveData),
          viewportWidth: window.innerWidth,
          webgl: supportsWebGL(),
          hardwareConcurrency: capabilities.hardwareConcurrency,
          deviceMemory: capabilities.deviceMemory,
        }),
      );
    };

    update();
    media.addEventListener("change", update);
    window.addEventListener("resize", update, { passive: true });

    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return policy;
}
