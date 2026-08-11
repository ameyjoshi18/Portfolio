import { makeRng } from "./rng";

// Palette used by every state's layout. Kept separate from CSS tokens since
// these feed a THREE.Color directly.
export const BLOCK_COLORS = {
  terracotta: "#a83d0d",
  green: "#14663f",
  ink: "#1c1712",
  paper: "#faf4e8",
} as const;

export type ColorKey = keyof typeof BLOCK_COLORS;

export const STATE_COUNT = 7; // hero, portrait, now, expertise, building, story-teaser, contact
export const FEATURED_COUNT = 6; // one per expertise area — reserved instance indices 0..5

export type InstanceState = {
  position: [number, number, number];
  scale: [number, number, number];
  color: ColorKey;
};

export type RailsData = {
  count: number;
  states: InstanceState[][]; // [stateIndex][instanceIndex]
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type Seed = { x: number; y: number; z: number; s: number; c: number };

export function buildRails(scale: number, seed = 4242): RailsData {
  const rng = makeRng(seed);
  const count = Math.max(FEATURED_COUNT + 8, Math.round(70 * scale));

  const seeds: Seed[] = Array.from({ length: count }, () => ({
    x: rng(),
    y: rng(),
    z: rng(),
    s: rng(),
    c: rng(),
  }));

  const states: InstanceState[][] = [];

  // 0 — hero: loose, unresolved scatter, biased to the right of frame so the
  // headline (left-aligned in the DOM) stays clear.
  states.push(
    seeds.map((s, i) => ({
      position: [1.6 + s.x * 6.8, (s.y - 0.5) * 4.2 + 0.4, -2 - s.z * 6],
      scale: [0.14 + s.s * 0.2, 0.14 + s.s * 0.2, 0.14 + s.s * 0.2],
      color: (["terracotta", "green", "ink"] as ColorKey[])[i % 3],
    }))
  );

  // 1 — portrait: blocks recede further to the edges, quiet, small.
  states.push(
    seeds.map((s) => {
      const side = s.x < 0.5 ? -1 : 1;
      return {
        position: [side * (4.4 + s.c * 2.4), (s.y - 0.5) * 4.5, -5 - s.z * 3] as [
          number,
          number,
          number,
        ],
        scale: [0.09 + s.s * 0.12, 0.09 + s.s * 0.12, 0.09 + s.s * 0.12] as [
          number,
          number,
          number,
        ],
        color: "ink" as ColorKey,
      };
    })
  );

  // 2 — now: a confident skyline against the terracotta wash, off to the
  // right so it reads as a skyline, not a wall in front of the copy.
  states.push(
    seeds.map((s, i) => {
      const col = i % 9;
      const row = Math.floor(i / 9);
      const barH = 0.25 + s.s * 0.8;
      return {
        position: [1.6 + col * 0.5, barH / 2 - 4.6, -2 - row * 0.55] as [
          number,
          number,
          number,
        ],
        scale: [0.2, barH, 0.2] as [number, number, number],
        color: (["paper", "ink", "green"] as ColorKey[])[i % 3],
      };
    })
  );

  // 3 — expertise: six featured blocks stacked in the right margin (columns
  // in ExpertiseSection's text run nearly full width, so there is no safe
  // horizontal gap the way there is in the hero — the right edge, pushed back
  // in Z and kept small, is the only place that never sits under a line of
  // text), everything else recedes far back as a dim scattered backdrop.
  states.push(
    seeds.map((s, i) => {
      if (i < FEATURED_COUNT) {
        return {
          position: [5.4, (i - (FEATURED_COUNT - 1) / 2) * 0.62, -2.4] as [
            number,
            number,
            number,
          ],
          scale: [0.2, 0.2, 0.2] as [number, number, number],
          color: (["terracotta", "green"] as ColorKey[])[i % 2],
        };
      }
      return {
        position: [5 + s.x * 3.5, (s.y - 0.5) * 5.5, -9 - s.z * 5] as [number, number, number],
        scale: [0.03 + s.s * 0.04, 0.03 + s.s * 0.04, 0.03 + s.s * 0.04] as [
          number,
          number,
          number,
        ],
        color: "ink" as ColorKey,
      };
    })
  );

  // 4 — building: looser, experimental, bright against the one dark section,
  // biased right of frame again to leave the copy readable.
  states.push(
    seeds.map((s, i) => ({
      position: [2.6 + s.x * 5.4, (s.y - 0.5) * 4, -2.5 - s.z * 5.5],
      scale: [0.08 + s.s * 0.16, 0.08 + s.s * 0.16, 0.08 + s.s * 0.16],
      color: (["terracotta", "green", "paper"] as ColorKey[])[i % 3],
    }))
  );

  // 5 — story teaser: everything gathers into a single thread pointing off-frame.
  states.push(
    seeds.map((s, i) => {
      const t = i / Math.max(1, count - 1);
      return {
        position: [
          lerp(-1.5, 6.5, t) + (s.x - 0.5) * 0.3,
          Math.sin(t * Math.PI * 1.4) * 0.9 + (s.y - 0.5) * 0.25,
          -2 - t * 3.2,
        ] as [number, number, number],
        scale: [0.22 * (1 - t * 0.55), 0.22 * (1 - t * 0.55), 0.22 * (1 - t * 0.55)] as [
          number,
          number,
          number,
        ],
        color: (["paper", "ink", "paper"] as ColorKey[])[i % 3],
      };
    })
  );

  // 6 — contact: calm, near-symmetrical close, off to the right.
  states.push(
    seeds.map((s, i) => {
      const pair = Math.floor(i / 2);
      const side = i % 2 === 0 ? 1 : -1;
      // Clustered near a single fixed offset — depth (z) and a little jitter
      // carry the "count", not an unbounded x spread, or half the instances
      // would drift left into the text column as pair grows.
      return {
        position: [
          4.4 + side * (0.35 + (s.c - 0.5) * 0.5),
          (s.y - 0.5) * 1.3,
          -2 - (pair % 10) * 0.34,
        ] as [number, number, number],
        scale: [0.16 + s.s * 0.1, 0.16 + s.s * 0.1, 0.16 + s.s * 0.1] as [number, number, number],
        color: (["terracotta", "green", "ink"] as ColorKey[])[i % 3],
      };
    })
  );

  return { count, states };
}
