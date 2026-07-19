export type Verification = "confirmed" | "review";

export type SceneId =
  | "unresolved"
  | "one-truth"
  | "translation"
  | "rails"
  | "cutover"
  | "evidence"
  | "origin";

export type RailNode = {
  id: string;
  label: string;
  owner: string;
  detail: string;
  desktop: readonly [number, number];
  mobile: readonly [number, number];
};

export type RailLeg = {
  id: string;
  from: string;
  to: string;
  state: "normal" | "failure" | "reconciliation";
  label: string;
};

export type DmtRailModel = {
  verification: Verification;
  nodes: readonly RailNode[];
  legs: readonly RailLeg[];
  reconciliationQuestion: string;
};

export type CutoverWorkstream = {
  id: string;
  label: string;
  depth: number;
  responsibility: string;
  verification: Verification;
};

export const stakeholderFragments = [
  { id: "business", label: "Business", text: "Make the journey clear and shippable." },
  { id: "compliance", label: "Compliance", text: "Keep every decision traceable." },
  { id: "engineering", label: "Engineering", text: "Define what the architecture must carry." },
  { id: "operations", label: "Operations", text: "Design the exception, not only the happy path." },
] as const;

export const translationStages = [
  { id: "intent", label: "Intent", detail: "What the business is actually trying to change." },
  { id: "constraints", label: "Constraints", detail: "What regulation, architecture and operations permit." },
  { id: "specification", label: "Specification", detail: "One buildable description shared across teams." },
  { id: "acceptance", label: "Acceptance", detail: "A shared definition of done and the evidence it needs." },
  { id: "production", label: "Production", detail: "Release, sign-off and stabilisation without surprises." },
] as const;

export const dmtRail: DmtRailModel = {
  verification: "confirmed",
  reconciliationQuestion: "If one leg fails, which state becomes the shared truth?",
  nodes: [
    { id: "agent", label: "Agent cash-in", owner: "Agent network", detail: "The instruction enters the rail.", desktop: [5, 50], mobile: [50, 5] },
    { id: "switch", label: "IMPS / NPCI switching", owner: "Payment rail", detail: "The instruction is routed toward the beneficiary bank.", desktop: [38, 26], mobile: [50, 34] },
    { id: "beneficiary", label: "Beneficiary credit", owner: "Beneficiary bank", detail: "The receiving account is credited or returns a result.", desktop: [70, 50], mobile: [50, 66] },
    { id: "reconciliation", label: "Reconciliation", owner: "Operations and ledger", detail: "The final state is matched across every leg.", desktop: [95, 30], mobile: [50, 95] },
  ],
  legs: [
    { id: "initiate", from: "agent", to: "switch", state: "normal", label: "Initiate" },
    { id: "route", from: "switch", to: "beneficiary", state: "failure", label: "Route and respond" },
    { id: "reconcile", from: "beneficiary", to: "reconciliation", state: "reconciliation", label: "Match final state" },
  ],
};

export const cutoverWorkstreams = [
  { id: "business", label: "Business", depth: -1.6, responsibility: "Scope and operational readiness", verification: "confirmed" },
  { id: "engineering", label: "Engineering", depth: -0.8, responsibility: "Build and integration readiness", verification: "confirmed" },
  { id: "qa", label: "QA", depth: 0, responsibility: "Validation evidence and defect decisions", verification: "confirmed" },
  { id: "infrastructure", label: "Infrastructure", depth: 0.8, responsibility: "Environment and execution readiness", verification: "confirmed" },
  { id: "vendors", label: "Vendors", depth: 1.6, responsibility: "External dependencies and coordinated handoffs", verification: "confirmed" },
] as const satisfies readonly CutoverWorkstream[];
