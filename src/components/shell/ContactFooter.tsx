import { site } from "@/content/site";

import { LogoMark } from "./LogoMark";
import styles from "./shell.module.css";

export function ContactFooter() {
  return (
    <footer className={styles.footer} id="contact">
      <LogoMark className={styles.footerMark} />
      <p className={styles.footerLabel}>Open line</p>
      <div className={`${styles.footerCard} glass tile`}>
        <h2 className="tileHeading">Bring me the complicated version.</h2>
        <p className={styles.footerCopy}>
          If the system spans teams, constraints and real-world consequences,
          that is usually where the interesting work begins.
        </p>
        <div className={`${styles.footerLinks} tileTags`}>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
      <p className={styles.footerFinePrint}>
        {site.location} · © {new Date().getFullYear()} Amey Joshi
      </p>
    </footer>
  );
}
