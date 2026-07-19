import type { DmtRailModel } from "@/content/experience";
import { validateRailModel } from "@/lib/rail/geometry";

import { DmtRailVisual } from "./DmtRailVisual";
import styles from "./rails-scene.module.css";

type RailsSceneProps = {
  model: DmtRailModel;
};

export function RailsScene({ model }: RailsSceneProps) {
  validateRailModel(model);

  return (
    <section
      className={styles.scene}
      data-scene="rails"
      aria-label="Rails"
    >
      <header className={styles.header}>
        <p>03 / Rails</p>
        <h2>The customer sees a result. The system sees every leg.</h2>
      </header>

      <DmtRailVisual model={model} />

      <ol className={styles.nodeList}>
        {model.nodes.map((node, index) => (
          <li key={node.id}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p>{node.owner}</p>
              <h3>{node.label}</h3>
            </div>
            <p>{node.detail}</p>
          </li>
        ))}
      </ol>

      <blockquote className={styles.question}>
        {model.reconciliationQuestion}
      </blockquote>
    </section>
  );
}
