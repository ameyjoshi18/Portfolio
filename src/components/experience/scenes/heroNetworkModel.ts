export type NodeId =
  | "customer"
  | "agent"
  | "acquirer"
  | "npci"
  | "uidai"
  | "issuer"
  | "beneficiary"
  | "settlement";

type Point = { x: number; y: number };

export type NetworkNode = Point & {
  id: NodeId;
  label: string;
  hub?: boolean;
};

export const NODES: readonly NetworkNode[] = [
  { id: "customer", label: "CUSTOMER", x: 60, y: 380 },
  { id: "agent", label: "AGENT / DEVICE", x: 250, y: 380 },
  { id: "acquirer", label: "ACQUIRER SWITCH", x: 450, y: 380 },
  { id: "npci", label: "NPCI", x: 660, y: 380, hub: true },
  { id: "uidai", label: "UIDAI", x: 660, y: 140 },
  { id: "issuer", label: "ISSUER CBS", x: 890, y: 250 },
  { id: "beneficiary", label: "BENEFICIARY BANK", x: 890, y: 510 },
  { id: "settlement", label: "SETTLEMENT", x: 1120, y: 380 },
];

export const NODE_BY_ID: Record<NodeId, NetworkNode> = Object.fromEntries(
  NODES.map((node) => [node.id, node]),
) as Record<NodeId, NetworkNode>;

// Every undirected edge that appears in any route below, used to draw the
// idle rail structure once.
export const EDGES: readonly [NodeId, NodeId][] = [
  ["customer", "agent"],
  ["agent", "acquirer"],
  ["acquirer", "npci"],
  ["npci", "uidai"],
  ["npci", "issuer"],
  ["npci", "beneficiary"],
  ["npci", "settlement"],
];

type RouteStep = {
  from: NodeId;
  to: NodeId;
  speed: "outbound" | "return";
  /** Node to flag as a cash-out / confirmation beat once this step lands. */
  beat?: "cash-out" | "confirmation";
  /**
   * The settlement leg is a separate bank-side process NPCI initiates after
   * cash-out/confirmation, not a continuation of the customer-facing packet
   * — it does not pick up from wherever the previous step physically ended,
   * so the packet fades in fresh here instead of visibly jumping node to node.
   */
  teleport?: boolean;
};

export type RouteId = "AePS" | "mATM" | "DMT";

export type Route = {
  id: RouteId;
  caption: string;
  steps: readonly RouteStep[];
};

const BACKBONE_OUT: RouteStep[] = [
  { from: "customer", to: "agent", speed: "outbound" },
  { from: "agent", to: "acquirer", speed: "outbound" },
  { from: "acquirer", to: "npci", speed: "outbound" },
];

const BACKBONE_RETURN: RouteStep[] = [
  { from: "acquirer", to: "agent", speed: "return", beat: "cash-out" },
];

export const ROUTES: readonly Route[] = [
  {
    id: "AePS",
    caption: "AePS — Aadhaar-authenticated cash-out",
    steps: [
      ...BACKBONE_OUT,
      { from: "npci", to: "uidai", speed: "outbound" },
      { from: "uidai", to: "npci", speed: "outbound" },
      { from: "npci", to: "issuer", speed: "outbound" },
      { from: "issuer", to: "npci", speed: "return" },
      { from: "npci", to: "acquirer", speed: "return" },
      ...BACKBONE_RETURN,
      { from: "npci", to: "settlement", speed: "outbound", teleport: true },
    ],
  },
  {
    id: "mATM",
    caption: "mATM — card and PIN cash-out",
    steps: [
      ...BACKBONE_OUT,
      { from: "npci", to: "issuer", speed: "outbound" },
      { from: "issuer", to: "npci", speed: "return" },
      { from: "npci", to: "acquirer", speed: "return" },
      ...BACKBONE_RETURN,
      { from: "npci", to: "settlement", speed: "outbound", teleport: true },
    ],
  },
  {
    id: "DMT",
    caption: "DMT — IMPS transfer to beneficiary",
    steps: [
      ...BACKBONE_OUT,
      { from: "npci", to: "beneficiary", speed: "outbound" },
      { from: "beneficiary", to: "npci", speed: "return" },
      { from: "npci", to: "acquirer", speed: "return" },
      {
        from: "acquirer",
        to: "agent",
        speed: "return",
        beat: "confirmation",
      },
      { from: "npci", to: "settlement", speed: "outbound", teleport: true },
    ],
  },
];

export const OUTBOUND_MS = 620;
export const RETURN_MS = 340;
export const STEP_PAUSE_MS = 90;
export const ROUTE_PAUSE_MS = 1400;

export function edgeKey(a: NodeId, b: NodeId): string {
  return [a, b].sort().join("|");
}
