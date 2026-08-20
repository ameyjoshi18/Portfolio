import { LogoMark } from "./LogoMark";
import { ViewSwitcher } from "./ViewSwitcher";
import styles from "./shell.module.css";

type SiteHeaderProps = {
  active: "experience" | "index" | "work" | "story";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className={`${styles.header} glass`}>
      <a
        className={styles.wordmark}
        href="/"
        aria-label="Amey Joshi — home"
      >
        <LogoMark className={styles.wordmarkMark} />
        <span className={styles.wordmarkText}>Amey Joshi</span>
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
