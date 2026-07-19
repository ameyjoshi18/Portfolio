import { cutoverWorkstreams } from "@/content/experience";

import styles from "./cutover-scene.module.css";

const centreY = 260;

function laneY(depth: number) {
  return centreY + depth * 105;
}

export function CutoverStatic() {
  return (
    <div className={styles.staticVisual} data-testid="cutover-static">
      <svg
        viewBox="0 0 1200 520"
        aria-hidden="true"
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
      >
        <line className={styles.releaseAxis} x1="1090" x2="1090" y1="48" y2="472" />
        <line className={styles.truthLine} x1="70" x2="1130" y1={centreY} y2={centreY} />

        {cutoverWorkstreams.map((stream, index) => {
          const y = laneY(stream.depth);
          const opacity = 0.42 + index * 0.09;

          return (
            <g key={stream.id}>
              <path
                className={styles.workstreamPath}
                d={`M 70 ${y} C 430 ${y}, 760 ${centreY}, 1090 ${centreY}`}
                style={{ opacity }}
              />
              <circle className={styles.laneOrigin} cx="70" cy={y} r="4" />
            </g>
          );
        })}

        <circle className={styles.releaseSignal} cx="1090" cy={centreY} r="7" />
      </svg>
      <p className={styles.staticCaption}>Five readiness tracks / one release decision</p>
    </div>
  );
}
