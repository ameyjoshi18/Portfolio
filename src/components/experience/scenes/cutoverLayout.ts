import { cutoverWorkstreams } from "@/content/experience";

export type Orientation = "horizontal" | "vertical";

export type TrackId = (typeof cutoverWorkstreams)[number]["id"];

export const TRACK_IDS = cutoverWorkstreams.map((stream) => stream.id) as TrackId[];

/**
 * Deliberately uneven — the vendor lag blocking the gate is the whole point
 * of the animation, not a synchronization bug.
 */
export const COMPLETE_AT: Record<TrackId, number> = {
  business: 0.2,
  engineering: 0.32,
  infrastructure: 0.46,
  qa: 0.62,
  vendors: 0.9,
};

export const SYNC_AT = 0.9;
export const GATE_OPEN_AT = 0.95;
export const CHECKPOINT_FRACTIONS = [0.25, 0.5, 0.75, 1];

type Point = { x: number; y: number };

export type TrackLayout = {
  id: TrackId;
  start: Point;
  checkpoints: Point[];
  labelAnchor: Point;
  labelAngle: number;
};

export type CutoverLayout = {
  orientation: Orientation;
  viewBox: string;
  tracks: TrackLayout[];
  gate: { x1: number; y1: number; x2: number; y2: number };
  gateLabelAnchor: Point;
  release: Point;
  releaseLabelAnchor: Point;
  pulseLine: { x1: number; y1: number; x2: number; y2: number };
};

const ALONG_START = 70;
const CROSS_START = 60;
const CROSS_END = 460;
const CROSS_STEP = (CROSS_END - CROSS_START) / (TRACK_IDS.length - 1);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function buildLayout(orientation: Orientation): CutoverLayout {
  const alongGate = orientation === "horizontal" ? 940 : 900;
  const gateLine = alongGate + 40;
  const alongRelease = orientation === "horizontal" ? 1150 : 1090;
  const crossMid = (CROSS_START + CROSS_END) / 2;

  const toPoint = (along: number, cross: number): Point =>
    orientation === "horizontal" ? { x: along, y: cross } : { x: cross, y: along };

  const tracks: TrackLayout[] = TRACK_IDS.map((id, index) => {
    const cross = CROSS_START + index * CROSS_STEP;
    const start = toPoint(ALONG_START, cross);
    const checkpoints = CHECKPOINT_FRACTIONS.map((fraction) =>
      toPoint(lerp(ALONG_START, alongGate, fraction), cross),
    );
    const labelAnchor =
      orientation === "horizontal"
        ? { x: ALONG_START - 18, y: cross + 4 }
        : { x: cross, y: ALONG_START - 22 };
    return { id, start, checkpoints, labelAnchor, labelAngle: 0 };
  });

  const gateCrossStart = CROSS_START - 28;
  const gateCrossEnd = CROSS_END + 28;
  const gate =
    orientation === "horizontal"
      ? { x1: gateLine, y1: gateCrossStart, x2: gateLine, y2: gateCrossEnd }
      : { x1: gateCrossStart, y1: gateLine, x2: gateCrossEnd, y2: gateLine };

  const gateLabelAnchor = toPoint(gateLine, gateCrossStart - 14);
  const release = toPoint(alongRelease, crossMid);
  const releaseLabelAnchor =
    orientation === "horizontal"
      ? { x: alongRelease, y: crossMid + 34 }
      : { x: crossMid, y: alongRelease + 34 };

  const pulseLine =
    orientation === "horizontal"
      ? { x1: gateLine, y1: crossMid, x2: alongRelease, y2: crossMid }
      : { x1: crossMid, y1: gateLine, x2: crossMid, y2: alongRelease };

  const viewBox = orientation === "horizontal" ? "0 0 1240 520" : "0 0 520 1220";

  return { orientation, viewBox, tracks, gate, gateLabelAnchor, release, releaseLabelAnchor, pulseLine };
}

export function trackFillFraction(id: TrackId, progress: number): number {
  const completeAt = COMPLETE_AT[id];
  return Math.min(1, Math.max(0, progress / completeAt));
}

export function readyCount(progress: number): number {
  return TRACK_IDS.filter((id) => progress >= COMPLETE_AT[id]).length;
}

export function captionFor(progress: number): string {
  if (progress >= GATE_OPEN_AT) return "Release window open";
  const ready = readyCount(progress);
  if (ready >= 5) return "5 of 5 ready";
  if (ready === 4) return "4 of 5 ready — held";
  return `${ready} of 5 ready`;
}

export function releaseFraction(progress: number): number {
  return Math.min(1, Math.max(0, (progress - GATE_OPEN_AT) / (1 - GATE_OPEN_AT)));
}

export type Phase = "filling" | "synced" | "open";

export function phaseFor(progress: number): Phase {
  if (progress >= GATE_OPEN_AT) return "open";
  if (progress >= SYNC_AT) return "synced";
  return "filling";
}
