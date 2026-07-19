import styles from "./shell.module.css";

type TruthLineProps = {
  className?: string;
};

export function TruthLine({ className }: TruthLineProps) {
  return (
    <span
      className={[styles.truthLine, className].filter(Boolean).join(" ")}
      aria-hidden="true"
    />
  );
}
