import type { DmtRailModel } from "@/content/experience";
import { buildRailPath, validateRailModel } from "@/lib/rail/geometry";

const model: DmtRailModel = {
  verification: "confirmed",
  reconciliationQuestion: "Which leg owns the unresolved state?",
  nodes: [
    {
      id: "agent",
      label: "Agent",
      owner: "Agent network",
      detail: "Cash-in instruction",
      desktop: [0, 50],
      mobile: [50, 0],
    },
    {
      id: "beneficiary",
      label: "Beneficiary bank",
      owner: "Issuer bank",
      detail: "Credit result",
      desktop: [100, 50],
      mobile: [50, 100],
    },
  ],
  legs: [
    {
      id: "leg",
      from: "agent",
      to: "beneficiary",
      state: "reconciliation",
      label: "Credit and result",
    },
  ],
};

it("accepts connected confirmed rail data", () => {
  expect(() => validateRailModel(model)).not.toThrow();
  expect(buildRailPath(model.nodes, "desktop")).toMatch(/^M 0 200 C/);
});

it("rejects review-state or dangling legs", () => {
  expect(() =>
    validateRailModel({ ...model, verification: "review" }),
  ).toThrow(/confirmed/i);
  expect(() =>
    validateRailModel({
      ...model,
      legs: [{ ...model.legs[0], to: "missing" }],
    }),
  ).toThrow(/unknown node/i);
});
