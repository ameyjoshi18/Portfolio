"use client";

import { useMotionValueEvent } from "motion/react";
import type { MotionValue } from "motion/react";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { cutoverWorkstreams } from "@/content/experience";
import { useOrientation } from "@/hooks/useOrientation";

import {
  CHECKPOINT_FRACTIONS,
  buildLayout,
  captionFor,
  phaseFor,
  releaseFraction,
  trackFillFraction,
  type Phase,
  type TrackId,
} from "./cutoverLayout";
import styles from "./cutover-scene.module.css";

type CutoverAnimatedProps = {
  progress: MotionValue<number>;
};

const LABELS = Object.fromEntries(
  cutoverWorkstreams.map((stream) => [stream.id, stream.label]),
) as Record<TrackId, string>;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function CutoverAnimated({ progress }: CutoverAnimatedProps) {
  const orientation = useOrientation();
  const layout = useMemo(() => buildLayout(orientation), [orientation]);

  const svgRef = useRef<SVGSVGElement>(null);
  const fillRefs = useRef(new Map<TrackId, SVGLineElement>());
  const checkpointRefs = useRef(new Map<string, SVGCircleElement>());
  const pulseRef = useRef<SVGLineElement>(null);
  const releaseRef = useRef<SVGCircleElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const phaseRef = useRef<Phase>("filling");

  const applyState = useCallback(
    (value: number) => {
      const svg = svgRef.current;
      if (!svg) return;

      const phase = phaseFor(value);
      if (phase !== phaseRef.current) {
        phaseRef.current = phase;
        svg.dataset.phase = phase;
      }

      layout.tracks.forEach((track) => {
        const fillFrac = trackFillFraction(track.id, value);
        const end = track.checkpoints[track.checkpoints.length - 1];
        const point = {
          x: lerp(track.start.x, end.x, fillFrac),
          y: lerp(track.start.y, end.y, fillFrac),
        };
        const fillLine = fillRefs.current.get(track.id);
        if (fillLine) {
          fillLine.setAttribute("x2", String(point.x));
          fillLine.setAttribute("y2", String(point.y));
        }

        track.checkpoints.forEach((_, index) => {
          const circle = checkpointRefs.current.get(`${track.id}-${index}`);
          if (!circle) return;
          const lit = fillFrac >= CHECKPOINT_FRACTIONS[index] - 0.001;
          circle.classList.toggle(styles.checkpointLit, lit);
          if (index === track.checkpoints.length - 1) {
            circle.classList.toggle(styles.trackHolding, lit && phase !== "open");
          }
        });
      });

      const release = releaseFraction(value);
      if (pulseRef.current) {
        pulseRef.current.setAttribute(
          "x2",
          String(lerp(layout.pulseLine.x1, layout.pulseLine.x2, release)),
        );
        pulseRef.current.setAttribute(
          "y2",
          String(lerp(layout.pulseLine.y1, layout.pulseLine.y2, release)),
        );
      }
      releaseRef.current?.classList.toggle(styles.releaseLit, release >= 1);

      if (captionRef.current) {
        const text = captionFor(value);
        if (captionRef.current.textContent !== text) {
          captionRef.current.textContent = text;
        }
      }
    },
    [layout],
  );

  useEffect(() => {
    applyState(progress.get());
  }, [applyState, progress]);

  useMotionValueEvent(progress, "change", (latest) => {
    applyState(latest);
  });

  return (
    <div className={styles.animatedVisual} data-testid="cutover-animated">
      <svg
        ref={svgRef}
        viewBox={layout.viewBox}
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        data-phase="filling"
      >
        {layout.tracks.map((track) => {
          const end = track.checkpoints[track.checkpoints.length - 1];
          return (
            <g key={track.id}>
              <line
                className={styles.railLine}
                x1={track.start.x}
                y1={track.start.y}
                x2={end.x}
                y2={end.y}
              />
              <line
                className={styles.fillLine}
                x1={track.start.x}
                y1={track.start.y}
                x2={track.start.x}
                y2={track.start.y}
                ref={(node) => {
                  if (node) fillRefs.current.set(track.id, node);
                }}
              />
              {track.checkpoints.map((point, index) => {
                const isEnd = index === track.checkpoints.length - 1;
                return (
                  <circle
                    key={index}
                    className={isEnd ? styles.trackEnd : styles.checkpoint}
                    cx={point.x}
                    cy={point.y}
                    r={isEnd ? 8 : 5}
                    ref={(node) => {
                      if (node) checkpointRefs.current.set(`${track.id}-${index}`, node);
                    }}
                  />
                );
              })}
              <text
                className={styles.trackLabel}
                x={track.labelAnchor.x}
                y={track.labelAnchor.y}
                textAnchor={orientation === "horizontal" ? "end" : "middle"}
              >
                {LABELS[track.id]}
              </text>
            </g>
          );
        })}

        <line
          className={styles.gateLine}
          x1={layout.gate.x1}
          y1={layout.gate.y1}
          x2={layout.gate.x2}
          y2={layout.gate.y2}
        />
        <text
          className={styles.gateLabel}
          x={layout.gateLabelAnchor.x}
          y={layout.gateLabelAnchor.y}
          textAnchor="middle"
        >
          Gate
        </text>

        <line
          className={styles.pulseLine}
          x1={layout.pulseLine.x1}
          y1={layout.pulseLine.y1}
          x2={layout.pulseLine.x1}
          y2={layout.pulseLine.y1}
          ref={pulseRef}
        />

        <circle
          className={styles.releaseNode}
          cx={layout.release.x}
          cy={layout.release.y}
          r="14"
          ref={releaseRef}
        />
        <text
          className={styles.releaseLabel}
          x={layout.releaseLabelAnchor.x}
          y={layout.releaseLabelAnchor.y}
          textAnchor="middle"
        >
          Release
        </text>
      </svg>
      <p className={styles.caption} ref={captionRef} aria-live="polite">
        {captionFor(progress.get())}
      </p>
    </div>
  );
}
