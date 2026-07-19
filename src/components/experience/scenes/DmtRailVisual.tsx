"use client";

import {
  animate,
  useMotionValue,
  useMotionValueEvent,
} from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

import type { DmtRailModel } from "@/content/experience";
import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";
import { useMotionPolicy } from "@/hooks/useMotionPolicy";
import { buildRailPath, getRailPoints } from "@/lib/rail/geometry";

import styles from "./rails-scene.module.css";

type DmtRailVisualProps = {
  model: DmtRailModel;
};

export function DmtRailVisual({ model }: DmtRailVisualProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const basePathRef = useRef<SVGPathElement>(null);
  const activePathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGCircleElement>(null);
  const [mobile, setMobile] = useState(false);
  const [inView, setInView] = useState(false);
  const visible = useDocumentVisibility();
  const policy = useMotionPolicy();
  const progress = useMotionValue(0);
  const layout = mobile ? "mobile" : "desktop";
  const path = useMemo(() => buildRailPath(model.nodes, layout), [layout, model.nodes]);
  const points = useMemo(() => getRailPoints(model.nodes, layout), [layout, model.nodes]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(max-width: 760px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.45 },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useMotionValueEvent(progress, "change", (latest) => {
    const basePath = basePathRef.current;
    const activePath = activePathRef.current;
    const marker = markerRef.current;
    if (!basePath || !activePath || !marker) return;

    const length = basePath.getTotalLength();
    const point = basePath.getPointAtLength(length * latest);
    marker.setAttribute("cx", String(point.x));
    marker.setAttribute("cy", String(point.y));
    activePath.style.strokeDashoffset = String(1 - latest);
  });

  useEffect(() => {
    if (!inView || !visible || policy.dom !== "full") return;
    const remaining = 1 - progress.get();
    if (remaining <= 0) return;
    const controls = animate(progress, 1, {
      duration: 2.8 * remaining,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [inView, policy.dom, progress, visible]);

  const [firstX = 0, firstY = 0] = points[0] ?? [];
  const viewBox = mobile ? "0 0 300 1000" : "0 0 1000 400";

  return (
    <div className={styles.visual} ref={wrapperRef}>
      <svg viewBox={viewBox} aria-hidden="true" focusable="false">
        <path className={styles.basePath} d={path} ref={basePathRef} />
        <path
          className={styles.activePath}
          d={path}
          pathLength="1"
          ref={activePathRef}
        />
        {points.map(([x, y], index) => (
          <g key={model.nodes[index].id}>
            <circle className={styles.nodeHalo} cx={x} cy={y} r="17" />
            <circle className={styles.nodeCore} cx={x} cy={y} r="5" />
          </g>
        ))}
        <circle
          className={styles.flowMarker}
          cx={firstX}
          cy={firstY}
          r="8"
          ref={markerRef}
          data-static={policy.dom === "resolved" ? "true" : undefined}
        />
      </svg>
    </div>
  );
}
