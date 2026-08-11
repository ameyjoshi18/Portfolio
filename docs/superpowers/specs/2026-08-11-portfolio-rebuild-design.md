# Amey Joshi Portfolio — Rebuild Design Spec (v2, light)

**Status:** Approved by explicit user instruction to build autonomously. Brainstorming's
interactive gate is superseded per the same standing instruction as the v1 build; this
doc records the reasoning that would normally be walked through turn-by-turn.

## What changed and why (per user brief)

1. Dark-with-glow reads as AI-generated now. Inverting to light-dominant, flat-color
   blocks — color from solid fills, not gradients or glow.
2. Life story (Kodoli origin, Zenox, RB Esports, IDFC chronology) moves to `/story`
   (placeholder page only — not built out this round).
3. Homepage is about *now*: current role, what he knows, what he's building.
4. New "Building" section: RegLens AI (Tabularium) + Node Factory, honestly framed as
   in-progress work, not shipped products.

## Palette — light base, 3 core colors + neutrals, dark as punctuation only

Contrast-checked by hand (WCAG relative luminance), not eyeballed:

| Token | Hex | Role | Verified pairs |
|---|---|---|---|
| `--paper` | `#FAF4E8` | base background (warm cream, not stark white) | ink text 16.2:1 |
| `--paper-warm` | `#F2E8D5` | secondary panel tone, no card borders needed | — |
| `--ink` | `#1C1712` | primary text everywhere; background of the ONE dark section | paper text 16.2:1 |
| `--ink-soft` | `#4A423A` | secondary/muted text on paper | 9.0:1 |
| `--terracotta` | `#A83D0D` | core accent 1 — the "wire/connection" color from v1, now a flat block, not a glow | paper text 5.7:1 both directions |
| `--green` | `#14663F` | core accent 2 — ledger/settled green | paper text 6.4:1 both directions |

Rule locked in during contrast-checking: on any colored block (terracotta/green/ink),
body text is always `--paper`. On `--paper`/`--paper-warm`, body text is always `--ink`
or `--ink-soft`. Never mix (e.g. never ink-on-terracotta, never terracotta-as-text-on-ink)
— several of those combinations measured under 4:1 and were cut rather than shipped
at a fudged contrast.

Section backgrounds (this is where "dark is punctuation" is enforced numerically —
1 of 7 sections is dark, not "one or two dark, five light" which would just be dark mode
with extra steps):

1. Hero — paper
2. Portrait — paper-warm
3. Now (current role) — terracotta block
4. Expertise — paper
5. Building — **ink** (the one dark section — "working after hours")
6. Story teaser — green block
7. Contact — paper

## Typography — Fontshare, verified free for commercial use

- **Clash Grotesk** — headings, labels, nav. Bold, geometric, poster-confident; built
  for exactly this "flat color block with big type" register.
- **Gambetta** — body copy (carried over from v1; already proven comfortable at
  17–19px / 1.75 line-height / 60–70ch measure, no reason to replace a typeface that
  works for reading, only the one that was standing in a dark technical register).

Pairing logic: Clash Grotesk is the energy — reaching for what's new, twenty years of
it. Gambetta is the person actually telling you about it, comfortably.

## Grain

Flat color without texture reads templated. A fixed, full-viewport SVG feTurbulence
overlay at very low opacity (`mix-blend-mode: overlay`, ~4% strength) sits above the
canvas and content. Pure CSS/SVG, procedurally generated, no asset file, negligible
performance cost.

## The 3D concept — "Rails," seven states, one persistent scene

Flat-shaded (toon-stepped, 2–3 discrete tone bands — no smooth gradient, no bloom/glow)
instanced blocks in the three core colors, procedurally laid out, continuously
interpolating position/color/count-emphasis between seven hand-placed states as the
camera moves on a directed GSAP ScrollTrigger + Lenis path. The canvas background color
itself interpolates in lockstep with each section's palette, so the seam between
"the 3D" and "the page" doesn't exist — one surface, as instructed.

1. **Hero** — a loose, gently tumbling scatter of blocks, unresolved. Establishing shot.
2. **Portrait** — blocks recede to the frame edges, quiet, giving the photo the room
   the brief asks for ("use it once, large").
3. **Now** — blocks pull into a tight, confident vertical arrangement — a skyline / bar
   read — against the terracotta background. This is "what he does right now."
4. **Expertise** — six blocks laid out in sequence, each scaling up and brightening as
   its matching list item scrolls into view (deepest-first: DMT gets first and longest
   attention). This satisfies "each of the six areas gets its own moment" without
   spinning up six separate scenes.
5. **Building** — the one dark beat. Blocks scatter looser again, more experimental,
   against ink — "after hours, in the workshop."
6. **Story teaser** — blocks elongate into a single thread pointing off-frame, toward
   the idea that there's a longer story at `/story`.
7. **Contact** — blocks resolve into a calm, settled, near-symmetrical close.

Geometry: instanced rounded boxes (procedural, no imported models). Material: a small
custom step-shaded material (three discrete lightness bands from a fixed light
direction) so shapes read as solid and dimensional without ever producing a smooth
gradient. No additive blending, no bloom pass — flat means flat.

## Copy

First person, from the facts only. Homepage: Hero / Portrait / Now (Fino, current) /
Expertise (six areas) / Building (RegLens AI, Node Factory — honest, in-progress
framing, no invented users/revenue/metrics) / Story teaser / Contact. `/story` is a
placeholder ("coming soon") this round.

## Performance tiers

Same tiering approach as v1 (full/reduced/off via WebGL + reduced-motion + hardware
checks), instance counts re-budgeted for the new geometry (~120 blocks desktop / ~40
mobile — far fewer than v1's node count since each block is visually heavier and the
aesthetic is deliberately sparse, not a dense field).
