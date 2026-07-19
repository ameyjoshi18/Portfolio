import Image from "next/image";
import Link from "next/link";

import type { StoryChapter } from "@/content/schema";

import styles from "./closing-scenes.module.css";

type OriginSceneProps = {
  chapters: readonly StoryChapter[];
};

export function OriginScene({ chapters }: OriginSceneProps) {
  return (
    <section
      className={`${styles.scene} ${styles.originScene}`}
      data-scene="origin"
      aria-label="Before the bank"
    >
      <header className={styles.sceneHeader}>
        <p>06 / Before the bank</p>
        <div>
          <h2>The work had a name later.</h2>
          <p>
            Curiosity became software, a company and a second beginning before
            it became Business Analysis.
          </p>
        </div>
      </header>

      <ol className={styles.originTimeline}>
        {chapters.map((chapter, index) => (
          <li className={styles.originChapter} key={chapter.id}>
            <div className={styles.originMeta}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{chapter.eyebrow}</p>
            </div>
            <div className={styles.originCopy}>
              <h3>{chapter.title}</h3>
              {chapter.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {chapter.media ? (
              <figure className={styles.originMedia}>
                <Image
                  src={chapter.media.src}
                  alt={chapter.media.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 40vw"
                />
                {chapter.media.caption ? (
                  <figcaption>{chapter.media.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
          </li>
        ))}
      </ol>

      <Link className={styles.originLink} href="/story">
        Read the complete human route
      </Link>
    </section>
  );
}
