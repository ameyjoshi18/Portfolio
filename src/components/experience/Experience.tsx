import Link from "next/link";

import { cutoverWorkstreams, dmtRail } from "@/content/experience";
import { site } from "@/content/site";

import { SceneMarker } from "./SceneMarker";
import styles from "./experience.module.css";
import { OpeningSequence } from "./scenes/OpeningSequence";
import { RailsScene } from "./scenes/RailsScene";
import { TranslationScene } from "./scenes/TranslationScene";

export function Experience() {
  return (
    <div className={styles.experience}>
      <SceneMarker />
      <OpeningSequence />
      <TranslationScene />

      <RailsScene model={dmtRail} />

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
