"use client";

import { Canvas } from "@react-three/fiber";
import { Network } from "./Network";
import { CameraRig } from "./CameraRig";

export function Scene({ tier, dpr }: { tier: "full" | "reduced"; dpr: [number, number] }) {
  const scale = tier === "full" ? 1 : 0.3;

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 1, 9], fov: 55, near: 0.1, far: 80 }}
      shadows={false}
    >
      <color attach="background" args={["#0b0e13"]} />
      <fog attach="fog" args={["#0b0e13", 14, 42]} />
      <Network scale={scale} />
      <CameraRig />
    </Canvas>
  );
}
