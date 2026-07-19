"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { stakeholderFragments } from "@/content/experience";
import { site } from "@/content/site";
import { useMotionPolicy } from "@/hooks/useMotionPolicy";

import styles from "./opening-sequence.module.css";

export function OpeningSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const policy = useMotionPolicy();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const fragmentOneX = useTransform(scrollYProgress, [0, 0.78], [-24, 0]);
  const fragmentOneY = useTransform(scrollYProgress, [0, 0.78], [-8, 0]);
  const fragmentTwoX = useTransform(scrollYProgress, [0, 0.78], [32, 0]);
  const fragmentTwoY = useTransform(scrollYProgress, [0, 0.78], [-12, 0]);
  const fragmentThreeX = useTransform(scrollYProgress, [0, 0.78], [-16, 0]);
  const fragmentThreeY = useTransform(scrollYProgress, [0, 0.78], [16, 0]);
  const fragmentFourX = useTransform(scrollYProgress, [0, 0.78], [24, 0]);
  const fragmentFourY = useTransform(scrollYProgress, [0, 0.78], [10, 0]);
  const identityY = useTransform(scrollYProgress, [0.2, 0.78], [12, 0]);
  const lineScale = useTransform(scrollYProgress, [0.28, 0.72], [0.06, 1]);
  const fullMotion = policy.dom === "full";

  const offsets = [
    { x: fragmentOneX, y: fragmentOneY },
    { x: fragmentTwoX, y: fragmentTwoY },
    { x: fragmentThreeX, y: fragmentThreeY },
    { x: fragmentFourX, y: fragmentFourY },
  ] as const;

  return (
    <section
      ref={sectionRef}
      className={styles.sequence}
      data-motion={policy.dom}
      data-scene="unresolved"
      aria-label="Unresolved and one truth"
    >
      <div className={styles.stickyFrame}>
        <p className={styles.sceneIndex}>01 / Unresolved</p>
        <div className={styles.fragments}>
          {stakeholderFragments.map((fragment, index) => (
            <motion.div
              className={styles.fragment}
              data-testid="stakeholder-fragment"
              key={fragment.id}
              style={fullMotion ? offsets[index] : undefined}
            >
              <p>{fragment.label}</p>
              <span>{fragment.text}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.identity}
          style={fullMotion ? { y: identityY } : undefined}
        >
          <p>{site.role}</p>
          <h1>
            <span>Amey Joshi</span>
            <span>Complexity in. Clarity out.</span>
          </h1>
          <p>{site.positioning}</p>
        </motion.div>

        <motion.span
          className={styles.oneTruthLine}
          style={fullMotion ? { scaleX: lineScale } : undefined}
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
