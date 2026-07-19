import { motionTokens } from "@/lib/motion/tokens";

it("enforces the Drift, Align and Flow bounds", () => {
  expect(motionTokens.drift.maxDistance).toBeLessThanOrEqual(32);
  expect(motionTokens.align.minDuration).toBeGreaterThanOrEqual(0.48);
  expect(motionTokens.align.maxDuration).toBeLessThanOrEqual(0.7);
  expect(motionTokens.flow.maxConcurrent).toBe(1);
});
