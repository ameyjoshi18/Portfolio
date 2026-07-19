import Image from "next/image";

import type { StoryChapter } from "@/content/schema";

import styles from "./story.module.css";

type StoryArticleProps = {
  chapters: readonly StoryChapter[];
};

export function StoryArticle({ chapters }: StoryArticleProps) {
  return (
    <article className={styles.story}>
      <header className={styles.storyHeader}>
        <p className={styles.kicker}>Before the bank / One human route</p>
        <h1>The work had a name later.</h1>
        <p>
          Before requirements, releases and payment rails, there was curiosity,
          a co-founder, a rented apartment, a gaming café and the stubborn habit
          of building through uncertainty.
        </p>
      </header>

      <div className={styles.chapterList}>
        {chapters.map((chapter, index) => (
          <section className={styles.chapter} key={chapter.id}>
            <div className={styles.chapterMeta}>
              <p>{String(index + 1).padStart(2, "0")}</p>
              <p>{chapter.eyebrow}</p>
            </div>
            <div className={styles.chapterCopy}>
              <h2>{chapter.title}</h2>
              {chapter.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {chapter.media ? (
              <figure className={styles.chapterMedia}>
                <Image
                  src={chapter.media.src}
                  alt={chapter.media.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 45vw"
                />
                {chapter.media.caption ? (
                  <figcaption>{chapter.media.caption}</figcaption>
                ) : null}
              </figure>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}
