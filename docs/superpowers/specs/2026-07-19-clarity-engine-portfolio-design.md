# Amey Joshi Portfolio Rebuild — Design Specification

**Date:** 2026-07-19  
**Status:** Draft for Amey's review  
**Working concept:** The Clarity Engine

## 1. Decision summary

Rebuild the portfolio as a cinematic, editorial website that demonstrates Amey's way of working: ambiguity enters, one clear system emerges.

The experience will be lavish without becoming decorative. Its signature device is a single **one truth line** that changes meaning as the visitor moves through the site:

`stakeholder divider → specification axis → payment rail → cutover timeline → career line → contact signature`

The site will have two equally intentional ways in:

- **Experience** at `/`: an immersive, scroll-led narrative with semantic motion and one restrained 3D set piece.
- **Index** at `/index`: a fast, editorial evidence dossier for visitors who want direct access to work, capabilities, career and contact information.

Both views will use the same structured content. Neither will be a secondary fallback.

## 2. What the site must achieve

The site must let a visitor:

1. Understand who Amey is and what he does within ten seconds.
2. See credible banking and delivery depth within ninety seconds.
3. Explore specific work without completing a long animation.
4. Remember the founder-to-banking story after leaving.
5. Contact Amey from every primary route.

The primary audience is broader than recruiters: banking and fintech leaders, product and engineering collaborators, founders, peers, and curious people should all find a meaningful route through it.

## 3. Creative premise

“Clarity Engine” is an internal art-direction name, not a fake product brand displayed throughout the site.

The website behaves like Amey's work. Four perspectives—business, compliance, engineering and operations—begin on separate planes. A single line creates shared structure. As the visitor progresses, that line becomes the organizing principle for requirements, transaction movement, migration coordination, career history and finally the contact invitation.

The originality must come from domain-specific material: stakeholder conflict, requirement translation, payment legs, failure states, reconciliation, UAT, release governance, the FIS-to-Finacle migration, and the founder/gaming-café origin. If a visual could be transferred unchanged to a crypto, AI or developer portfolio, it does not belong.

## 4. Design principles

- **Content before spectacle.** Identity, headings, proof and links exist in server-rendered HTML before enhancement runs.
- **One device, many meanings.** The one truth line replaces the current collection of particles, terminal UI, transaction simulation, train journey and HUD effects.
- **Motion explains.** Every animation must clarify a relationship, state change, handoff, failure condition or career transition.
- **Proof is direct.** Case studies receive real routes and can be opened without navigating the cinematic sequence.
- **Specificity beats metrics theatre.** Use real artifacts and NDA-safe facts. Never invent outcomes, volumes, dashboards or team sizes.
- **Warmth carries the majority.** Roughly 70% of the site is warm ivory and graphite. Obsidian is reserved for the cutover climax.
- **Mobile is an edit, not a shrink.** Mobile has a shorter vertical rhythm and a simplified visual composition while retaining all evidence.

## 5. Explicit non-goals

- No fake money-transfer form or gamified “send money” interaction.
- No 12.5-screen-height spacer, scroll hijacking or mandatory cinematic journey.
- No perpetual particle field, generic glowing nodes, glass panels, gradient text or neon cyberpunk styling.
- No global custom cursor.
- No AI-generated documentary imagery. The three current remittance illustrations will be retired.
- No invented testimonials, metrics, client names or NDA-sensitive claims.
- No duplicate story and homepage content maintained separately.

## 6. Information architecture

| Route | Purpose | Motion level |
|---|---|---|
| `/` | The Clarity Engine cinematic experience | High but semantic |
| `/index` | Fast evidence dossier | Low |
| `/work` | Complete work and capability register | Low |
| `/work/[slug]` | Deep-linkable case study | Medium, editorial |
| `/story` | Concise human origin story | Medium, image-led |
| `/resume.pdf` | Downloadable resume when supplied | None |

Global navigation will contain the Amey Joshi wordmark, Work, Story, Contact, and an ordinary **Experience / Index** route control. The control uses real links, not a JavaScript-only toggle, so browser history, sharing, SEO and keyboard behavior remain correct.

The Experience route adds a compact `01 / 07` scene marker. It is orientation, not a sci-fi HUD.

Every primary HTML route ends with the same semantic contact footer using `id="contact"`; its local navigation link is `#contact`. Cross-route calls to action link to `/index#contact`, providing one stable, low-motion destination without adding an unnecessary contact page.

## 7. Experience route: scene sequence

### Scene 1 — Unresolved

