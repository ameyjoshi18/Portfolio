import type { SectionRange } from "@/lib/scroll-engine";
import { SECTION_IDS } from "./sections";

export type StateBlend = { from: number; to: number; t: number };

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

// Text sits on top of the resolved state the whole time it's being read, so
// geometry (and background color) can't drift continuously across a whole
// section's scroll range — the previous/next state's shapes would still be
// mid-transition, overlapping content, right when that content appears.
// This holds each state resolved for most of its section and crossfades only
// in the last stretch, right before the next section takes over.
export function holdThenCrossfade(blendT: number): number {
  return smoothstep((blendT - 0.72) / 0.28);
}

/**
 * Maps global scroll progress to a blend between two adjacent "states" — one
 * state per section, in SECTION_IDS order. Every 3D property (block layout,
 * camera, background color) reads from this single source so nothing drifts
 * out of sync with anything else.
 */
export function resolveStateBlend(progress: number, sections: SectionRange[]): StateBlend {
  const last = SECTION_IDS.length - 1;
  if (sections.length === 0) return { from: 0, to: 0, t: 0 };

  for (let i = 0; i < SECTION_IDS.length; i++) {
    const range = sections.find((s) => s.id === SECTION_IDS[i]);
    if (!range) continue;
    if (progress >= range.start && progress < range.end) {
      const local = range.end > range.start ? (progress - range.start) / (range.end - range.start) : 0;
      return { from: i, to: Math.min(i + 1, last), t: smoothstep(local) };
    }
  }

  if (progress < (sections.find((s) => s.id === SECTION_IDS[0])?.start ?? 0)) {
    return { from: 0, to: 0, t: 0 };
  }
  return { from: last, to: last, t: 0 };
}
