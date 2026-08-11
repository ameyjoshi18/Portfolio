import { SectionRange } from "@/lib/scroll-engine";

export type CameraKeyframe = {
  sectionId: string;
  localT: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

// One directed path through the whole scene. Never free-orbiting — every frame
// is a deterministic blend between two of these hand-placed keyframes.
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { sectionId: "hero", localT: 0, pos: [0, 1.0, 9.0], look: [0, -0.1, 2.0], fov: 55 },
  { sectionId: "portrait", localT: 0, pos: [0.6, 0.5, 6.0], look: [0, 0, -1.0], fov: 48 },
  { sectionId: "origin", localT: 1, pos: [2.1, 0.5, 3.4], look: [0, 0, -0.2], fov: 40 },
  { sectionId: "zenox", localT: 1, pos: [-0.4, -0.1, -7.6], look: [2.4, -0.8, -11.5], fov: 42 },
  { sectionId: "rb-esports", localT: 1, pos: [0.2, 0.7, -13.8], look: [-1.8, 0.5, -18.0], fov: 42 },
  { sectionId: "idfc", localT: 1, pos: [-0.4, 1.5, -19.8], look: [1.6, 1.0, -24.5], fov: 40 },
  { sectionId: "fino", localT: 0.55, pos: [2.6, 1.6, -22.0], look: [2.2, 1.0, -26.0], fov: 40 },
  { sectionId: "fino", localT: 1, pos: [0.5, 3.2, -24.0], look: [2.2, 1.2, -27.5], fov: 50 },
  { sectionId: "expertise", localT: 1, pos: [-0.5, 5.5, -18.0], look: [0.5, 0.5, -22.0], fov: 54 },
  { sectionId: "contact", localT: 1, pos: [0, 8.5, -10.0], look: [0.2, 0.2, -22.0], fov: 58 },
];

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function lerp3(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export type CameraFrame = { pos: [number, number, number]; look: [number, number, number]; fov: number };

const DEFAULT_FRAME: CameraFrame = { pos: [0, 1, 9], look: [0, 0, 0], fov: 55 };

export function resolveCameraFrame(progress: number, sections: SectionRange[]): CameraFrame {
  if (sections.length === 0) return DEFAULT_FRAME;

  const resolved = CAMERA_KEYFRAMES.map((kf) => {
    const range = sections.find((s) => s.id === kf.sectionId);
    const t = range ? range.start + kf.localT * (range.end - range.start) : 0;
    return { t, kf };
  });

  if (progress <= resolved[0].t) return resolved[0].kf;
  if (progress >= resolved[resolved.length - 1].t) return resolved[resolved.length - 1].kf;

  for (let i = 0; i < resolved.length - 1; i++) {
    const a = resolved[i];
    const b = resolved[i + 1];
    if (progress >= a.t && progress <= b.t) {
      const span = b.t - a.t;
      const local = span > 0 ? (progress - a.t) / span : 0;
      const e = smoothstep(local);
      return {
        pos: lerp3(a.kf.pos, b.kf.pos, e),
        look: lerp3(a.kf.look, b.kf.look, e),
        fov: a.kf.fov + (b.kf.fov - a.kf.fov) * e,
      };
    }
  }
  return resolved[resolved.length - 1].kf;
}
