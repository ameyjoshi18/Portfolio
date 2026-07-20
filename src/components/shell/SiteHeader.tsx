import { ViewSwitcher } from "./ViewSwitcher";
import styles from "./shell.module.css";

type SiteHeaderProps = {
  active: "experience" | "index" | "work" | "story";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <a
        className={styles.wordmark}
        href="/"
        aria-label="Amey Joshi — home"
      >
        <strong>AMEY</strong>
        <span aria-hidden="true">·</span>
        <span>JOSHI</span>
      </a>

      <ViewSwitcher active={active} />

      <nav className={styles.navigation} aria-label="Primary navigation">
        <a
          href="/work"
          aria-current={active === "work" ? "page" : undefined}
        >
          Work
        </a>
        <a
          href="/story"
          aria-current={active === "story" ? "page" : undefined}
        >
          Story
        </a>
        <a href="#contact">Contact</a>
      </nav>
    </header>
  );
}
