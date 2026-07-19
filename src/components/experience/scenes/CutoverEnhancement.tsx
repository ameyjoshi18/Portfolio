"use client";

import dynamic from "next/dynamic";
import type { MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import type { MotionPolicy } from "@/lib/motion/policy";

import { CutoverErrorBoundary } from "./CutoverErrorBoundary";
import styles from "./cutover-scene.module.css";

const LazyCutoverCanvas = dynamic(() => import("./CutoverCanvas"), {
  loading: () => null,
  ssr: false,
});

type CutoverEnhancementProps = {
  policy: MotionPolicy;
  progress: MotionValue<number>;
};

export function CutoverEnhancement({
  policy,
  progress,
}: CutoverEnhancementProps) {
  const proximityRef = useRef<HTMLDivElement>(null);
  const [nearScene, setNearScene] = useState(false);
  const documentVisible = useDocumentVisibility();

  useEffect(() => {
    const target = proximityRef.current;

    if (
      policy.cutover !== "webgl" ||
      !target ||
      !("IntersectionObserver" in window)
    ) {
      setNearScene(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setNearScene(entry.isIntersecting),
      { rootMargin: "300px 0px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [policy.cutover]);

  const shouldRender =
    policy.cutover === "webgl" && nearScene && documentVisible;

  return (
    <div className={styles.enhancementProbe} ref={proximityRef} aria-hidden="true">
      {shouldRender ? (
        <div className={styles.canvasHost} data-canvas-host>
          <CutoverErrorBoundary>
            <LazyCutoverCanvas progress={progress} />
          </CutoverErrorBoundary>
        </div>
      ) : null}
    </div>
  );
}
