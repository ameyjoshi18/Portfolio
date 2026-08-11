"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { CLUSTERS, ARM_TO_EXPERTISE, buildNetwork, NetworkData } from "./network-data";
import { nodeVertexShader, nodeFragmentShader, edgeVertexShader, edgeFragmentShader } from "./shaders";
import { currentSectionProgress } from "@/lib/scroll-engine";

const EXPERTISE_ORDER = ["dmt", "aeps", "cards", "rails", "core", "governance"];

const INK_DIM = new THREE.Color("#2a3140");
const COPPER = new THREE.Color("#e8823c");
const tmpColor = new THREE.Color();

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function triangularWeight(local: number, slotIndex: number, slots: number) {
  const center = (slotIndex + 0.5) / slots;
  const dist = Math.abs(local - center);
  return 1 - smoothstep(dist / (0.62 / slots));
}

export function Network({ scale }: { scale: number }) {
  const data: NetworkData = useMemo(() => buildNetwork(scale), [scale]);

  const nodePositions = useMemo(() => new Float32Array(data.scatter), [data]);
  const nodeColors = useMemo(() => new Float32Array(data.count * 3), [data]);
  const nodeActivation = useMemo(() => new Float32Array(data.count), [data]);
  const clusterGrow = useMemo(() => new Float32Array(CLUSTERS.length), []);
  const clusterDisplay = useMemo(() => new Float32Array(CLUSTERS.length), []);

  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(nodePositions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(nodeColors, 3));
    geo.setAttribute("aActivation", new THREE.BufferAttribute(nodeActivation, 1));
    return geo;
  }, [nodePositions, nodeColors, nodeActivation]);

  const pointsMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: nodeVertexShader,
        fragmentShader: nodeFragmentShader,
        uniforms: { uBaseSize: { value: 18 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  const edgePositions = useMemo(() => new Float32Array(data.edgeCount * 2 * 3), [data]);
  const edgeColors = useMemo(() => new Float32Array(data.edgeCount * 2 * 3), [data]);
  const edgeT = useMemo(() => {
    const arr = new Float32Array(data.edgeCount * 2);
    for (let i = 0; i < data.edgeCount; i++) {
      arr[i * 2] = 0;
      arr[i * 2 + 1] = 1;
    }
    return arr;
  }, [data]);
  const edgeActivation = useMemo(() => new Float32Array(data.edgeCount * 2), [data]);

  const edgeGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    geo.setAttribute("aColor", new THREE.BufferAttribute(edgeColors, 3));
    geo.setAttribute("aT", new THREE.BufferAttribute(edgeT, 1));
    geo.setAttribute("aActivation", new THREE.BufferAttribute(edgeActivation, 1));
    return geo;
  }, [edgePositions, edgeColors, edgeT, edgeActivation]);

  const edgeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: edgeVertexShader,
        fragmentShader: edgeFragmentShader,
        uniforms: { uTime: { value: 0 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useEffect(() => {
    return () => {
      pointsGeometry.dispose();
      pointsMaterial.dispose();
      edgeGeometry.dispose();
      edgeMaterial.dispose();
    };
  }, [pointsGeometry, pointsMaterial, edgeGeometry, edgeMaterial]);

  const frameCount = useRef(0);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    edgeMaterial.uniforms.uTime.value = t;

    const expertiseLocal = currentSectionProgress("expertise");
    const inExpertise = expertiseLocal > 0 && expertiseLocal < 1;

    for (let ci = 0; ci < CLUSTERS.length; ci++) {
      const cluster = CLUSTERS[ci];
      if (cluster.activation === "ambient") {
        clusterGrow[ci] = 1;
        clusterDisplay[ci] = 0.28;
        continue;
      }
      const [lo, hi] = cluster.localWindow ?? [0, 1];
      const raw = currentSectionProgress(cluster.sectionId);
      const windowed = lo === hi ? raw : (raw - lo) / (hi - lo);
      const grow = smoothstep(windowed);
      clusterGrow[ci] = grow;
      // "always-on" clusters (the live core) are either fully connected or not
      // in the graph yet at all — never dim-and-scattered before their section.
      const hasEntered = raw > 0;

      let display = cluster.activation === "always-on" ? (hasEntered ? 1 : 0) : 0.28 + 0.52 * grow;

      if (inExpertise) {
        const expertiseKey = ARM_TO_EXPERTISE[cluster.id];
        if (expertiseKey) {
          const slot = EXPERTISE_ORDER.indexOf(expertiseKey);
          const weight = triangularWeight(expertiseLocal, slot, EXPERTISE_ORDER.length);
          display = Math.max(display, display + (1 - display) * weight);
        }
      }
      clusterDisplay[ci] = display;
    }

    for (let i = 0; i < data.count; i++) {
      const ci = data.clusterIndex[i];
      const cluster = CLUSTERS[ci];
      const grow = clusterGrow[ci];
      const i3 = i * 3;

      if (cluster.activation === "ambient") {
        nodePositions[i3] = data.scatter[i3];
        nodePositions[i3 + 1] = data.scatter[i3 + 1];
        nodePositions[i3 + 2] = data.scatter[i3 + 2];
      } else {
        const morphLocal = cluster.secondForm
          ? smoothstep((grow - 0.15) / 0.7)
          : 0;
        for (let k = 0; k < 3; k++) {
          const structured = cluster.secondForm
            ? data.structuredA[i3 + k] + (data.structuredB[i3 + k] - data.structuredA[i3 + k]) * morphLocal
            : data.structuredA[i3 + k];
          nodePositions[i3 + k] = data.scatter[i3 + k] + (structured - data.scatter[i3 + k]) * grow;
        }
      }

      const phase = data.nodePhase[i];
      const stagger = smoothstep((grow - phase * 0.3));
      let activation = cluster.activation === "ambient"
        ? 0.18 + 0.12 * (0.5 + 0.5 * Math.sin(t * 0.3 + phase * 6.283))
        : clusterDisplay[ci] * (0.4 + 0.6 * stagger);

      nodeActivation[i] = activation;
      tmpColor.copy(INK_DIM).lerp(COPPER, activation);
      nodeColors[i3] = tmpColor.r;
      nodeColors[i3 + 1] = tmpColor.g;
      nodeColors[i3 + 2] = tmpColor.b;
    }

    for (let e = 0; e < data.edgeCount; e++) {
      const ci = data.edgeCluster[e];
      const a = data.edgeA[e];
      const b = data.edgeB[e];
      const grow = clusterGrow[ci];
      const cluster = CLUSTERS[ci];

      let strength: number;
      if (cluster.activation === "always-on") {
        strength = clusterDisplay[ci];
      } else {
        const ramp = smoothstep((grow - data.edgeStart[e]) / 0.18);
        strength = clusterDisplay[ci] * ramp;
      }

      if (data.edgeFlicker[e] === 1) {
        const flickerT = currentSectionProgress(cluster.sectionId);
        if (flickerT > 0.35 && flickerT < 0.6) {
          const dip = 1 - smoothstep(Math.abs(flickerT - 0.475) / 0.125);
          strength *= 1 - dip * 0.92;
        }
      }

      const e6 = e * 6;
      const e2 = e * 2;
      const a3 = a * 3;
      const b3 = b * 3;
      edgePositions[e6] = nodePositions[a3];
      edgePositions[e6 + 1] = nodePositions[a3 + 1];
      edgePositions[e6 + 2] = nodePositions[a3 + 2];
      edgePositions[e6 + 3] = nodePositions[b3];
      edgePositions[e6 + 4] = nodePositions[b3 + 1];
      edgePositions[e6 + 5] = nodePositions[b3 + 2];

      edgeActivation[e2] = strength;
      edgeActivation[e2 + 1] = strength;

      tmpColor.copy(INK_DIM).lerp(COPPER, strength);
      edgeColors[e6] = tmpColor.r;
      edgeColors[e6 + 1] = tmpColor.g;
      edgeColors[e6 + 2] = tmpColor.b;
      edgeColors[e6 + 3] = tmpColor.r;
      edgeColors[e6 + 4] = tmpColor.g;
      edgeColors[e6 + 5] = tmpColor.b;
    }

    pointsGeometry.attributes.position.needsUpdate = true;
    pointsGeometry.attributes.aColor.needsUpdate = true;
    pointsGeometry.attributes.aActivation.needsUpdate = true;
    edgeGeometry.attributes.position.needsUpdate = true;
    edgeGeometry.attributes.aColor.needsUpdate = true;
    edgeGeometry.attributes.aActivation.needsUpdate = true;

    frameCount.current++;
  });

  return (
    <group>
      <points geometry={pointsGeometry} material={pointsMaterial} frustumCulled={false} />
      <lineSegments geometry={edgeGeometry} material={edgeMaterial} frustumCulled={false} />
    </group>
  );
}
