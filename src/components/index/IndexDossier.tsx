import Link from "next/link";

import type { CaseStudy, Role } from "@/content/schema";
import { site } from "@/content/site";

import styles from "./index-dossier.module.css";

type IndexDossierProps = {
  caseStudies: readonly CaseStudy[];
  roles: readonly Role[];
};

export function IndexDossier({ caseStudies, roles }: IndexDossierProps) {
  return (
    <article className={styles.dossier}>
      <header className={styles.hero}>
        <div className={styles.heroMeta}>
          <p>Index / 2026</p>
          <p>{site.role}</p>
          <p>{site.location}</p>
        </div>
        <div className={styles.heroIdentity}>
          <h1>Amey Joshi</h1>
          <p className={styles.headline}>{site.headline}</p>
          <p className={styles.positioning}>{site.positioning}</p>
        </div>
        <Link className={styles.experienceLink} href="/">
          Enter the Experience <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <section className={styles.section} aria-labelledby="selected-work">
        <div className={styles.sectionHeading}>
          <p>01</p>
          <h2 id="selected-work">Selected work</h2>
        </div>
        <div className={styles.sectionBody}>
          {caseStudies.length > 0 ? (
            <div className={styles.workList}>
              {caseStudies.map((study, index) => (
                <article className={styles.workItem} key={study.slug}>
                  <p className={styles.itemNumber}>
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3>
                      <Link href={`/work/${study.slug}`}>{study.title}</Link>
                    </h3>
                    <p>{study.summary}</p>
                  </div>
                  <p className={styles.itemMeta}>{study.capabilities.join(" · ")}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className={styles.emptyEvidence}>
              <p>
                Detailed engagement notes are being prepared; the domain
                register below remains available.
              </p>
              <Link href="/work">Open the work register</Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="domain-register">
        <div className={styles.sectionHeading}>
          <p>02</p>
          <h2 id="domain-register">Domain register</h2>
        </div>
        <div className={styles.sectionBody}>
          <ul className={styles.domainList}>
            {site.domains.map((domain, index) => (
              <li key={domain}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {domain}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="working-method">
        <div className={styles.sectionHeading}>
          <p>03</p>
          <h2 id="working-method">Working method</h2>
        </div>
        <div className={styles.sectionBody}>
          <ol className={styles.methodList}>
            {site.method.map((phase, index) => (
              <li key={phase.verb}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{phase.verb}</h3>
                <p>{phase.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="career">
        <div className={styles.sectionHeading}>
          <p>04</p>
          <h2 id="career">Career</h2>
        </div>
        <div className={styles.sectionBody}>
          <ol className={styles.roleList}>
            {roles.map((role) => (
              <li key={role.id}>
                <p className={styles.rolePeriod}>{role.period}</p>
                <div>
                  <h3>{role.organisation}</h3>
                  <p className={styles.roleTitle}>{role.title}</p>
                  <p>{role.summary}</p>
                </div>
                <p className={styles.roleLocation}>{role.location}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.origin} aria-labelledby="origin-note">
        <p className={styles.originIndex}>05 / Before the bank</p>
        <h2 id="origin-note">
          Founder instincts.
          <br />
          Banking responsibility.
        </h2>
        <p>
          The path runs from LAN cafés and college-deployed software to Zenox,
          RB Esports and enterprise banking. The through-line is not a title;
          it is the habit of turning a difficult system into something people
          can act on together.
        </p>
        <Link href="/story">Read the story</Link>
      </section>
    </article>
  );
}
