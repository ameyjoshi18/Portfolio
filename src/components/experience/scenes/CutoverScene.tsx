"use client";

import { useScroll } from "motion/react";
import { useRef } from "react";

import { cutoverWorkstreams } from "@/content/experience";
import { useMotionPolicy } from "@/hooks/useMotionPolicy";
import type { MotionPolicy } from "@/lib/motion/policy";

import { CutoverEnhancement } from "./CutoverEnhancement";
import { CutoverStatic } from "./CutoverStatic";
import styles from "./cutover-scene.module.css";

type CutoverSceneProps = {
  policy?: MotionPolicy;
};

export function CutoverScene({ policy: policyOverride }: CutoverSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const detectedPolicy = useMotionPolicy();
  const policy = policyOverride ?? detectedPolicy;
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  return (
    <section
      className={styles.scene}
      data-scene="cutover"
      data-motion={policy.dom}
      data-cutover={policy.cutover}
      aria-label="Cutover"
      ref={sectionRef}
    >
      <div className={styles.stickyFrame}>
        <header className={styles.header}>
          <p>04 / Cutover</p>
          <h2>Cutover: parallel work. One release window.</h2>
        </header>

        <div className={styles.visualStack}>
          <CutoverStatic />
          <CutoverEnhancement policy={policy} progress={scrollYProgress} />
        </div>

        <ol className={styles.workstreamList}>
          {cutoverWorkstreams.map((stream, index) => (
            <li key={stream.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{stream.label}</h3>
              <p>{stream.responsibility}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
