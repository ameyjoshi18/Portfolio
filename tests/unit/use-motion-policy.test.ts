import { vi } from "vitest";

import { createWebGLCapabilityDetector } from "@/hooks/useMotionPolicy";

it("caches WebGL capability instead of creating contexts on every update", () => {
  vi.stubGlobal("WebGLRenderingContext", class WebGLRenderingContext {});
  const getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue({} as WebGL2RenderingContext);
  const detectWebGL = createWebGLCapabilityDetector();

  expect(detectWebGL()).toBe(true);
  expect(detectWebGL()).toBe(true);
  expect(detectWebGL()).toBe(true);
  expect(getContext).toHaveBeenCalledTimes(1);

  getContext.mockRestore();
  vi.unstubAllGlobals();
});
