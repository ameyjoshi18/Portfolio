import type { CaseStudy } from "@/content/schema";

export const publishedStudy: CaseStudy = {
  slug: "verified-engagement",
  publication: "published",
  title: "A verified engagement",
  summary: "A fixture used only by automated tests.",
  premise: "A bounded system change required coordinated delivery.",
  context: "The fixture contains no production claim.",
  mandate: "Create one shared delivery definition.",
  constraints: ["A fixed release boundary"],
  responsibility: "Translate and validate the delivery scope.",
  stakeholders: ["Business", "Engineering"],
  systemBoundaries: ["Source", "Destination"],
  processAndArtifacts: [
    {
      name: "Acceptance criteria",
      description: "Defined release evidence.",
    },
  ],
  tradeoff: "Prefer verifiable scope to unbounded breadth.",
  validationAndRelease: "Validate against agreed acceptance criteria.",
  outcome: { disclosure: "not-disclosed" },
  capabilities: ["Requirements", "UAT"],
};

export const draftStudy: CaseStudy = {
  ...publishedStudy,
  slug: "draft-engagement",
  publication: "draft",
};