The site opens immediately with readable identity and no preloader. Amey's name and promise are present at first paint in their final semantic reading order. Four short requirement fragments occupy separate typographic planes around that anchor: business urgency, compliance traceability, engineering constraints and operational recoverability. On capable devices, those stakeholder planes use shallow scroll-linked depth to express their separation; there is no decorative pointer chase.

A thin amber line enters the composition. It establishes the axis that the fragments will eventually share.

The accessible H1 contains the identity and promise: **“Amey Joshi — Complexity in. Clarity out.”** The proposed supporting line is: “I turn business intent, regulatory constraint and technical reality into one system teams can ship.” Final wording may be tightened during content editing. With JavaScript disabled or reduced motion enabled, this scene appears in the fully aligned state.

### Scene 2 — One Truth

The line reorganizes the conflicting fragments into a precise grid around the already-readable name and promise. It changes the emphasis and relationship of the material; it never withholds Amey's identity.

This alignment completes as the first short scroll gesture on enhanced devices. The initial viewport is already legible, and reduced-motion or no-JavaScript users see the resolved composition immediately.

### Scene 3 — Translation

One realistic requirement passes through five stages:

`intent → constraints → specification → acceptance → production`

The visual shows what each stakeholder contributes and what artifact creates agreement: discovery, process maps, BRD/FRD or user stories, acceptance criteria, UAT and release sign-off. Hover, focus or tap reveals concise explanatory notes; essential copy remains visible without interaction.

The scene should feel like watching Amey think, not like viewing a generic process diagram.

### Scene 4 — Rails

The one truth line becomes a representative DMT journey, using only validated actors and terminology. An amber marker traverses the route once. At selected boundaries, the composition reveals ownership, a possible failed leg and the reconciliation question that a customer never sees.

This replaces the fake-transfer kiosk. The visitor observes the system rather than pretending to transact. AePS, cards, wider rails and core banking remain available as evidence links around the main journey instead of becoming six equal cards.

### Scene 5 — Cutover

This is the emotional and visual climax, and the only predominantly dark chapter. The line branches into validated parallel workstreams—the current working list is business, engineering, QA, infrastructure and vendors—then converges into a constrained core-banking migration window.

The interaction communicates coordination under pressure without fabricating dates, counts or dashboards. A restrained 2.5D/WebGL treatment provides depth, but all meaning is duplicated in semantic HTML and a static SVG/poster fallback.

The WebGL treatment is a committed signature scene with one semantic job: concurrent workstreams occupy separate depth planes, move at different rates, and synchronize into one release window. It will not render generic particles, a fictional control room or decorative 3D objects. If confirmed source material cannot support this model, the scene is redesigned before implementation rather than filled with invented detail.

This scene is provisional until Amey confirms the NDA-safe account of the FIS-to-Finacle work.

### Scene 6 — Evidence Register

The palette returns to warm ivory. One to three verified editorial dossiers appear across the grid, not rounded cards. The first likely dossier is the bounded core-migration engagement; the other current themes are candidates, not guaranteed case studies:

1. **Replacing the tracks under a moving bank** — core migration, pending confirmation.
2. **The failure loop nobody sees** — publish as a case study only if it maps to one verified bounded engagement; otherwise make it a system note.
3. **One truth across many teams** — publish as a case study only if it maps to one verified bounded engagement; otherwise make it a practice note.

Each case-study dossier shows context, constraint, Amey's contribution, artifacts and outcome, then links to a dedicated route. The composition may ship with one or two excellent studies; it will never pad a three-column shape with composite, provisional or content-free entries. Titles and claims remain provisional until content validation.

### Scene 7 — Before the Bank / Open Line

The system language softens into documentary storytelling: Kodoli, Bharati Vidyapeeth, the college-deployed software, Zenox Technologies, COVID, RB Esports, the move into Business Analysis, and banking.

This chapter uses real photographs, scans or artifacts when available. It does not reuse the current stylized remittance illustrations. The train metaphor may survive as one quiet editorial sentence, not as a second interaction system.

The conclusion is nearly empty. The one truth line becomes a signature underline beneath a direct contact invitation, with email and LinkedIn visible as text links.

## 8. Index route

The Index is a dense but elegant evidence view designed for a 60–90 second scan:

1. Identity, current role, location and positioning.
2. Selected work with direct case-study links.
3. Domain register: DMT, AePS, cards, UPI/NACH/POS/mATM, core banking and delivery governance.
4. Working method: define, design, validate, deliver.
5. Career timeline.
6. Short founder-to-banking note.
7. Contact and resume link when available.

