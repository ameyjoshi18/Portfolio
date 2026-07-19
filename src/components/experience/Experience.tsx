import Link from "next/link";

import {
  cutoverWorkstreams,
  dmtRail,
  stakeholderFragments,
  translationStages,
} from "@/content/experience";
import { site } from "@/content/site";

import { SceneMarker } from "./SceneMarker";
import styles from "./experience.module.css";

export function Experience() {
  return (
    <div className={styles.experience}>
      <SceneMarker />

      <section
        className={`${styles.scene} ${styles.opening}`}
        data-scene="unresolved"
        aria-label="Unresolved and one truth"
      >
        <p className={styles.sceneIndex}>01 / Unresolved</p>
        <div className={styles.fragments}>
          {stakeholderFragments.map((fragment) => (
            <div className={styles.fragment} key={fragment.id}>
              <p>{fragment.label}</p>
              <span>{fragment.text}</span>
            </div>
          ))}
        </div>
        <div className={styles.identity}>
          <p>{site.role}</p>
          <h1>
            <span>Amey Joshi</span>
            <span>Complexity in. Clarity out.</span>
          </h1>
          <p>{site.positioning}</p>
        </div>
        <span className={styles.oneTruthLine} aria-hidden="true" />
      </section>

      <section
        className={styles.scene}
        data-scene="translation"
        aria-label="Translation"
      >
        <header className={styles.sceneHeader}>
          <p>02 / Translation</p>
          <h2>One requirement. Five changes of state.</h2>
        </header>
        <ol className={styles.translationList}>
          {translationStages.map((stage, index) => (
            <li key={stage.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{stage.label}</h3>
              <p>{stage.detail}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={styles.scene}
        data-scene="rails"
        aria-label="Rails"
      >
        <header className={styles.sceneHeader}>
          <p>03 / Rails</p>
          <h2>The customer sees a result. The system sees every leg.</h2>
        </header>
        <ol className={styles.railList}>
          {dmtRail.nodes.map((node, index) => (
            <li key={node.id}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{node.label}</h3>
              <p>{node.detail}</p>
            </li>
          ))}
        </ol>
        <p className={styles.railQuestion}>{dmtRail.reconciliationQuestion}</p>
      </section>

      <section
        className={`${styles.scene} ${styles.cutover}`}
        data-scene="cutover"
        aria-label="Cutover"
      >
        <header className={styles.sceneHeader}>
          <p>04 / Cutover</p>
          <h2>Parallel work. One release window.</h2>
        </header>
        <ol className={styles.workstreamList}>
          {cutoverWorkstreams.map((stream) => (
            <li key={stream.id}>
              <h3>{stream.label}</h3>
              <p>{stream.responsibility}</p>
            </li>
          ))}
        </ol>
      </section>

      <section
        className={styles.scene}
        data-scene="evidence"
        aria-label="Evidence register"
      >
        <header className={styles.sceneHeader}>
          <p>05 / Evidence register</p>
          <h2>Proof earns its place.</h2>
        </header>
        <div className={styles.editorialNote}>
          <p>
            Bounded engagement notes will appear only after their facts,
            contribution and disclosure boundaries are confirmed.
          </p>
          <Link href="/work">Open the work register</Link>
        </div>
      </section>

      <section
        className={styles.scene}
        data-scene="origin"
        aria-label="Before the bank"
      >
        <header className={styles.sceneHeader}>
          <p>06 / Before the bank</p>
          <h2>Curiosity became a company before it became a career.</h2>
        </header>
        <div className={styles.editorialNote}>
          <p>
            Kodoli. College software used by real people. Zenox Technologies.
            RB Esports. Two lockdowns. Then the move into Business Analysis and
            banking.
          </p>
          <Link href="/story">Read the human route</Link>
        </div>
      </section>

      <section
        className={`${styles.scene} ${styles.openLine}`}
        data-scene="open-line"
        aria-label="Open line"
      >
        <p>07 / Open line</p>
        <h2>Bring me the complicated version.</h2>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <span className={styles.signatureLine} aria-hidden="true" />
      </section>
    </div>
  );
}
