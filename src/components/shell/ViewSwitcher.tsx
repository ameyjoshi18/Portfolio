import styles from "./shell.module.css";

type ViewSwitcherProps = {
  active: "experience" | "index" | "work" | "story";
};

export function ViewSwitcher({ active }: ViewSwitcherProps) {
  return (
    <nav className={`${styles.viewSwitcher} glass`} aria-label="Portfolio view">
      <a
        href="/"
        aria-current={active === "experience" ? "page" : undefined}
      >
        Experience
      </a>
      <span aria-hidden="true">/</span>
      <a
        href="/index"
        aria-current={active === "index" ? "page" : undefined}
      >
        Index
      </a>
    </nav>
  );
}
