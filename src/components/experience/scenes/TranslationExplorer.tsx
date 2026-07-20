"use client";

import { motion } from "motion/react";
import { useState } from "react";

import { translationStages } from "@/content/experience";

import styles from "./translation-scene.module.css";

type TranslationStageId = (typeof translationStages)[number]["id"];

export function TranslationExplorer() {
  const [activeId, setActiveId] = useState<TranslationStageId>(
    translationStages[0].id,
  );
  const activeIndex = translationStages.findIndex((stage) => stage.id === activeId);
  const activeStage = translationStages[activeIndex];

  return (
    <div className={styles.explorer}>
      <div className={styles.stageControls} role="group" aria-label="Translation stages">
        {translationStages.map((stage, index) => (
          <button
            type="button"
            aria-pressed={stage.id === activeId}
            onClick={() => setActiveId(stage.id)}
            key={stage.id}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {stage.label}
          </button>
        ))}
        <motion.span
          className={`${styles.activeRule} ${styles.horizontalRule}`}
          data-active-rule="horizontal"
          animate={{ x: `${activeIndex * 100}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
        <motion.span
          className={`${styles.activeRule} ${styles.verticalRule}`}
          data-active-rule="vertical"
          animate={{ y: `${activeIndex * 100}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden="true"
        />
      </div>

      <div className={styles.activeStage} aria-live="polite">
        <p>{activeStage.label}</p>
        <strong>{activeStage.detail}</strong>
      </div>
    </div>
  );
}
