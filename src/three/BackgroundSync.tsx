"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Color, Fog } from "three";
import { resolveStateBlend, holdThenCrossfade } from "./state-blend";
import { scrollState } from "@/lib/scroll-engine";
import { SECTION_IDS, SECTION_BG } from "./sections";

const STATE_COLORS = SECTION_IDS.map((id) => new Color(SECTION_BG[id]));

/**
 * Keeps the canvas background exactly in step with the DOM section background
 * behind it, so the 3D scene and the page read as one surface, not a canvas
 * with content stacked on top.
 */
export function BackgroundSync() {
  const { scene } = useThree();
  const current = useRef(new Color(SECTION_BG.hero));

  if (!scene.background) scene.background = current.current;
  if (!scene.fog) scene.fog = new Fog(current.current.getHex(), 10, 30);

  useFrame(() => {
    const blend = resolveStateBlend(scrollState.progress, scrollState.sections);
    current.current.copy(STATE_COLORS[blend.from]).lerp(STATE_COLORS[blend.to], holdThenCrossfade(blend.t));
    (scene.background as Color).copy(current.current);
    if (scene.fog instanceof Fog) scene.fog.color.copy(current.current);
  });

  return null;
}
