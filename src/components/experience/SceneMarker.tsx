"use client";

import { useEffect, useState } from "react";

import styles from "./experience.module.css";

export function SceneMarker() {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    if (!("IntersectionObserver" in window) || scenes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = scenes.indexOf(visible.target as HTMLElement);
        if (index >= 0) setActive(index + 1);
      },
      { threshold: [0.2, 0.45, 0.7] },
    );

    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, []);

  return (
    <aside className={`${styles.sceneMarker} glass`} aria-label="Scene progress">
      <span>{String(active).padStart(2, "0")}</span>
      <span aria-hidden="true">/</span>
      <span>07</span>
    </aside>
  );
}
