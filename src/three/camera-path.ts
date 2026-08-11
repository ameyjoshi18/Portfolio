import type { StateBlend } from "./state-blend";

export type CameraFrame = { pos: [number, number, number]; look: [number, number, number]; fov: number };

// One keyframe per state (see sections.ts / rails-data.ts) — directed, never
// free-orbiting. Uses the same from/to/t blend as the blocks and background,
// so camera, geometry and color can never drift out of sync with each other.
export const CAMERA_KEYFRAMES: CameraFrame[] = [
  { pos: [0, 1.2, 8.2], look: [0, 0.3, -1], fov: 50 }, // hero
  { pos: [0, 0.8, 6.5], look: [0, 0, -2.5], fov: 45 }, // portrait
  { pos: [2, 1.2, 6], look: [0.5, 0.4, -3], fov: 48 }, // now
  { pos: [-1.4, 0.8, 7.5], look: [0.5, 0, -2], fov: 38 }, // expertise
  { pos: [-1.5, 0.6, 6], look: [0, 0.2, -1], fov: 50 }, // building
  { pos: [-2, 1.5, 6.5], look: [2, 0, -2], fov: 44 }, // story-teaser
  { pos: [0, 1.3, 6], look: [0, 0, -1.5], fov: 46 }, // contact
];

function lerp3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function resolveCameraFrame(blend: StateBlend): CameraFrame {
  const a = CAMERA_KEYFRAMES[blend.from];
  const b = CAMERA_KEYFRAMES[blend.to];
  return {
    pos: lerp3(a.pos, b.pos, blend.t),
    look: lerp3(a.look, b.look, blend.t),
    fov: a.fov + (b.fov - a.fov) * blend.t,
  };
}
