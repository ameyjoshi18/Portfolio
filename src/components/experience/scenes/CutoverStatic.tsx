import { cutoverWorkstreams } from "@/content/experience";
import { useOrientation } from "@/hooks/useOrientation";

import { buildLayout, type TrackId } from "./cutoverLayout";
import styles from "./cutover-scene.module.css";

const LABELS = Object.fromEntries(
  cutoverWorkstreams.map((stream) => [stream.id, stream.label]),
) as Record<TrackId, string>;

/**
 * Renders the cutover diagram in its completed end state: every track lit,
 * gate open, release lit. This is what prefers-reduced-motion and the
 * low-capability tier see — a readable outcome, not a frozen mid-animation.
 */
export function CutoverStatic() {
  const orientation = useOrientation();
  const layout = buildLayout(orientation);

  return (
    <div className={styles.staticVisual} data-testid="cutover-static">
      <svg
        viewBox={layout.viewBox}
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        data-phase="open"
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
                x2={end.x}
                y2={end.y}
              />
              {track.checkpoints.map((point, index) => {
                const isEnd = index === track.checkpoints.length - 1;
                return (
                  <circle
                    key={index}
                    className={`${isEnd ? styles.trackEnd : styles.checkpoint} ${styles.checkpointLit}`}
                    cx={point.x}
                    cy={point.y}
                    r={isEnd ? 8 : 5}
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
          x2={layout.pulseLine.x2}
          y2={layout.pulseLine.y2}
        />

        <circle
          className={`${styles.releaseNode} ${styles.releaseLit}`}
          cx={layout.release.x}
          cy={layout.release.y}
          r="14"
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
      <p className={styles.caption}>Release window open — five of five ready</p>
    </div>
  );
}
