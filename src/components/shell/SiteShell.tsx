import type { ReactNode } from "react";

import { ContactFooter } from "./ContactFooter";
import { SiteHeader } from "./SiteHeader";
import styles from "./shell.module.css";

type SiteShellProps = {
  active: "experience" | "index" | "work" | "story";
  children: ReactNode;
};

export function SiteShell({ active, children }: SiteShellProps) {
  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#main-content">
        Skip to main content
      </a>
      <SiteHeader active={active} />
      {children}
      <ContactFooter />
    </div>
  );
}
