"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { resolveCameraFrame } from "./camera-path";
import { scrollState } from "@/lib/scroll-engine";

export function CameraRig() {
  const { camera } = useThree();
  const smoothedPos = useRef(new THREE.Vector3(0, 1, 9));
  const smoothedLook = useRef(new THREE.Vector3(0, 0, 0));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const frame = resolveCameraFrame(scrollState.progress, scrollState.sections);
    targetPos.current.set(...frame.pos);
    targetLook.current.set(...frame.look);

    const lerpFactor = 1 - Math.pow(0.001, delta);
    smoothedPos.current.lerp(targetPos.current, lerpFactor);
    smoothedLook.current.lerp(targetLook.current, lerpFactor);

    camera.position.copy(smoothedPos.current);
    camera.lookAt(smoothedLook.current);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov += (frame.fov - camera.fov) * lerpFactor;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
