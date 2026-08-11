import { makeRng } from "./rng";

export type ClusterShape = "pair" | "grid" | "fib" | "radial";
export type ActivationMode = "grow" | "always-on" | "ambient";

export type ClusterConfig = {
  id: string;
  sectionId: string;
  shape: ClusterShape;
  center: [number, number, number];
  direction?: [number, number, number];
  baseCount: number;
  scatterRadius: number;
  structuredRadius: number;
  activation: ActivationMode;
  secondForm?: ClusterShape;
  flickerEdgeCount?: number;
  localWindow?: [number, number];
};

export const CLUSTERS: ClusterConfig[] = [
  {
    id: "origin",
    sectionId: "origin",
    shape: "pair",
    center: [0, 0, 0],
    baseCount: 2,
    scatterRadius: 1.6,
    structuredRadius: 0.9,
    activation: "grow",
  },
  {
    id: "zenox",
    sectionId: "zenox",
    shape: "fib",
    center: [-3.2, -0.5, -7],
    baseCount: 60,
    scatterRadius: 3.4,
    structuredRadius: 2.1,
    activation: "grow",
  },
  {
    id: "rbesports",
    sectionId: "rb-esports",
    shape: "fib",
    center: [3.2, -1.0, -13],
    baseCount: 55,
    scatterRadius: 3.2,
    structuredRadius: 2.0,
    activation: "grow",
    flickerEdgeCount: 2,
  },
  {
    id: "idfc",
    sectionId: "idfc",
    shape: "grid",
    center: [-2.8, 0.6, -19],
    baseCount: 70,
    scatterRadius: 3.6,
    structuredRadius: 2.4,
    activation: "grow",
  },
  {
    id: "fino-core",
    sectionId: "fino",
    shape: "grid",
    center: [2.2, 1.0, -26],
    baseCount: 90,
    scatterRadius: 2.6,
    structuredRadius: 2.3,
    activation: "always-on",
    secondForm: "fib",
    localWindow: [0.05, 0.7],
  },
  {
    id: "fino-arm-dmt",
    sectionId: "fino",
    shape: "radial",
    center: [2.2, 1.0, -26],
    direction: [1, 0.32, -0.42],
    baseCount: 16,
    scatterRadius: 0.6,
    structuredRadius: 2.8,
    activation: "grow",
    localWindow: [0.55, 1],
  },
  {
    id: "fino-arm-aeps",
    sectionId: "fino",
    shape: "radial",
    center: [2.2, 1.0, -26],
    direction: [-0.82, 0.5, -0.28],
    baseCount: 15,
    scatterRadius: 0.6,
    structuredRadius: 2.6,
    activation: "grow",
    localWindow: [0.58, 1],
  },
  {
    id: "fino-arm-cards",
    sectionId: "fino",
    shape: "radial",
    center: [2.2, 1.0, -26],
    direction: [0.32, -0.72, -0.5],
    baseCount: 14,
    scatterRadius: 0.6,
    structuredRadius: 2.4,
    activation: "grow",
    localWindow: [0.6, 1],
  },
  {
    id: "fino-arm-rails",
    sectionId: "fino",
    shape: "radial",
    center: [2.2, 1.0, -26],
    direction: [-0.4, -0.6, 0.62],
    baseCount: 14,
    scatterRadius: 0.6,
    structuredRadius: 2.3,
    activation: "grow",
    localWindow: [0.62, 1],
  },
  {
    id: "fino-arm-coreflow",
    sectionId: "fino",
    shape: "radial",
    center: [2.2, 1.0, -26],
    direction: [0.68, 0.58, 0.52],
    baseCount: 13,
    scatterRadius: 0.6,
    structuredRadius: 2.2,
    activation: "grow",
    localWindow: [0.64, 1],
  },
  {
    id: "fino-arm-governance",
    sectionId: "fino",
    shape: "radial",
    center: [2.2, 1.0, -26],
    direction: [-0.88, -0.22, -0.68],
    baseCount: 13,
    scatterRadius: 0.6,
    structuredRadius: 2.5,
    activation: "grow",
    localWindow: [0.66, 1],
  },
  {
    id: "ambient",
    sectionId: "hero",
    shape: "fib",
    center: [-1, 0, -15],
    baseCount: 100,
    scatterRadius: 20,
    structuredRadius: 20,
    activation: "ambient",
  },
];

