"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { MathUtils, Vector3, PerspectiveCamera } from "three";
import { resolveCameraFrame } from "./camera-path";
import { resolveStateBlend } from "./state-blend";
import { scrollState } from "@/lib/scroll-engine";

// Every camera keyframe (and every block layout) was placed by eye against a
// ~16:10 desktop viewport. A fixed vertical FOV narrows the effective
// *horizontal* view on tall/narrow (mobile) viewports, which pulls the same
// world-space block positions in over the text. Holding horizontal FOV
// constant instead keeps compositions consistent across aspect ratios.
export const REFERENCE_ASPECT = 1440 / 900;

function aspectCorrectedFov(verticalFovDeg: number, aspect: number): number {
  const vFovRef = MathUtils.degToRad(verticalFovDeg);
  const hFovTarget = 2 * Math.atan(Math.tan(vFovRef / 2) * REFERENCE_ASPECT);
  const vFovNew = 2 * Math.atan(Math.tan(hFovTarget / 2) / aspect);
  // Full horizontal-FOV preservation gets fisheye-extreme on very narrow
  // phones — cap it well short of that while still recovering most of the
  // clearance the wider desktop framing relied on.
  return Math.min(92, MathUtils.radToDeg(vFovNew));
}

export function CameraRig() {
  const { camera, size } = useThree();
  const smoothedPos = useRef(new Vector3(0, 1.2, 8.2));
  const smoothedLook = useRef(new Vector3(0, 0.3, -1));
  const targetPos = useRef(new Vector3());
  const targetLook = useRef(new Vector3());

  useFrame((_, delta) => {
    const blend = resolveStateBlend(scrollState.progress, scrollState.sections);
    const frame = resolveCameraFrame(blend);
    targetPos.current.set(...frame.pos);
    targetLook.current.set(...frame.look);

    const lerpFactor = 1 - Math.pow(0.001, delta);
    smoothedPos.current.lerp(targetPos.current, lerpFactor);
    smoothedLook.current.lerp(targetLook.current, lerpFactor);

    camera.position.copy(smoothedPos.current);
    camera.lookAt(smoothedLook.current);
    if (camera instanceof PerspectiveCamera) {
      const aspect = size.width / Math.max(1, size.height);
      const targetFov = aspectCorrectedFov(frame.fov, aspect);
      camera.fov += (targetFov - camera.fov) * lerpFactor;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
