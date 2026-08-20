import type { CaseStudy } from "@/content/schema";

import styles from "./work.module.css";

type WorkRegisterProps = {
  caseStudies: readonly CaseStudy[];
};

export function WorkRegister({ caseStudies }: WorkRegisterProps) {
  return (
    <div className={styles.register}>
      <header className={styles.registerHeader}>
        <p className={styles.kicker}>Work / Evidence register</p>
        <h1>Systems, inspected.</h1>
        <p>
          The useful part of a project is rarely its polished ending. It is the
          constraint, the decision, the artifact and the evidence that let many
          teams move as one.
        </p>
      </header>

      {caseStudies.length > 0 ? (
        <div className={styles.registerList}>
          {caseStudies.map((study, index) => (
            <article className={`${styles.registerItem} glass tile`} key={study.slug}>
              <p className={`${styles.itemIndex} tileNumber`}>
                {String(index + 1).padStart(2, "0")}
              </p>
              <div className="tileHeading">
                <p className={styles.itemPremise}>{study.premise}</p>
                <h2>
                  <a href={`/work/${study.slug}`}>{study.title}</a>
                </h2>
                <p className={styles.itemSummary}>{study.summary}</p>
              </div>
              <p className={`${styles.itemCapabilities} tileTags`}>
                {study.capabilities.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <section className={`${styles.emptyRegister} glass tile`} aria-labelledby="work-in-progress">
          <p className={`${styles.itemIndex} tileNumber`}>Publication boundary</p>
          <div className="tileHeading">
            <h2 id="work-in-progress">Evidence before theatre.</h2>
            <p>
              Detailed engagement notes are being prepared. They will appear
              here only when their scope, contribution and public facts are
              verified.
            </p>
            <a href="/index">Use the domain Index in the meantime</a>
          </div>
        </section>
      )}
    </div>
  );
}
