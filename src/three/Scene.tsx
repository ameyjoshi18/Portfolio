"use client";

import { Canvas } from "@react-three/fiber";
import { Blocks } from "./Blocks";
import { CameraRig } from "./CameraRig";
import { BackgroundSync } from "./BackgroundSync";

export function Scene({ tier, dpr }: { tier: "full" | "reduced"; dpr: [number, number] }) {
  const scale = tier === "full" ? 1 : 0.35;

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 1.2, 8.2], fov: 50, near: 0.1, far: 60 }}
      shadows={false}
    >
      <BackgroundSync />
      <Blocks scale={scale} />
      <CameraRig />
    </Canvas>
  );
}