It uses the same type, grid and one truth line, but no pinned scenes, WebGL or information hidden behind hover. It is not a plain résumé page.

## 9. Case-study model

Every case study will use the same factual structure:

- Premise
- Context
- Mandate
- Constraints
- Amey's responsibility
- Stakeholders and system boundaries
- Process and artifacts
- Decision or trade-off
- Validation and release approach
- Outcome or explicitly stated “not disclosed” note
- Related capabilities

The initial source provides credible themes but not enough verified outcomes. The following statements require Amey's confirmation before prominent publication: FIS-to-Finacle involvement; dates and titles at Zenox, IDFC FIRST Bank via Honeybee, and Fino Payments Bank; work across NRI-PIS, ASBA, Demat, APIs, AePS, DMT, eKYC, mATM and 3DS; and scale language such as “millions,” “hundreds of people,” “dozens of builds,” or “three financial institutions.”

## 10. Visual system

### Color

- `Ivory / #F2EEE5` — primary canvas, approximately 70% of the experience.
- `Graphite / #161A1D` — primary type and rules.
- `Obsidian / #070A0D` — cutover chapter only.
- `Signal amber / #E7A11A` — the one truth line and large key states on obsidian; decorative only on ivory.
- `Signal ink / #765000` — accessible accent text on ivory.
- `Steel / #525B60` — secondary copy and small metadata.
- `Fault / #963D32` — genuine exception/error states only.

There are no gradient fills. Hierarchy comes from scale, weight, spacing, rules and contrast. Amber is never the sole cue for focus or state. Keyboard focus uses a graphite outline with an amber offset accent, while text links retain underline/weight changes.

### Typography

- **Instrument Serif** — display voice; expressive, editorial and human.
- **IBM Plex Sans** — neutral working voice for body copy and navigation.
- **IBM Plex Mono** — limited to artifacts, state labels and technical metadata.

Fonts will be locally hosted and subsetted. If licensing or language coverage becomes a constraint, the replacement must preserve the same roles rather than defaulting to Inter.

Type scale:

- Hero: `clamp(4rem, 10vw, 9rem)` at `0.9` line-height.
- Display: `clamp(3rem, 6vw, 6rem)` at `0.95`.
- Section heading: `clamp(2rem, 4vw, 4rem)` at `1.0`.
- Subheading: `clamp(1.25rem, 2vw, 2rem)` at `1.15`.
- Lead: `clamp(1.125rem, 1.5vw, 1.375rem)` at `1.55`.
- Body: `1rem` at `1.65`.
- Label: `0.75rem` at `1.2`, tracked and used sparingly.

### Grid and shape

- Twelve-column desktop grid with deliberately asymmetric spans.
- Outer gutters: 24px mobile, 40px tablet, 64–80px desktop.
- Spacing follows an 8px base with deliberate 24/40/64/96/144px chapter rhythms.
- Corners remain square or subtly softened at 2–6px. Pills are reserved for the view control and compact tags.
- Hairline rules, alignment and whitespace replace card shadows.

## 11. Motion system

Only three verbs are allowed:

- **Drift:** unresolved items move independently by 8–32px across no more than three depth planes.
- **Align:** elements settle onto a shared axis in 480–700ms using spring or eased spatial movement.
- **Flow:** one amber marker traverses an already-readable route once; only one flow may be active in a viewport.

Motion constraints:

- Native scrolling only; no Lenis, wheel interception or synthetic scroll velocity.
- At most two pinned sequences, each short and never required to reveal essential content.
- No generic fade-up applied to every section.
- Parallax uses transforms only and remains shallow.
- No autoplay sound in v1.
- Animations pause when offscreen or when the document is hidden.
- Reduced motion presents every scene in its resolved state and replaces the 3D chapter with a static composition.

Before choreography is designed, every scene must have at least one verified artifact, decision or domain fact that determines its composition. Decorative motion is removed if it cannot pass that evidence gate.

## 12. Responsive direction

Desktop uses the full spatial composition. Tablet reduces the number of simultaneous planes. Mobile becomes a vertical editorial sequence:

- Stakeholder fragments stack around the vertical one truth line.
- Translation stages become an ordered vertical handoff.
- The rail becomes a scroll-readable SVG route.
- Cutover uses the static/SVG composition by default.
- Dossiers become full-width editorial chapters, not a carousel.
- No horizontal scroll simulation, hover-only content or empty pinned stretches.
- Touch targets are at least 44×44px.

The design must remain complete from 320px through large desktop widths with no horizontal overflow.

