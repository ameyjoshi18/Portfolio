import type { SiteProfile } from "@/content/schema";

import styles from "./closing-scenes.module.css";

type OpenLineProps = {
  profile: SiteProfile;
};

export function OpenLine({ profile }: OpenLineProps) {
  return (
    <section
      className={`${styles.scene} ${styles.openLine}`}
      data-scene="open-line"
      aria-label="Open line"
    >
      <p className={styles.openLineIndex}>07 / Open line</p>
      <div className={styles.openLineStatement}>
        <h2>Bring me the complicated version.</h2>
        <p>
          The one with competing constraints, real operational consequences
          and more than one team holding part of the truth.
        </p>
      </div>

      <div className={styles.openLineContact}>
        <p>{profile.location}</p>
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>

      <span className={styles.signatureLine} aria-hidden="true" />
    </section>
  );
}
