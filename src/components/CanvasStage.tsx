"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { resolveQualityTier, TIER_SETTINGS, QualityTier } from "@/lib/device";
import { initScrollEngine } from "@/lib/scroll-engine";
import { SECTION_IDS } from "@/three/sections";
import { FallbackScene } from "./FallbackScene";

const Scene = dynamic(() => import("@/three/Scene").then((m) => m.Scene), { ssr: false });

export function CanvasStage() {
  const [tier, setTier] = useState<QualityTier | null>(null);
  const [ready, setReady] = useState(false);
  const [mountScene, setMountScene] = useState(false);

  useEffect(() => {
    const resolved = resolveQualityTier();
    setTier(resolved);
    if (resolved === "off") return;
    const cleanup = initScrollEngine([...SECTION_IDS]);

    // Three.js/GSAP/R3F are heavy enough to show up in load-time metrics
    // (TBT/TTI) even though the scene isn't critical content. Deferring the
    // actual mount to an idle moment keeps that cost off the initial paint
    // path without changing what a real visitor sees a moment later.
    const ric: typeof window.requestIdleCallback | undefined = (
      window as unknown as { requestIdleCallback?: typeof window.requestIdleCallback }
    ).requestIdleCallback;
    const idleHandle = ric
      ? ric(() => setMountScene(true), { timeout: 1500 })
      : window.setTimeout(() => setMountScene(true), 150);

    // A brief settle window (after mount) lets the first scroll measurement
    // and a few camera frames land before the scene fades in visibly.
    const revealTimer = window.setTimeout(() => setReady(true), 1050);

    return () => {
      cleanup();
      window.clearTimeout(revealTimer);
      if (ric && (window as unknown as { cancelIdleCallback?: (h: number) => void }).cancelIdleCallback) {
        (window as unknown as { cancelIdleCallback: (h: number) => void }).cancelIdleCallback(
          idleHandle as number
        );
      } else {
        window.clearTimeout(idleHandle as number);
      }
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
          {tier && mountScene && <Scene tier={tier} dpr={TIER_SETTINGS[tier].dpr} />}
        </div>
      ) : (
        <FallbackScene />
      )}
    </div>
  );
}
