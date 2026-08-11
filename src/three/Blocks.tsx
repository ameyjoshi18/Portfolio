"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Color,
  Matrix4,
  Vector3,
  Quaternion,
  BoxGeometry,
  ShaderMaterial,
  InstancedMesh,
  MathUtils,
} from "three";
import { buildRails, BLOCK_COLORS, FEATURED_COUNT, RailsData } from "./rails-data";
import { blockVertexShader, blockFragmentShader } from "./shaders";
import { scrollState, currentSectionProgress } from "@/lib/scroll-engine";
import { resolveStateBlend, holdThenCrossfade } from "./state-blend";
import { REFERENCE_ASPECT } from "./CameraRig";

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function triangularWeight(local: number, slotIndex: number, slots: number) {
  const center = (slotIndex + 0.5) / slots;
  const dist = Math.abs(local - center);
  return 1 - smoothstep(dist / (0.62 / slots));
}

const tmpColorA = new Color();
const tmpColorB = new Color();
const tmpColorOut = new Color();
const tmpMatrix = new Matrix4();
const tmpScale = new Vector3();
const tmpPos = new Vector3();
const IDENTITY_QUAT = new Quaternion();

export function Blocks({ scale }: { scale: number }) {
  const data: RailsData = useMemo(() => buildRails(scale), [scale]);

  const geometry = useMemo(() => new BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: blockVertexShader,
        fragmentShader: blockFragmentShader,
      }),
    []
  );

  // Constructed (not JSX-shorthand) so instanceColor exists before the first
  // GPU compile — three.js decides whether to define USE_INSTANCING_COLOR at
  // compile time, and won't pick it up if the attribute appears only later.
  const mesh = useMemo(() => {
    const m = new InstancedMesh(geometry, material, data.count);
    const color = new Color();
    for (let i = 0; i < data.count; i++) {
      const s0 = data.states[0][i];
      tmpMatrix.compose(
        new Vector3(...s0.position),
        IDENTITY_QUAT,
        new Vector3(...s0.scale)
      );
      m.setMatrixAt(i, tmpMatrix);
      color.set(BLOCK_COLORS[s0.color]);
      m.setColorAt(i, color);
    }
    m.frustumCulled = false;
    return m;
  }, [geometry, material, data]);

  const meshRef = useRef<InstancedMesh>(null);
  const { size } = useThree();

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Mobile text runs the full viewport width — there is no safe margin the
    // way a wide desktop column leaves one. Aspect-corrected FOV recovers
    // most of the framing, but on very narrow viewports blocks still need to
    // read as small confetti rather than solid shapes over the copy.
    const aspect = size.width / Math.max(1, size.height);
    const narrowness = MathUtils.clamp((REFERENCE_ASPECT - aspect) / (REFERENCE_ASPECT - 0.45), 0, 1);
    const sizeMul = 1 - narrowness * 0.72;

    const blend = resolveStateBlend(scrollState.progress, scrollState.sections);
    const stateA = data.states[blend.from];
    const stateB = data.states[blend.to];

    const expertiseLocal = currentSectionProgress("expertise");
    const inExpertise = expertiseLocal > 0 && expertiseLocal < 1;
    const nearExpertise = blend.from === 3 || blend.to === 3;

    const geoT = holdThenCrossfade(blend.t);

    for (let i = 0; i < data.count; i++) {
      const a = stateA[i];
      const b = stateB[i];

      tmpPos.set(
        a.position[0] + (b.position[0] - a.position[0]) * geoT,
        a.position[1] + (b.position[1] - a.position[1]) * geoT,
        a.position[2] + (b.position[2] - a.position[2]) * geoT
      );
      let sx = a.scale[0] + (b.scale[0] - a.scale[0]) * geoT;
      let sy = a.scale[1] + (b.scale[1] - a.scale[1]) * geoT;
      let sz = a.scale[2] + (b.scale[2] - a.scale[2]) * geoT;

      if (nearExpertise && inExpertise && i < FEATURED_COUNT) {
        const weight = triangularWeight(expertiseLocal, i, FEATURED_COUNT);
        const boost = 1 + weight * 0.55;
        sx *= boost;
        sy *= boost;
        sz *= boost;
        tmpPos.y += weight * 0.35;
      }

      tmpScale.set(sx * sizeMul, sy * sizeMul, sz * sizeMul);
      tmpMatrix.compose(tmpPos, IDENTITY_QUAT, tmpScale);
      mesh.setMatrixAt(i, tmpMatrix);

      tmpColorA.set(BLOCK_COLORS[a.color]);
      tmpColorB.set(BLOCK_COLORS[b.color]);
      tmpColorOut.copy(tmpColorA).lerp(tmpColorB, geoT);

      mesh.setColorAt(i, tmpColorOut);
    }

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return <primitive object={mesh} ref={meshRef} />;
}
