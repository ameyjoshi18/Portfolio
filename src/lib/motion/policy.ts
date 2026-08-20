export type MotionPolicyInput = {
  reducedMotion: boolean;
  saveData: boolean;
  viewportWidth: number;
  hardwareConcurrency?: number;
  deviceMemory?: number;
};

export type MotionPolicy = {
  dom: "full" | "resolved";
  cutover: "animated" | "static";
};

export const staticMotionPolicy: MotionPolicy = {
  dom: "resolved",
  cutover: "static",
};

/**
 * The cutover diagram is hand-written SVG driven by scroll progress and a
 * handful of DOM writes per frame — cheap enough for phones. It only falls
 * back to static for the genuinely low-end tier (old low-core/low-memory
 * devices), not for viewport width or WebGL support, neither of which it
 * needs.
 */
export function resolveMotionPolicy(input: MotionPolicyInput): MotionPolicy {
  if (input.reducedMotion || input.saveData) {
    return staticMotionPolicy;
  }

  const lowEndDevice =
    (input.hardwareConcurrency ?? 8) < 2 || (input.deviceMemory ?? 8) < 2;

  return {
    dom: input.viewportWidth >= 1024 ? "full" : "resolved",
    cutover: lowEndDevice ? "static" : "animated",
  };
}
