"use client";

import { useEffect, useRef, useState } from "react";

import { useDocumentVisibility } from "@/hooks/useDocumentVisibility";

import {
  EDGES,
  NODE_BY_ID,
  NODES,
  OUTBOUND_MS,
  ROUTES,
  ROUTE_PAUSE_MS,
  RETURN_MS,
  STEP_PAUSE_MS,
  edgeKey,
  type NodeId,
} from "./heroNetworkModel";
import styles from "./opening-sequence.module.css";

const IDLE_MIN = 0.22;
const IDLE_MAX = 0.36;
const PULSE_PERIOD_MS = 3200;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function HeroNetwork() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<NodeId, SVGCircleElement>());
  const edgeRefs = useRef(new Map<string, SVGLineElement>());
  const packetRef = useRef<SVGCircleElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);

  const [reducedMotion, setReducedMotion] = useState(false);
  const [inView, setInView] = useState(false);
  const documentVisible = useDocumentVisibility();

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView || !documentVisible) return;

    const nodeActivation = new Map<NodeId, number>(
      NODES.map((node) => [node.id, 0]),
    );
    const edgeActivation = new Map<string, number>(
      EDGES.map(([a, b]) => [edgeKey(a, b), 0]),
    );
    const nodePhase = new Map<NodeId, number>(
      NODES.map((node, index) => [node.id, (index / NODES.length) * Math.PI * 2]),
    );

    let routeIndex = 0;
    let stepIndex = 0;
    let stepStart = performance.now();
    let phase: "playing" | "step-pause" | "route-pause" = "playing";
    let pauseStart = 0;
    let frameId = 0;

    const caption = captionRef.current;
    if (caption) caption.textContent = ROUTES[0].caption;

    function bump(map: Map<string, number>, key: string, value: number) {
      map.set(key, Math.max(map.get(key) ?? 0, value));
    }

    function tick(now: number) {
      frameId = requestAnimationFrame(tick);
      const route = ROUTES[routeIndex];

      if (phase === "route-pause") {
        if (now - pauseStart >= ROUTE_PAUSE_MS) {
          routeIndex = (routeIndex + 1) % ROUTES.length;
          stepIndex = 0;
          stepStart = now;
          phase = "playing";
          if (caption) caption.textContent = ROUTES[routeIndex].caption;
        }
      } else if (phase === "step-pause") {
        if (now - pauseStart >= STEP_PAUSE_MS) {
          stepIndex += 1;
          stepStart = now;
          phase = "playing";
        }
      } else {
        const step = route.steps[stepIndex];
        const duration = step.speed === "outbound" ? OUTBOUND_MS : RETURN_MS;
        const elapsed = now - stepStart;
        const frac = Math.min(1, elapsed / duration);

        const from = NODE_BY_ID[step.from];
        const to = NODE_BY_ID[step.to];
        const packet = packetRef.current;
        if (packet) {
          packet.setAttribute("cx", String(lerp(from.x, to.x, frac)));
          packet.setAttribute("cy", String(lerp(from.y, to.y, frac)));
          // A teleport step starts a fresh packet at `from` rather than
          // continuing from wherever the previous step visually ended, so
          // fade it in instead of assuming continuity.
          packet.style.opacity = step.teleport
            ? String(Math.min(1, frac / 0.3))
            : "1";
        }

        bump(edgeActivation, edgeKey(step.from, step.to), 1);
        bump(nodeActivation, step.from, 0.85);
        bump(nodeActivation, step.to, frac);

        if (frac >= 1) {
          bump(nodeActivation, step.to, step.beat ? 1.35 : 1);
          if (stepIndex >= route.steps.length - 1) {
            phase = "route-pause";
            pauseStart = now;
            if (packet) packet.style.opacity = "0";
          } else {
            phase = "step-pause";
            pauseStart = now;
          }
        }
      }

      NODES.forEach((node, index) => {
        const idle =
          IDLE_MIN +
          (IDLE_MAX - IDLE_MIN) *
            (0.5 +
              0.5 *
                Math.sin(
                  (now / PULSE_PERIOD_MS) * Math.PI * 2 +
                    (nodePhase.get(node.id) ?? 0),
                ));
        const activation = nodeActivation.get(node.id) ?? 0;
        const decayed = activation * 0.93;
        nodeActivation.set(node.id, decayed);
        const opacity = Math.min(1, Math.max(idle, activation));
        const el = nodeRefs.current.get(node.id);
        if (el) {
          el.style.opacity = String(opacity);
          const scale = 1 + Math.min(0.22, activation * 0.22);
          el.style.transform = `scale(${scale})`;
        }
        void index;
      });

      EDGES.forEach(([a, b]) => {
        const key = edgeKey(a, b);
        const activation = edgeActivation.get(key) ?? 0;
        const decayed = activation * 0.9;
        edgeActivation.set(key, decayed);
        const opacity = Math.min(1, Math.max(0.16, activation));
        const el = edgeRefs.current.get(key);
        if (el) el.style.opacity = String(opacity);
      });
    }

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [reducedMotion, inView, documentVisible]);

  return (
    <div className={styles.network} ref={wrapperRef} aria-hidden="true">
      <svg
        viewBox="0 0 1180 620"
        preserveAspectRatio="xMidYMid meet"
        focusable="false"
      >
        {EDGES.map(([a, b]) => {
          const from = NODE_BY_ID[a];
          const to = NODE_BY_ID[b];
          return (
            <line
              key={edgeKey(a, b)}
              className={styles.networkEdge}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              ref={(node) => {
                if (node) edgeRefs.current.set(edgeKey(a, b), node);
              }}
            />
          );
        })}

        {NODES.map((node) => (
          <g key={node.id}>
            <circle
              className={styles.networkNode}
              cx={node.x}
              cy={node.y}
              r={node.hub ? 15 : 8}
              style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              ref={(el) => {
                if (el) nodeRefs.current.set(node.id, el);
              }}
            />
            <text
              className={styles.networkLabel}
              x={node.x}
              y={node.y - (node.hub ? 26 : 18)}
              textAnchor="middle"
            >
              {node.label}
            </text>
          </g>
        ))}

        <circle className={styles.networkPacket} r="5" ref={packetRef} />
      </svg>
      {reducedMotion ? null : (
        <p className={styles.networkCaption} ref={captionRef} />
      )}
    </div>
  );
}
