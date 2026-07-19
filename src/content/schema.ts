export type PublicationState = "draft" | "published";

export type Outcome =
  | { disclosure: "public"; text: string }
  | { disclosure: "not-disclosed" };

export type CaseStudy = {
  slug: string;
  publication: PublicationState;
  title: string;
  summary: string;
  premise: string;
  context: string;
  mandate: string;
  constraints: readonly string[];
  responsibility: string;
  stakeholders: readonly string[];
  systemBoundaries: readonly string[];
  processAndArtifacts: readonly { name: string; description: string }[];
  tradeoff: string;
  validationAndRelease: string;
  outcome: Outcome;
  capabilities: readonly string[];
};

export type Role = {
  id: string;
  organisation: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  publication: PublicationState;
};

export type StoryChapter = {
  id: string;
  eyebrow: string;
  title: string;
  body: readonly string[];
  media?: { src: string; alt: string; caption?: string };
};

export type SiteProfile = {
  name: string;
  headline: string;
  positioning: string;
  role: string;
  location: string;
  email: string;
  linkedin: string;
  resumeHref?: string;
  domains: readonly string[];
  method: readonly { verb: string; detail: string }[];
};
