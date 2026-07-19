import Link from "next/link";

import { ViewSwitcher } from "./ViewSwitcher";
import styles from "./shell.module.css";

type SiteHeaderProps = {
  active: "experience" | "index" | "work" | "story";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <Link className={styles.wordmark} href="/" aria-label="Amey Joshi — home">
        <strong>AMEY</strong>
        <span aria-hidden="true">·</span>
        <span>JOSHI</span>
      </Link>

      <nav className={styles.navigation} aria-label="Primary navigation">
        <Link href="/work" aria-current={active === "work" ? "page" : undefined}>
          Work
        </Link>
        <Link href="/story" aria-current={active === "story" ? "page" : undefined}>
          Story
        </Link>
        <a href="#contact">Contact</a>
      </nav>

      <ViewSwitcher active={active} />
    </header>
  );
}
