import type { DmtRailModel, RailNode } from "@/content/experience";

type RailLayout = "desktop" | "mobile";

function assertUnique(values: readonly string[], label: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

export function validateRailModel(model: DmtRailModel): void {
  if (model.verification !== "confirmed") {
    throw new Error("Rail data must be confirmed before publication");
  }
  if (model.nodes.length < 2) {
    throw new Error("Rail data requires at least two nodes");
  }

  assertUnique(
    model.nodes.map(({ id }) => id),
    "rail node id",
  );
  assertUnique(
    model.legs.map(({ id }) => id),
    "rail leg id",
  );

  const nodeIds = new Set(model.nodes.map(({ id }) => id));
  for (const leg of model.legs) {
    if (!nodeIds.has(leg.from) || !nodeIds.has(leg.to)) {
      throw new Error(`Rail leg ${leg.id} references an unknown node`);
    }
  }
}

export function getRailPoints(
  nodes: readonly RailNode[],
  layout: RailLayout,
): ReadonlyArray<readonly [number, number]> {
  const [width, height] = layout === "desktop" ? [1000, 400] : [300, 1000];
  return nodes.map((node) => {
    const [x, y] = node[layout];
    return [(x / 100) * width, (y / 100) * height] as const;
  });
}

export function buildRailPath(
  nodes: readonly RailNode[],
  layout: RailLayout,
): string {
  const points = getRailPoints(nodes, layout);
  if (points.length === 0) return "";

  let path = `M ${points[0][0]} ${points[0][1]}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const midpoint = (previous[0] + current[0]) / 2;
    path += ` C ${midpoint} ${previous[1]}, ${midpoint} ${current[1]}, ${current[0]} ${current[1]}`;
  }
  return path;
}
