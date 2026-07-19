import { TranslationExplorer } from "./TranslationExplorer";
import styles from "./translation-scene.module.css";

export function TranslationScene() {
  return (
    <section
      className={styles.scene}
      data-scene="translation"
      aria-label="Translation"
    >
      <header className={styles.header}>
        <p>02 / Translation</p>
        <h2>One requirement. Five changes of state.</h2>
      </header>
      <TranslationExplorer />
    </section>
  );
}
