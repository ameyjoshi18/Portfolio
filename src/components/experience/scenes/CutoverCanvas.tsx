"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { cutoverWorkstreams } from "@/content/experience";

import styles from "./cutover-scene.module.css";

type CutoverCanvasProps = {
  progress: MotionValue<number>;
};

type CutoverWorldProps = CutoverCanvasProps;

const xAxis = new THREE.Vector3(1, 0, 0);

function CutoverWorld({ progress }: CutoverWorldProps) {
  const routeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const signalRef = useRef<THREE.Mesh>(null);
  const { invalidate } = useThree();
  const start = useMemo(() => new THREE.Vector3(), []);
  const end = useMemo(() => new THREE.Vector3(), []);
  const midpoint = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  useMotionValueEvent(progress, "change", () => invalidate());

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame(() => {
    const amount = THREE.MathUtils.clamp(progress.get(), 0, 1);

    cutoverWorkstreams.forEach((stream, index) => {
      const route = routeRefs.current[index];
      if (!route) return;

      start.set(-3.7, stream.depth * 0.82, stream.depth * 0.34);
      end.set(
        3.45,
        stream.depth * 0.82 * (1 - amount),
        stream.depth * 0.34 * (1 - amount),
      );
      midpoint.copy(start).add(end).multiplyScalar(0.5);
      direction.copy(end).sub(start);

      route.position.copy(midpoint);
      route.scale.set(direction.length(), 1, 1);
      route.quaternion.setFromUnitVectors(xAxis, direction.normalize());
    });

    if (signalRef.current) {
      signalRef.current.position.x = THREE.MathUtils.lerp(-3.55, 3.45, amount);
      signalRef.current.scale.setScalar(0.8 + amount * 0.35);
    }
  });

  return (
    <>
      <ambientLight intensity={1.4} />

      {cutoverWorkstreams.map((stream, index) => (
        <mesh
          key={stream.id}
          ref={(node) => {
            routeRefs.current[index] = node;
          }}
        >
          <boxGeometry args={[1, 0.026, 0.026]} />
          <meshBasicMaterial
            color="#f2eee5"
            transparent
            opacity={0.38 + index * 0.1}
          />
        </mesh>
      ))}

      <mesh position={[3.45, 0, 0]}>
        <boxGeometry args={[0.018, 4.1, 0.018]} />
        <meshBasicMaterial color="#f2eee5" transparent opacity={0.28} />
      </mesh>

      <mesh ref={signalRef} position={[-3.55, 0, 0.08]}>
        <sphereGeometry args={[0.075, 16, 16]} />
        <meshBasicMaterial color="#e7a11a" />
      </mesh>
    </>
  );
}

export default function CutoverCanvas({ progress }: CutoverCanvasProps) {
  return (
    <Canvas
      className={styles.canvas}
      data-testid="cutover-canvas"
      aria-hidden="true"
      dpr={[1, 1.5]}
      frameloop="demand"
      camera={{ position: [0, 0, 9], fov: 42 }}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
    >
      <CutoverWorld progress={progress} />
    </Canvas>
  );
}
