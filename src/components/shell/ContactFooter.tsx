import { site } from "@/content/site";

import styles from "./shell.module.css";

export function ContactFooter() {
  return (
    <footer className={styles.footer} id="contact">
      <p className={styles.footerLabel}>Open line</p>
      <h2>Bring me the complicated version.</h2>
      <p className={styles.footerCopy}>
        If the system spans teams, constraints and real-world consequences,
        that is usually where the interesting work begins.
      </p>
      <div className={styles.footerLinks}>
        <a href={`mailto:${site.email}`}>{site.email}</a>
        <a href={site.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>
      <p className={styles.footerFinePrint}>
        {site.location} · © {new Date().getFullYear()} Amey Joshi
      </p>
    </footer>
  );
}