## 13. Accessibility and resilience

- One H1 per route, logical heading hierarchy, `<main>` landmarks and a visible skip link.
- Keyboard-visible focus using signal amber plus a non-color indicator.
- WCAG AA contrast for body text and controls.
- Canvas is decorative and `aria-hidden`; its meaning exists in adjacent HTML.
- All interaction has keyboard and touch equivalents.
- `prefers-reduced-motion` removes scroll-linked transforms, parallax and camera movement without redirecting the visitor.
- `Save-Data`, low-power devices or WebGL failure receive the static composition.
- The portfolio remains understandable with JavaScript disabled.
- No placeholder-only form labels. Contact uses direct links rather than an unnecessary form in v1.

## 14. Technical architecture

Rebuild in the existing repository and preserve Git history.

- Next.js App Router on Vercel.
- Strict TypeScript and pnpm.
- React Server Components by default; small, scene-scoped client boundaries only.
- Motion imported from `motion/react` for DOM and SVG choreography.
- CSS custom-property tokens with CSS Modules for the bespoke visual system.
- SVG/DOM for most visuals.
- `three` + `@react-three/fiber` only for the committed, lazy-loaded cutover scene, with no Drei dependency unless a measured helper earns its bundle cost.
- `next/font` for local fonts and `next/image` for responsive media.
- No database, CMS or backend in v1.
- Route-specific titles, descriptions, canonical URLs and social images, plus Person JSON-LD, sitemap, robots rules and a designed not-found page.
- Vercel/Next headers for sensible caching and baseline browser security.

Structured source files will prevent copy drift:

- `content/site.ts`
- `content/roles.ts`
- `content/case-studies.ts`
- `content/story.ts`

The old monolithic HTML, duplicate inline CSS/JavaScript and CDN-loaded GSAP, ScrollTrigger, Lenis and Three.js runtimes will not be carried forward.

## 15. Performance budgets

- Production mobile p75: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1.
- `/index`, `/work/*` and `/story`: ≤100KB compressed initial client JavaScript.
- `/`: ≤180KB compressed initial client JavaScript before optional 3D.
- Lazy 3D chunk: ≤300KB compressed and never on the LCP path.
- Initial Experience transfer: ≤650KB including HTML, CSS, fonts and LCP media.
- Initial Index transfer: ≤350KB.
- LCP media: ≤200KB.
- Initially loaded fonts: ≤160KB total.
- One WebGL canvas maximum; DPR capped around 1.5 desktop and 1.25 mobile.

Bundle analysis, Lighthouse CI, Playwright smoke tests, axe checks and representative visual-regression snapshots will enforce these boundaries.

## 16. Content and asset policy

Preserve and edit the strongest current language:

- “Complexity in. Clarity out.”
- The business/engineering translation narrative.
- The input → process → output method.
- The domain-specific banking vocabulary.
- The founder → banking arc and its strongest reflective lines.

Retire:

- The fake transaction and receipt.
- The train-based 3D journey as a standalone interface.
- The three stylized remittance illustrations.
- Decorative terminal copy, fabricated timestamps and generic system theatre.

Needed from Amey before final content lock:

- Confirmation/correction of roles, dates and domain claims.
- NDA-safe details for the three proposed case studies.
- Any real, defensible outcomes; absence of a metric is acceptable.
- A high-resolution approved portrait.
- Real photos or artifacts from college, Zenox, RB Esports or the banking journey, if available.
- Current resume PDF, if it should be offered.

Implementation can begin with clearly marked content records while these materials are gathered. Unverified claims will not be embellished.

## 17. Acceptance criteria

The redesign is ready to ship when:

- A first-time visitor can state Amey's role and value proposition after the opening viewport.
- Every primary proof point is reachable from `/index` or `/work` without completing the Experience.
- Motion visibly explains the work and obeys the Drift / Align / Flow grammar.
- The one truth line remains coherent through all seven scenes.
- No current AI-generated illustration or generic dark-tech device remains.
- Content is complete and navigable with JavaScript disabled and reduced motion enabled.
- There is no horizontal overflow at supported breakpoints.
- Performance and accessibility budgets pass in production-mode testing.
- Every published claim is either confirmed by Amey or explicitly framed without unsupported specificity.

## 18. Locked direction after approval

Approval of this document locks the central concept, route model, scene order, visual system, motion grammar and architecture. Copy, exact scene choreography and asset selection may still be refined during implementation, but changes that alter the premise or information architecture require a design-spec amendment before code changes.
