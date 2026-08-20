import type { CaseStudy } from "@/content/schema";

import styles from "./work.module.css";

type CaseStudyArticleProps = {
  study: CaseStudy;
};

type DossierSectionProps = {
  id: string;
  label: string;
  title: string;
  children: React.ReactNode;
};

function DossierSection({
  id,
  label,
  title,
  children,
}: DossierSectionProps) {
  return (
    <section className={styles.dossierSection} data-dossier={id}>
      <p className={styles.dossierLabel}>{label}</p>
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export function CaseStudyArticle({ study }: CaseStudyArticleProps) {
  return (
    <article className={styles.caseStudy}>
      <header className={styles.caseHeader}>
        <a href="/work">← Work register</a>
        <p className={styles.kicker}>Bounded engagement</p>
        <h1>{study.title}</h1>
        <p className={styles.caseSummary}>{study.summary}</p>
      </header>

      <DossierSection id="premise" label="01" title="Premise">
        <p>{study.premise}</p>
      </DossierSection>
      <DossierSection id="context" label="02" title="Context">
        <p>{study.context}</p>
      </DossierSection>
      <DossierSection id="mandate" label="03" title="Mandate">
        <p>{study.mandate}</p>
      </DossierSection>
      <DossierSection id="constraints" label="04" title="Constraints">
        <ul>{study.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
      </DossierSection>
      <DossierSection id="responsibility" label="05" title="Amey's responsibility">
        <p>{study.responsibility}</p>
      </DossierSection>
      <DossierSection id="boundaries" label="06" title="Boundaries and stakeholders">
        <div className={styles.boundaryColumns}>
          <div>
            <h3>Stakeholders</h3>
            <ul>{study.stakeholders.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
          <div>
            <h3>System boundaries</h3>
            <ul>{study.systemBoundaries.map((item) => <li key={item}>{item}</li>)}</ul>
          </div>
        </div>
      </DossierSection>
      <DossierSection id="artifacts" label="07" title="Process and artifacts">
        <dl className={styles.artifactList}>
          {study.processAndArtifacts.map((artifact) => (
            <div key={artifact.name}>
              <dt>{artifact.name}</dt>
              <dd>{artifact.description}</dd>
            </div>
          ))}
        </dl>
      </DossierSection>
      <DossierSection id="tradeoff" label="08" title="Decision and trade-off">
        <p>{study.tradeoff}</p>
      </DossierSection>
      <DossierSection id="validation" label="09" title="Validation and release">
        <p>{study.validationAndRelease}</p>
      </DossierSection>
      <DossierSection id="outcome" label="10" title="Outcome">
        <p>
          {study.outcome.disclosure === "public"
            ? study.outcome.text
            : "Outcome details are not publicly disclosed."}
        </p>
      </DossierSection>
      <DossierSection id="capabilities" label="11" title="Related capabilities">
        <ul className={styles.capabilityList}>
          {study.capabilities.map((item) => (
            <li className="glass" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </DossierSection>
    </article>
  );
}
