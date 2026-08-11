export type QualityTier = "full" | "reduced" | "off";

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Decides whether the WebGL scene renders at all, and at what quality tier.
 * "off" covers no-WebGL and prefers-reduced-motion — both get the static fallback.
 */
export function resolveQualityTier(): QualityTier {
  if (typeof window === "undefined") return "off";
  if (prefersReducedMotion()) return "off";
  if (!hasWebGL()) return "off";

  const cores = navigator.hardwareConcurrency ?? 4;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (narrow || coarsePointer || cores <= 4) return "reduced";
  return "full";
}

export const TIER_SETTINGS = {
  full: {
    nodeCount: 560,
    ambientNodeCount: 90,
    dpr: [1, 2] as [number, number],
    edgeUpdateEveryFrame: true,
  },
  reduced: {
    nodeCount: 170,
    ambientNodeCount: 20,
    dpr: [1, 1.5] as [number, number],
    edgeUpdateEveryFrame: false,
  },
  off: {
    nodeCount: 0,
    ambientNodeCount: 0,
    dpr: [1, 1] as [number, number],
    edgeUpdateEveryFrame: false,
  },
} as const;