export const ARM_TO_EXPERTISE: Record<string, string> = {
  "fino-arm-dmt": "dmt",
  "fino-arm-aeps": "aeps",
  "fino-arm-cards": "cards",
  "fino-arm-rails": "rails",
  "fino-arm-coreflow": "core",
  "fino-arm-governance": "governance",
};

type Vec3 = [number, number, number];

function fibonacciSphere(count: number, radius: number, rng: () => number, jitter: number): Vec3[] {
  const pts: Vec3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / Math.max(1, count - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const rad = radius * (0.72 + 0.28 * rng());
    pts.push([
      x * rad + (rng() - 0.5) * jitter,
      y * rad + (rng() - 0.5) * jitter,
      z * rad + (rng() - 0.5) * jitter,
    ]);
  }
  return pts;
}

function gridPoints(count: number, radius: number, rng: () => number, jitter: number): Vec3[] {
  const dim = Math.max(2, Math.ceil(Math.cbrt(count)));
  const pts: Vec3[] = [];
  const step = (radius * 2) / (dim - 1 || 1);
  outer: for (let ix = 0; ix < dim; ix++) {
    for (let iy = 0; iy < dim; iy++) {
      for (let iz = 0; iz < dim; iz++) {
        if (pts.length >= count) break outer;
        pts.push([
          -radius + ix * step + (rng() - 0.5) * jitter,
          -radius + iy * step + (rng() - 0.5) * jitter,
          -radius + iz * step + (rng() - 0.5) * jitter,
        ]);
      }
    }
  }
  return pts;
}

function radialPoints(count: number, direction: Vec3, length: number, rng: () => number): Vec3[] {
  const len = Math.hypot(...direction) || 1;
  const dir: Vec3 = [direction[0] / len, direction[1] / len, direction[2] / len];
  const perpA = normalize(cross(dir, Math.abs(dir[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]));
  const perpB = cross(dir, perpA);
  const pts: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / count;
    const wobble = (rng() - 0.5) * 0.35 * (0.4 + t);
    const wobble2 = (rng() - 0.5) * 0.35 * (0.4 + t);
    pts.push([
      dir[0] * length * t + perpA[0] * wobble + perpB[0] * wobble2,
      dir[1] * length * t + perpA[1] * wobble + perpB[1] * wobble2,
      dir[2] * length * t + perpA[2] * wobble + perpB[2] * wobble2,
    ]);
  }
  return pts;
}

function cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function normalize(v: Vec3): Vec3 {
  const l = Math.hypot(...v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

function shapePoints(shape: ClusterShape, count: number, radius: number, rng: () => number, direction?: Vec3): Vec3[] {
  if (shape === "pair") {
    return [
      [-radius * 0.5, 0, 0],
      [radius * 0.5, 0.1, 0.05],
    ];
  }
  if (shape === "grid") return gridPoints(count, radius, rng, radius * 0.12);
  if (shape === "radial") return radialPoints(count, direction ?? [0, 0, -1], radius, rng);
  return fibonacciSphere(count, radius, rng, radius * 0.1);
}

function scatterPoints(count: number, radius: number, rng: () => number): Vec3[] {
  const pts: Vec3[] = [];
  for (let i = 0; i < count; i++) {
    const theta = rng() * Math.PI * 2;
    const phi = Math.acos(2 * rng() - 1);
    const r = radius * Math.cbrt(rng());
    pts.push([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)]);
  }
  return pts;
}

export type NetworkData = {
  count: number;
  scatter: Float32Array;
  structuredA: Float32Array;
  structuredB: Float32Array;
  clusterIndex: Uint16Array;
  nodePhase: Float32Array;
  edgeA: Uint16Array;
  edgeB: Uint16Array;
  edgeCluster: Uint16Array;
  edgeStart: Float32Array;
  edgeFlicker: Uint8Array;
  edgeCount: number;
};

export function buildNetwork(scale: number, seed = 1337): NetworkData {
  const rng = makeRng(seed);

  const scatterAll: Vec3[] = [];
  const structAAll: Vec3[] = [];
  const structBAll: Vec3[] = [];
  const clusterIdxAll: number[] = [];
  const phaseAll: number[] = [];

  const edgeA: number[] = [];
  const edgeB: number[] = [];
  const edgeCluster: number[] = [];
  const edgeStart: number[] = [];
  const edgeFlicker: number[] = [];

  CLUSTERS.forEach((cluster, ci) => {
    const min = cluster.shape === "pair" ? 2 : cluster.activation === "ambient" ? 10 : 6;
    const count = Math.max(min, Math.round(cluster.baseCount * (cluster.activation === "ambient" ? Math.max(scale, 0.3) : scale)));

    const scatter = cluster.activation === "ambient"
      ? shapePoints("fib", count, cluster.scatterRadius, rng)
      : scatterPoints(count, cluster.scatterRadius, rng);
    const structA = shapePoints(cluster.shape, count, cluster.structuredRadius, rng, cluster.direction);
    const structB = cluster.secondForm
      ? shapePoints(cluster.secondForm, count, cluster.structuredRadius, rng, cluster.direction)
      : structA;

    const base = scatterAll.length;
    for (let i = 0; i < count; i++) {
      const [sx, sy, sz] = scatter[i];
      const [ax, ay, az] = structA[i];
      const [bx, by, bz] = structB[i];
      scatterAll.push([sx + cluster.center[0], sy + cluster.center[1], sz + cluster.center[2]]);
      structAAll.push([ax + cluster.center[0], ay + cluster.center[1], az + cluster.center[2]]);
      structBAll.push([bx + cluster.center[0], by + cluster.center[1], bz + cluster.center[2]]);
      clusterIdxAll.push(ci);
      phaseAll.push(rng());
    }

    if (cluster.activation === "ambient") {
      // Ambient dust never connects — it's texture, not part of the graph.
    } else if (cluster.shape === "pair") {
      edgeA.push(base);
      edgeB.push(base + 1);
      edgeCluster.push(ci);
      edgeStart.push(0.3);
      edgeFlicker.push(0);
    } else {
      const k = 2;
      const seen = new Set<string>();
      for (let i = 0; i < count; i++) {
        const dists: { j: number; d: number }[] = [];
        for (let j = 0; j < count; j++) {
          if (i === j) continue;
          const [ax, ay, az] = structA[i];
          const [bx, by, bz] = structA[j];
          const d = (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2;
          dists.push({ j, d });
        }
        dists.sort((p, q) => p.d - q.d);
        for (let n = 0; n < Math.min(k, dists.length); n++) {
          const j = dists[n].j;
          const key = i < j ? `${i}-${j}` : `${j}-${i}`;
          if (seen.has(key)) continue;
          seen.add(key);
          edgeA.push(base + i);
          edgeB.push(base + j);
          edgeCluster.push(ci);
          edgeStart.push(0.32 + rng() * 0.55);
          edgeFlicker.push(0);
        }
      }
    }
  });

  // Mark a few RB Esports edges as "lockdown" flicker edges.
  const rbClusterIndex = CLUSTERS.findIndex((c) => c.id === "rbesports");
  if (rbClusterIndex >= 0) {
    let marked = 0;
    const want = CLUSTERS[rbClusterIndex].flickerEdgeCount ?? 0;
    for (let i = 0; i < edgeCluster.length && marked < want; i++) {
      if (edgeCluster[i] === rbClusterIndex) {
        edgeFlicker[i] = 1;
        marked++;
      }
    }
  }

  const n = scatterAll.length;
  const scatter = new Float32Array(n * 3);
  const structuredA = new Float32Array(n * 3);
  const structuredB = new Float32Array(n * 3);
  const clusterIndex = new Uint16Array(n);
  const nodePhase = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    scatter[i * 3] = scatterAll[i][0];
    scatter[i * 3 + 1] = scatterAll[i][1];
    scatter[i * 3 + 2] = scatterAll[i][2];
    structuredA[i * 3] = structAAll[i][0];
    structuredA[i * 3 + 1] = structAAll[i][1];
    structuredA[i * 3 + 2] = structAAll[i][2];
    structuredB[i * 3] = structBAll[i][0];
    structuredB[i * 3 + 1] = structBAll[i][1];
    structuredB[i * 3 + 2] = structBAll[i][2];
    clusterIndex[i] = clusterIdxAll[i];
    nodePhase[i] = phaseAll[i];
  }

  return {
    count: n,
    scatter,
    structuredA,
    structuredB,
    clusterIndex,
    nodePhase,
    edgeA: Uint16Array.from(edgeA),
    edgeB: Uint16Array.from(edgeB),
    edgeCluster: Uint16Array.from(edgeCluster),
    edgeStart: Float32Array.from(edgeStart),
    edgeFlicker: Uint8Array.from(edgeFlicker),
    edgeCount: edgeA.length,
  };
}
