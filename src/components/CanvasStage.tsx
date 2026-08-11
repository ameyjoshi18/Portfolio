"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { resolveQualityTier, TIER_SETTINGS, QualityTier } from "@/lib/device";
import { initScrollEngine } from "@/lib/scroll-engine";
import { FallbackScene } from "./FallbackScene";

export const SECTION_IDS = [
  "hero",
  "portrait",
  "origin",
  "zenox",
  "rb-esports",
  "idfc",
  "fino",
  "expertise",
  "contact",
];

const Scene = dynamic(() => import("@/three/Scene").then((m) => m.Scene), { ssr: false });

export function CanvasStage() {
  const [tier, setTier] = useState<QualityTier | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const resolved = resolveQualityTier();
    setTier(resolved);
    if (resolved === "off") return;
    const cleanup = initScrollEngine(SECTION_IDS);
    // A brief settle window lets the first scroll measurement and a few camera
    // frames land before the scene is visible — avoids a startup pop/flash.
    const revealTimer = window.setTimeout(() => setReady(true), 900);
    return () => {
      cleanup();
      window.clearTimeout(revealTimer);
    };
  }, []);

  const isLive = tier === "full" || tier === "reduced";

  return (
    <div className="fixed inset-0 z-0" aria-hidden="true">
      {isLive ? (
        <div
          style={{
            opacity: ready ? 1 : 0,
            transition: "opacity 700ms ease-out",
            width: "100%",
            height: "100%",
          }}
        >
          {tier && <Scene tier={tier} dpr={TIER_SETTINGS[tier].dpr} />}
        </div>
      ) : (
        <FallbackScene />
      )}
    </div>
  );
}
