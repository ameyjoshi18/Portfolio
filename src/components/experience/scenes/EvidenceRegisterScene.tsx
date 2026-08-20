import type { CaseStudy } from "@/content/schema";

import styles from "./closing-scenes.module.css";

type EvidenceRegisterSceneProps = {
  caseStudies: readonly CaseStudy[];
};

function disclosureText(study: CaseStudy) {
  return study.outcome.disclosure === "public"
    ? study.outcome.text
    : "Outcome details are not publicly disclosed.";
}

export function EvidenceRegisterScene({
  caseStudies,
}: EvidenceRegisterSceneProps) {
  const publishedStudies = caseStudies.filter(
    (study) => study.publication === "published",
  );

  return (
    <section
      className={`${styles.scene} ${styles.evidenceScene}`}
      data-scene="evidence"
      aria-label="Evidence register"
    >
      <header className={styles.sceneHeader}>
        <p>05 / Evidence register</p>
        <div>
          <h2>The decision trail is the portfolio.</h2>
          <p>
            Premise, constraint, contribution and evidence—published only when
            the facts and disclosure boundary are clear.
          </p>
        </div>
      </header>

      {publishedStudies.length > 0 ? (
        <div className={styles.evidenceList}>
          {publishedStudies.map((study, index) => (
            <article className={`${styles.evidenceItem} glass tile`} key={study.slug}>
              <header className={`${styles.evidenceItemHeader} tileHeading`}>
                <p className="tileNumber">
                  {String(index + 1).padStart(2, "0")} / Verified dossier
                </p>
                <h3>
                  <a href={`/work/${study.slug}`}>{study.title}</a>
                </h3>
                <p>{study.summary}</p>
              </header>

              <dl className={styles.evidenceFacts}>
                <div>
                  <dt>Premise</dt>
                  <dd>{study.premise}</dd>
                </div>
                <div>
                  <dt>Constraint</dt>
                  <dd>{study.constraints.join(", ")}</dd>
                </div>
                <div>
                  <dt>Contribution</dt>
                  <dd>{study.responsibility}</dd>
                </div>
                <div>
                  <dt>Disclosure</dt>
                  <dd>{disclosureText(study)}</dd>
                </div>
              </dl>

              <footer className={styles.evidenceItemFooter}>
                <p>{study.capabilities.join(" / ")}</p>
                <a href={`/work/${study.slug}`}>Inspect the complete dossier</a>
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className={`${styles.evidenceBoundary} glass tile`}>
          <p className="tileNumber">Publication boundary / Active</p>
          <h3 className="tileHeading">No borrowed certainty.</h3>
          <p>
            Engagement dossiers enter this register only after scope,
            contribution and public facts are verified. Until then, the domain
            map and work register state exactly what is known.
          </p>
          <nav aria-label="Evidence alternatives">
            <a href="/work">Open the work register</a>
            <a href="/index">Use the domain Index</a>
          </nav>
        </div>
      )}
    </section>
  );
}
