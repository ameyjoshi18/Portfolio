export type MotionPolicyInput = {
  reducedMotion: boolean;
  saveData: boolean;
  viewportWidth: number;
  webgl: boolean;
  hardwareConcurrency?: number;
  deviceMemory?: number;
};

export type MotionPolicy = {
  dom: "full" | "resolved";
  cutover: "webgl" | "static";
};

export const staticMotionPolicy: MotionPolicy = {
  dom: "resolved",
  cutover: "static",
};

export function resolveMotionPolicy(input: MotionPolicyInput): MotionPolicy {
  if (input.reducedMotion || input.saveData) {
    return staticMotionPolicy;
  }

  const capableDesktop =
    input.viewportWidth >= 1024 &&
    input.webgl &&
    (input.hardwareConcurrency ?? 8) >= 4 &&
    (input.deviceMemory ?? 8) >= 4;

  return {
    dom: input.viewportWidth >= 1024 ? "full" : "resolved",
    cutover: capableDesktop ? "webgl" : "static",
  };
}
