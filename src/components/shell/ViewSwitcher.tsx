import Link from "next/link";

import styles from "./shell.module.css";

type ViewSwitcherProps = {
  active: "experience" | "index" | "work" | "story";
};

export function ViewSwitcher({ active }: ViewSwitcherProps) {
  return (
    <div className={styles.viewSwitcher} aria-label="Portfolio view">
      <Link
        href="/"
        aria-current={active === "experience" ? "page" : undefined}
      >
        Experience
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href="/index"
        aria-current={active === "index" ? "page" : undefined}
      >
        Index
      </Link>
    </div>
  );
}
