import { SiteShell } from "@/components/shell/SiteShell";

import styles from "./not-found.module.css";

export default function NotFoundPage() {
  return (
    <SiteShell active="experience">
      <main className={styles.main} id="main-content" tabIndex={-1}>
        <p className={styles.eyebrow}>404 / Unresolved path</p>
        <h1>This route is unresolved.</h1>
        <p className={styles.copy}>
          The address does not map to a published page. Return to the full
          experience, or use the Index for a direct route through the work.
        </p>
        <nav aria-label="Not found recovery" className={styles.actions}>
          <a href="/">Return to the Experience</a>
          <a href="/index">Open the Index</a>
        </nav>
      </main>
    </SiteShell>
  );
}
