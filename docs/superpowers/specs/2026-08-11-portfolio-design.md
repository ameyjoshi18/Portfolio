# Amey Joshi Portfolio — Design Spec

**Status:** Approved by explicit user instruction to build autonomously ("Plan, build, test, and
deploy autonomously. Don't stop for permission on routine steps."). The brainstorming skill's
interactive approval gate is superseded by this direct instruction; this doc records the design
decisions that would normally be walked through turn-by-turn, so the reasoning is still auditable.

## Who / Why

Amey Joshi — Business Analyst, banking & payments (IDFC First → Fino Payments Bank), Navi Mumbai.
Co-founder of Zenox Technologies (software consultancy) and RB Esports (gaming café, Kolhapur).
Site must read as: a person who connects systems that don't talk to each other, at growing scale,
starting from a kid in Kodoli with no internet and a USB cable.

## The 3D Concept: "The Network"

One continuous WebGL scene spanning the page. A field of scattered, disconnected instanced nodes
at the top of the page; by the bottom, an ordered, structured, glowing lattice. The transformation
*is* the resume — no separate decorative hero.

Section-by-section state (camera moves on directed keyframes, GSAP ScrollTrigger drives a 0–1
progress value that lerps between named camera/scene states — never a free-orbit camera):

1. **Hero** — sparse, near-black field of dim points. No connections. One faint pulse crosses
   between two nodes and dies — the Kodoli PC, the Nokia, the USB cable, PC Suite over 2G.
2. **Zenox** — a small cluster of nodes begins linking, one edge at a time, unevenly (word of
   mouth, not a marketing funnel) — zero clients, then a slowly growing knot of connections.
3. **RB Esports** — a second, denser local cluster appears alongside (a LAN — a room full of
   machines). Two edges in this cluster dim to near-black and flicker (the two lockdowns), then
   restore — the business survives, doesn't restart from zero.
4. **IDFC First** — the loose clusters pull toward a more rigid, gridded formation. First taste of
   institutional structure: NRI-PIS, ASBA, Demat, API integrations as literal node-to-node edges.
5. **Fino / core migration** — the dramatic beat. A dense core cluster morphs from one structured
   form to another *without ever fully disconnecting* — FIS to Finacle, live. Radiating arms
   extend outward after: AePS, DMT, eKYC, mATM, EMV 3DS, NCMC — rails off a working core.
6. **Expertise** — the full graph is large and structured now. Scroll-scrubbed subgraph
   highlighting: DMT edges glow amber as that section is in view, then AePS, then Cards, etc.
7. **Close / contact** — camera pulls back. The whole lattice reads as one coherent, calm,
   fully-connected structure. Quiet, resolved, not triumphant.

Fully procedural: instanced points (`InstancedMesh` + custom shader for glow/pulse) + a dynamic
`LineSegments` buffer for edges, driven by a small deterministic graph-state model per section. No
imported models, no HDRI dependency — nothing to license-check, nothing over the 2MB budget,
nothing to break on mobile. Desktop: ~600 nodes, soft bloom-like glow via shader (no post-processing
bloom pass to keep frame budget), no shadows ever. Mobile/reduced tier: ~150 nodes, no per-frame
edge recompute (precomputed), capped pixel ratio 1.5. No-WebGL / reduced-motion: the entire canvas
is replaced by a static SVG/CSS rendition of the same idea (a still lattice illustration) — the
page is fully readable and complete without it.

## Design System

**Palette** (3 core + neutrals, no purple/violet, no gradients):
- `--ink` `#0B0E13` — near-black navy base (matches the portrait's own dark backdrop)
- `--paper` `#F3F0E6` — warm off-white neutral for text/surfaces (not stark digital white)
- `--copper` `#E8823C` — the single warm accent: literally the color of a wire making a connection
- `--signal` `#7FA37A` — muted sage-green, used *only* as a semantic "connected/live" indicator
  (status-dot green, not decorative) — this is the 3rd core color, used sparingly
- Neutrals: a 6-step navy-tinted gray scale derived from `--ink` for borders/secondary text

Rationale: the portrait itself is lit in cool navy with a violet rim-light — using violet as an
accent would tip straight into the banned "AI gradient" territory and would fight the photo.
Copper reads as *literal* (a soldered wire, a connection made) and is warm against the cold
banking-system subject matter. Sage-green borrows from status-LED conventions in the same domain
Amey works in (a settled transaction, a live core) — meaningful, not decorative.

**Type** (Fontshare, verified free for commercial use under the ITF Free Font License):
- **Ranade** (headings, nav, labels, data/mono-ish figures) — a geometric, slightly technical
  grotesk. Reads like engineering precision — release notes, system names, rail names.
- **Gambetta** (body copy) — a warm text serif built for long-form reading. Everything Amey says
  about Kodoli, the lockdowns, the loan payments needs to read like a person talking, not a SaaS
  product page — a serif at 17–19px/1.75 line-height/60–70ch measure does that.
This pairing literally encodes the site's spine: technical system (Ranade) meets human story
(Gambetta).

## Copy

Written first-person from the provided facts only. No invented metrics, clients, or testimonials.
Sections: Hero / Origin (Kodoli) / Zenox / RB Esports / IDFC First / Fino + core migration /
Expertise (6 areas, DMT deepest) / Contact.

## Stack

Next.js 15 (App Router, TS) · React 19 · @react-three/fiber v9 · @react-three/drei ·
three.js · GSAP + ScrollTrigger · Lenis · Framer Motion (motion/react) for DOM-layer transitions ·
Tailwind CSS for layout utilities (design tokens as CSS variables, not ad hoc hex).

## Performance / Accessibility gates (must pass before deploy)

- `npm run build` clean, zero TS errors
- 60fps desktop / 30fps+ under 4x CPU throttle on the 3D scene
- 4.5:1 text contrast everywhere
- Lighthouse 90+ Performance & Accessibility
- Zero console errors, no CLS, full keyboard tab order
- Working no-WebGL fallback and prefers-reduced-motion fallback, both a complete/readable site

## Explicitly out of scope

No CMS, no blog, no dark/light theme toggle (site is intentionally always-dark, matching the
portrait and the "system at night" mood), no contact form backend (mailto: link only — no server
to receive form submissions), no analytics beyond what Vercel provides by default.
