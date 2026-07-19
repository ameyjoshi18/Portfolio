import { dmtRail } from "@/content/experience";
import { getPublishedCaseStudies, getStoryChapters } from "@/content/selectors";
import { site } from "@/content/site";

import { SceneMarker } from "./SceneMarker";
import styles from "./experience.module.css";
import { CutoverScene } from "./scenes/CutoverScene";
import { EvidenceRegisterScene } from "./scenes/EvidenceRegisterScene";
import { OpenLine } from "./scenes/OpenLine";
import { OpeningSequence } from "./scenes/OpeningSequence";
import { OriginScene } from "./scenes/OriginScene";
import { RailsScene } from "./scenes/RailsScene";
import { TranslationScene } from "./scenes/TranslationScene";

export function Experience() {
  return (
    <div className={styles.experience}>
      <SceneMarker />
      <OpeningSequence />
      <TranslationScene />

      <RailsScene model={dmtRail} />

      <CutoverScene />
      <EvidenceRegisterScene caseStudies={getPublishedCaseStudies()} />
      <OriginScene chapters={getStoryChapters()} />
      <OpenLine profile={site} />
    </div>
  );
}
