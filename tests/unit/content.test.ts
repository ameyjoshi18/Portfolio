import {
  assertContentIntegrity,
  selectPublishedCaseStudies,
} from "@/content/selectors";

import { draftStudy, publishedStudy } from "../fixtures/content";

describe("content publication boundary", () => {
  it("excludes draft case studies", () => {
    expect(selectPublishedCaseStudies([draftStudy, publishedStudy])).toEqual([
      publishedStudy,
    ]);
  });

  it("rejects duplicate case-study slugs", () => {
    expect(() =>
      assertContentIntegrity({
        caseStudies: [publishedStudy, { ...publishedStudy }],
        roles: [],
      }),
    ).toThrow(/duplicate case-study slug/i);
  });

  it("rejects an incomplete published dossier", () => {
    expect(() =>
      assertContentIntegrity({
        caseStudies: [{ ...publishedStudy, mandate: "" }],
        roles: [],
      }),
    ).toThrow(/mandate/i);
  });

  it("accepts a truthful non-disclosed outcome", () => {
    expect(() =>
      assertContentIntegrity({
        caseStudies: [
          { ...publishedStudy, outcome: { disclosure: "not-disclosed" } },
        ],
        roles: [],
      }),
    ).not.toThrow();
  });
});
