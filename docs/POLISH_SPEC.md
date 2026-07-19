# GhanaComps — "Apple-Craft" Polish Spec

> A **refinement layer** on top of the shipped "Matchday Broadcast + Broadsheet"
> revamp (`REVAMP_SPEC.md`). Not a redesign. The loud heroes, gold/Ghana-flag
> palette, ticker, chevrons, ledger and broadsheet columns all stay. This spec
> adds Apple-grade fit-and-finish on top: more deliberate whitespace, tighter
> optical type, subtle depth/materials (frosted glass, layered soft shadows,
> hairlines), smoother spring motion, and obsessive alignment.
>
> **One line:** *same soul, finer finish.*
>
> **Hard constraints (unchanged from the brief §0):** tokens/palette preserved —
> **no new brand colors, no palette drift**; content frozen (visual only); dark
> **and** light must both work; the `.editable[data-eid]` / `body.edit` admin
> seams, shadcn `<Button>`/`<Card>`, and the Stripe → Nav → content → Footer →
> Stripe shell stay intact. We **may** add ADDITIVE tokens for new *materials*
> and *motion* only (glass surface, refined shadow tiers, spring easings) — every
> one is defined in §3 and traces back to existing color channels.

---

## 0. What "Apple craft" means for THIS site (not platitudes)

Five testable moves. Each is a specific, measurable change to what already
ships — not a generic aspiration.

1. **Confidence to let content breathe.** The current build is dense and
   edge-tight (a faithful port of the compact original). We buy back air at the
   *section* and *block* scale — bigger vertical section rhythm, more headline→
   body gap, more gutter between hero columns — **without** touching the
   information density of the ledger/scoreboard (those stay scannable). Air goes
   *between* things, not *inside* the dense grids.

2. **Typographic discipline.** Playfair display heads get slightly tighter
   optical tracking as they get larger (Apple's optical sizing habit); body/lead
   copy gets *looser* tracking + a touch more leading for calm reading. Every
   headline aligns to a baseline grid off the 4px scale. No size changes to the
   `--fs-*` scale itself — only *which* step is used where, plus tracking/leading.

3. **Materials, used sparingly.** Frosted glass (backdrop-blur) appears on
   exactly **three** surface types: the nav (already there — we only refine it),
   the hero news-feed panel, and the sticky page-header when content scrolls
   under it. Everything else stays opaque. Depth comes from a **three-tier soft
   shadow** system, not from borders alone. Hairlines stay 1px `--line`.

4. **Motion with spring.** Replace linear/ease hovers with an ease-out "spring"
   curve and a consistent short duration. Add one restrained entrance: hero and
   cards rise + settle on scroll. Depth on hover is a **1–3px lift + shadow
   tier bump**, never a scale jump on large surfaces. All gated on
   `prefers-reduced-motion`.

5. **Pixel fit-and-finish.** One radius per surface class (no mixing 2/3/4px on
   sibling cards), consistent shadow/border pairing, optical alignment of the
   score-bug to headline cap-height, and the hero feed panel top-aligned to the
   headline — the two alignment risks called out in `REVAMP_SPEC.md §5`.

**Guardrail:** if a refinement makes the page *quieter than its personality*
(e.g. Home stops feeling like a broadcast), it has overshot. Polish the finish,
keep the volume.

---

## 1. System-level move A — Whitespace & section rhythm

The single biggest lever. All values are existing `--space-*` steps; we are
re-mapping *which step* is used, never inventing spacing.

### 1.1 Section vertical rhythm (the headline change)

| Surface | Current | Polished | Token |
|---|---|---|---|
| `section` desktop padding | `52px` (`--space-10xl`) | **`60px`** | `--space-11xl` |
| `section` ≤768 padding | `40px` (`--space-9xl`) | `40px` (unchanged) | `--space-9xl` |
| `.gc-pagehead` desktop | `52px … 40px` | **`60px … 52px`** | `--space-11xl` / `--space-10xl` |
| `.gc-hero` desktop | `60px` (`--space-11xl`) | `60px` (unchanged — already generous) | `--space-11xl` |
| Footer top padding | `36px` (`--space-8xl`) | `36px` (unchanged) | `--space-8xl` |

> Rationale: sections currently share the same 52px as the page-header, so the
> whole page reads at one dense tempo. Bumping body sections to 60px and the
> page-header bottom to 52px opens the rhythm one full step — the Apple "each
> band gets room" feel — while mobile stays compact (small screens don't want
> the air, and the 768 stop is untouched so we don't regress the phone view).

### 1.2 Block-level rhythm (inside sections)

| Gap | Current | Polished | Token |
|---|---|---|---|
| Eyebrow → `gc-h2` | (default) | `--space-md` (10px) | `--space-md` |
| `gc-h2` → lead/first content | `--space-xl` (14px) | **`--space-5xl`** (24px) | `--space-5xl` |
| Section head block → grid | `--space-6xl`/`5xl` | **`--space-8xl`** (36px) | `--space-8xl` |
| Hero grid column gutter | `--space-9xl` (40px) | **`--space-10xl`** (52px) | `--space-10xl` |
| `gc-segcards` top margin | `--space-6xl` (28px) | **`--space-8xl`** (36px) | `--space-8xl` |
| Card CTA → card body | `--space-xl` | keep `--space-xl` | — |

> The head-to-content gap is where "breathing room" is felt most. Moving the
> `gc-h2 → content` gap from 14px to 24px, and section-head → grid to 36px, is
> the change a viewer reads as "more considered" without any density loss inside
> the grids themselves.

### 1.3 What does NOT change
- Ledger row padding (`--space-lg 0`), scoreboard cell padding
  (`--space-3xl/4xl`), seam-grid gap (`--space-3xs`), card inner padding
  (`24px`). **Density pages keep their density.** Air is added around blocks,
  never inside the scannable grids.

---

## 2. System-level move B — Type refinement (optical discipline)

No changes to the `--fs-*` scale. Only tracking, leading, and which step is
used. Playfair is optically heavy at large sizes and thin at small — we lean
into that the way Apple leans on optical sizing.

### 2.1 Display tracking ladder (tighter as bigger)

| Element | Size token | Current tracking | Polished tracking |
|---|---|---|---|
| `.gc-hero-title` | `--fs-d1` | `-0.02em` | **`-0.025em`** |
| `.gc-ph-title` / `.gc-h2` | `--fs-d2` | `-0.015em` | **`-0.02em`** |
| `.gc-rule-l` / `.gc-col-head` | `--fs-d3` | `-0.01em` | **`-0.014em`** |
| `.gc-entry-name` | `--fs-xl` | `0` | `-0.005em` |
| `.gc-lname` | `--fs-2xl` | `0` | `-0.008em` |

> Uppercase Playfair at hero scale genuinely reads better tighter — the caps
> gain authority and the word locks into a single mass. Small optical negatives
> only; nothing that clips glyphs.

### 2.2 Reading & lead copy (looser, calmer)

| Element | Change | Token |
|---|---|---|
| `.gc-hero-lead`, `.gc-ph-lead`, `.lead` | leading `--lh-relaxed` (1.85) kept; add `letter-spacing:0.006em` for calm | `--lh-relaxed` |
| Body measure | keep `44ch` (hero) / `64ch` (pagehead lead) / `62ch` (columns) | — |
| Eyebrows / meta labels | already `--ls-4/5`; **no change** (uppercase tracking is intentional) | — |
| EB Garamond editorial body | leading `--lh-relaxed`; add `0.004em` tracking | — |

> The tiny positive tracking on lead/body serif is the classic Apple "large
> paragraph" touch — barely perceptible, reads as polish, never as a gap.

### 2.3 Optical alignment (fit-and-finish)
- **Score-bug ↔ headline:** the score-bug's baseline sits `--space-4xl` above
  the headline cap. Keep the existing `margin-bottom:var(--space-4xl)`, but
  align the bug's **left edge flush** to the headline's optical left (Playfair
  caps have a small left side-bearing — nudge the bug `margin-left:-1px` is NOT
  allowed as a raw value; instead the headline and bug share the same container
  left edge and we accept the side-bearing, matching the mockup).
- **Hero feed panel top:** with the new 52px column gutter, keep
  `align-items:center` on `.gc-hero-grid` so the panel centers on the headline
  mass (the `REVAMP_SPEC §5 risk 1` resolution) — do **not** switch to
  `align-items:start`.
- **Numeric alignment:** ghosted segment numerals (`gc-segcard-n`,
  `gc-md-num`) and ledger indices already use Playfair `--fs-4xl`/`--fs-sm`;
  ensure they sit on a consistent optical inset (`--space-lg`/`--space-xl`) —
  already correct in the shipped CSS, just verify on review.

---

## 3. System-level move C — Materials (additive tokens)

New **additive** tokens. All ride existing color channels — **no new hue**. They
flip per theme by re-declaring in the light block alongside the existing swaps.

```css
:root {
  /* ── MATERIALS (additive) ─────────────────────────────────
     Frosted glass surface + refined layered shadow tiers.
     Glass bg rides the neutral surface value at reduced alpha so it
     tints correctly in both themes; blur + saturate give the Apple
     "vibrancy" without a new color. */
  --glass-bg:      rgba(20,20,20,0.62);   /* ≈ --surface @ .62 (dark) */
  --glass-border:  rgba(255,255,255,0.12); /* a hair brighter than --line */
  --glass-blur:    16px;                   /* backdrop-filter blur radius */
  --glass-saturate: 130%;                  /* vibrancy pop */

  /* Three-tier soft shadow — depth by elevation, not by border.
     Tier 1 rests on cards; tier 2 on hover-lift; tier 3 on floating
     glass panels. --shadow / --shadow-sm stay for back-compat. */
  --elev-1: 0 1px 2px rgba(0,0,0,.28), 0 2px 8px -2px rgba(0,0,0,.32);
  --elev-2: 0 2px 6px -1px rgba(0,0,0,.34), 0 12px 28px -8px rgba(0,0,0,.5);
  --elev-3: 0 8px 40px -8px rgba(0,0,0,.58), 0 2px 10px -2px rgba(0,0,0,.4);
}

:root[data-theme="light"],
@media (prefers-color-scheme: light) :root:not([data-theme]) {
  --glass-bg:      rgba(240,236,230,0.68); /* ≈ --nav-bg family (light) */
  --glass-border:  rgba(0,0,0,0.10);
  /* blur + saturate identical */
  --elev-1: 0 1px 2px rgba(0,0,0,.06), 0 2px 8px -2px rgba(0,0,0,.10);
  --elev-2: 0 2px 6px -1px rgba(0,0,0,.10), 0 12px 28px -8px rgba(0,0,0,.16);
  --elev-3: 0 8px 40px -8px rgba(0,0,0,.16), 0 2px 10px -2px rgba(0,0,0,.10);
}
```

### 3.1 Where each material is used (and where it is NOT)

| Surface | Material | Notes |
|---|---|---|
| **Nav** (`.nav`) | already `backdrop-filter:blur(14px)` + `--nav-bg` | Refine only: bump to `--glass-blur` + `saturate(--glass-saturate)`. **Keep the fixed-descendant containing-block fix already in place** (mobile menu is a *sibling* of `<nav>` precisely so `position:fixed` resolves to the viewport — do not nest fixed children inside the blurred nav). |
| **Hero news-feed panel** (`.gc-feed`) | `--glass-bg` + blur + `--glass-border` + `--elev-3` | The one floating panel on Home. Frosted over the chevron field behind it. **Contrast guard:** feed titles use `--white` and tags keep their solid tint — verify AA over the translucent surface (see §6). |
| **Sticky page-header** (`.gc-pagehead`, optional) | glass only if made sticky | Currently static. If FE keeps it static, no glass. If a future sticky treatment is wanted, apply `--glass-bg`+blur and mind the same fixed-descendant gotcha. **Default: leave static, opaque `--surface`.** |
| **Cards** (`.card`, `.gc-segcard`, `.gc-fixture`, `.performer-card`, ledger rows, scoreboard cells) | **opaque** `--raised` + `--elev-1` rest / `--elev-2` hover | No glass — glass on every card would be noise. Depth = shadow tier, not blur. |
| **Reverence plate, ticker, chevron field** | unchanged | These are identity; leave them. |

**Degradation:** wrap every glass rule so it degrades to opaque:
```css
.gc-feed { background: var(--raised); } /* fallback */
@supports (backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)) {
  .gc-feed {
    background: var(--glass-bg);
    -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
    border-color: var(--glass-border);
  }
}
```
No-blur browsers get the solid `--raised` panel — fully legible, just not frosted.

---

## 4. System-level move D — Motion (additive tokens)

```css
:root {
  /* ── MOTION (additive) ────────────────────────────────────
     One spring-ish ease-out for interactive depth, one gentle ease
     for entrances, plus standard durations. Every motion using these
     is disabled under prefers-reduced-motion. */
  --ease-spring: cubic-bezier(0.22, 1, 0.36, 1);   /* ease-out "settle" */
  --ease-soft:   cubic-bezier(0.4, 0, 0.2, 1);     /* material standard */
  --dur-fast:  180ms;   /* hovers, small state */
  --dur-med:   280ms;   /* card lift, panel */
  --dur-slow:  520ms;   /* entrance reveal */
}
```

### 4.1 Where motion applies

| Interaction | Property | Duration / easing | Notes |
|---|---|---|---|
| **Hero entrance** | `opacity 0→1` + `translateY(14px→0)` | `--dur-slow` `--ease-spring` | Reuse the existing `.reveal` hook + `reveal-ready` gate. Stagger the feed panel `~80ms` after the headline (via `transition-delay`). |
| **Card hover lift** | `transform: translateY(-2px)` + shadow `--elev-1 → --elev-2` | `--dur-med` `--ease-spring` | Replaces the current border-only 250ms `ease`. Keep the gold border tint. **Large surfaces lift, never scale.** |
| **Segment / fixture / performer cards** | same lift | `--dur-med` `--ease-spring` | Unifies the card family under one motion. |
| **Ledger / comp row hover** | `padding-left` `--space-sm` + gold wash | `--dur-fast` `--ease-soft` | Keep existing shift; just re-time to the token. |
| **Matchday cell top-bar reveal** | `opacity 0→1` | `--dur-fast` `--ease-soft` | Existing; re-time. |
| **Score-bug / feed LIVE dot blink** | `opacity 1→.2` | 1.4/1.6s (unchanged) | Identity motion; label carries meaning. |
| **Ticker / marquee scroll** | `translateX` | 38–40s linear (unchanged) | Home only. |
| **Nav link, buttons, chips** | color/border | `--dur-fast` `--ease-soft` | Re-time existing 0.2s hovers for consistency. |
| **Theme crossfade** | existing `.theme-transition` | 350ms (unchanged) | — |

### 4.2 Reduced-motion story
Everything above is additive to the existing `@media (prefers-reduced-motion:
reduce)` blocks. Extend them so: entrance reveals resolve to resting state
(already handled by the `.reveal` construction), card lift `transform` and
transition are `none`, blink/ticker freeze (already handled), and hover
color/border changes are kept (they're instant, not motion). **Net: on
reduced-motion the page is fully static except instantaneous hover feedback.**

---

## 5. System-level move E — Radii & alignment normalization

The shipped CSS mixes `--radius-sm` (2px), `--radius-md` (3px), `--radius-lg`
(4px), `--radius-xl` (14px) somewhat freely across siblings. Normalize by
surface class so no two sibling elements disagree.

| Surface class | Radius | Token |
|---|---|---|
| Buttons, filter chips, inputs, tags, pills | 2px | `--radius-sm` |
| Cards, segment cards, fixtures, post-cards, feed items | **3px** | `--radius-md` |
| Images, thumbnails, screenshots | 4px | `--radius-lg` |
| Floating glass panels (nav menu, hero feed panel) | 14px | `--radius-xl` |
| Circles (logos, icon buttons, dots) | 50% | `--radius-full` |

> The one concrete change: `.card` currently `--radius-md` (3px) but
> `.gpa-card`/`.gc-segcard` also 3px while `.post-card` is 3px and images 4px —
> mostly consistent already. **Action:** promote the hero feed panel
> (`.gc-feed`) from square to `--radius-xl` (it's now a floating glass panel) and
> confirm every card-family element is `--radius-md`. The ledger/scoreboard
> seam grids stay square (they read as a broadcast scoreboard — intentional).

**Alignment audit (review checklist):**
- Hero score-bug left edge ↔ headline left edge ↔ lead rule left edge: one
  vertical line.
- Section eyebrow ↔ `gc-h2` ↔ lead ↔ grid: one left margin (the `5vw` gutter),
  no stray indents.
- Card CTAs bottom-aligned across a row (already done in commit `0b24e65` — keep).
- Ghosted numerals inset consistently (`--space-lg`/`--space-xl`).

---

## 6. Dark + light behavior for glass & shadow

- **Glass bg** re-declares per theme (dark `rgba(20,20,20,.62)` ≈ `--surface`;
  light `rgba(240,236,230,.68)` ≈ nav-bg family). Because it's a neutral tint
  at fixed alpha, foreground `--white` text keeps AA in both themes: on dark the
  panel resolves to a dark translucent gray behind `#ede8df` text (>7:1); on
  light it resolves to a warm off-white behind `#1a1814` text (>10:1). **Verify
  the worst case:** a bright chevron band directly behind a feed title. The blur
  averages the band out, but confirm the transfer/injury/general tag chips
  (which sit on tinted backgrounds) still clear AA over glass — they use solid
  `rgb(var(--*-rgb)/.14–.15)` fills with brand-colored text, unchanged from the
  shipped feed, so they inherit the already-verified contrast.
- **Shadow tiers** re-declare per theme: dark tiers are deep
  (`rgba(0,0,0,.28–.58)`), light tiers are gentle (`.06–.16`) so cards on paper
  get a soft realistic drop, never a muddy halo. This mirrors how the existing
  `--shadow`/`--shadow-sm` already flip between themes.
- **Hairline `--glass-border`** is a hair brighter than `--line` (`.12` vs `.09`
  dark; `.10` both) so the frosted panel edge stays crisp against the blurred
  backdrop — the Apple "1px light catch" on a glass edge.
- **The fixed-descendant gotcha:** `backdrop-filter` creates a containing block
  for `position:fixed` descendants. The nav already solved this by keeping the
  mobile menu a *sibling*. **Any new glass surface (hero feed panel) must not
  contain a `position:fixed` child** — the feed panel doesn't, so we're safe,
  but flag it for the FE if the admin add-panel ever goes fixed.

---

## 7. Per-page refinement checklist (all 7 routes)

Each item is a *polish* action, not a rebuild. "Rhythm" = apply §1; "type" =
apply §2; "motion" = apply §4.

### `/` Home (`Home.tsx`) — the required proof (see `polish-home.html`)
- [ ] Section rhythm → §1.1 (body sections 60px).
- [ ] Hero grid gutter 40→52px; keep `align-items:center` (feed centers on
      headline). Hero title tracking `-0.025em`.
- [ ] Hero **feed panel → frosted glass** (`--glass-*` + `--elev-3` +
      `--radius-xl`); degrade to opaque `--raised` via `@supports`.
- [ ] Card family (`gc-segcard`, What-We-Do `<Card>`, post-cards) → `--elev-1`
      rest / `--elev-2` hover, `translateY(-2px)`, `--ease-spring`.
- [ ] `gc-h2 → content` gap 14→24px; `gc-segcards` top margin →36px.
- [ ] Hero + section entrance reveal via `.reveal` (staggered feed).
- [ ] Ticker + marquee untouched (identity). Keep the loud chevron field.

### `/gpa` GPA Weekly (`GPA.tsx`)
- [ ] Page-header rhythm → 60/52px; medium chevron unchanged.
- [ ] `gc-col-head` tracking `-0.014em`; editorial body serif +0.004em tracking,
      `--lh-relaxed`.
- [ ] Increase column head→measure gap to `--space-4xl` (already) and section
      gap to §1.1. Keep drop-cap, red/green rules.
- [ ] No glass (reading page — opaque calm). Watch-link button motion → `--dur-fast`.

### `/players` (`Players.tsx`)
- [ ] Page-header rhythm → 60/52px; keep league filter bar (≥44px hit targets).
- [ ] **Performer cards** get the card lift (`translateY(-2px)`, `--elev-2`).
- [ ] Ledger rows: keep density; only re-time hover to `--dur-fast`
      `--ease-soft`; name tracking `-0.005em`. **No glass on rows.**
- [ ] `gc-rule` head → ledger gap to `--space-8xl`.

### `/legends` (`Legends.tsx`)
- [ ] Page-header rhythm (quiet chevron unchanged).
- [ ] Reverence plate: keep exactly; only apply `--elev-1` to the plate for a
      whisper of lift off the page, and confirm gold-leaf corners (.45) still
      read in light (§ `REVAMP_SPEC §5.3`).
- [ ] Legger rows: name tracking `-0.008em`; hover re-time. Density kept.

### `/blackstars` (`BlackStars.tsx`)
- [ ] Page-header rhythm; loud chevron unchanged.
- [ ] Fixture + matchday + archive cells → card lift motion + `--elev` tiers.
      Seam grids stay square (scoreboard identity).
- [ ] `gc-editor` block: serif body +0.004em tracking; `--elev-1`.
- [ ] Section head→content gaps to §1.2.

### `/about` (`About.tsx`)
- [ ] Page-header rhythm; quiet chevron.
- [ ] `gc-prose` +0.004em tracking, drop-cap kept; `g2` sections get §1.1 rhythm.
- [ ] Reaction/request image cards → `--radius-lg` on images, `--elev-1` on
      wrappers, hover lift on `.react-img` re-timed to `--ease-spring`.
- [ ] `special-box` (Essien) → `--elev-1` for a touch of gravity.

### `/contact` (`Contact.tsx`)
- [ ] Page-header rhythm; quiet chevron.
- [ ] Form inputs: focus ring already `--gold`; add `--elev-1` on the form card
      surface, re-time focus border to `--dur-fast`.
- [ ] Channels stack: hover re-time; keep gold-accent Note item.

### Shared shell (Nav / Footer / Stripe)
- [ ] Nav: refine blur to `--glass-blur` + `saturate(--glass-saturate)`; **keep
      the sibling mobile-menu structure** (fixed-descendant fix).
- [ ] Footer / Stripe: untouched.

---

## 8. Risks & tradeoffs (flagged for review)

1. **Glass over the chevron field (Home feed panel).** A bright gold band can
   sit directly behind a feed title. Blur + saturate averages it, but on very
   large viewports the band is wider — **verify AA of `--white` feed titles over
   the worst-case band in both themes.** Mitigation already in place: the panel
   is `--glass-bg` neutral tint (not transparent), so the band is heavily muted
   before text sits on it.
2. **`backdrop-filter` performance / support.** Blur is GPU-cheap on one small
   panel + the nav, but stacking it on many cards would jank on low-end devices —
   which is exactly why glass is restricted to nav + one panel. The `@supports`
   fallback guarantees legibility with zero blur.
3. **Section rhythm bump on long pages.** 52→60px across ~5 sections adds
   ~40px per page. On the dense pages (Players, Legends) this is the intended
   "breathe" but confirm it doesn't push the fold awkwardly on laptops — mobile
   is untouched so phones are unaffected.
4. **Motion consistency vs. existing 0.2s hovers.** Re-timing dozens of existing
   `transition:.2s` rules to the new tokens is a broad, low-risk find/replace,
   but it's a wide diff — do it as one pass so nothing is left on the old timing
   and reads inconsistent.
5. **Additive tokens must re-declare in BOTH light selectors.** The light theme
   is duplicated across `[data-theme="light"]` and the
   `prefers-color-scheme` block. Every new `--glass-*` / `--elev-*` must be added
   to **both** or one path silently keeps dark shadows on paper. (Called out in
   §3; easy to miss.)

---

## 9. Handoff to Frontend

**Files to touch (source — after sign-off):**
- `src/style.css` — add the additive `--glass-*`, `--elev-*`, `--ease-*`,
  `--dur-*` tokens to `:root` **and** to both light-theme blocks (§3, §4, risk 5).
  Then: bump `section`/`.gc-pagehead` padding (§1.1); adjust the block-gap rules
  (§1.2); apply the display tracking ladder + lead/serif tracking (§2); wrap
  `.gc-feed` in the `@supports` glass rule (§3.1); unify the card-family
  transition to `translateY(-2px)` + `--elev` tiers + `--ease-spring` (§4);
  promote `.gc-feed` radius to `--radius-xl` (§5); refine `.nav` blur (§7).
- No `.tsx` changes required — this is pure CSS polish. The `.reveal` hook and
  `reveal-ready` gate already exist for the entrance motion.

**Reusable pieces to lean on (don't reinvent):**
- The existing `.reveal` / `html.reveal-ready` scroll-reveal system — the hero
  entrance rides it, no new JS.
- The existing per-theme token-swap blocks — new material/motion tokens slot in
  the same way.
- The existing `@supports` idiom (the nav already uses `backdrop-filter`) and
  the sibling-menu containing-block fix — copy that discipline for the feed panel.

**The three details I will personally check on review:**
1. **AA contrast of `--white` feed-panel titles over a bright gold chevron band,
   both themes** — the one place glass could betray legibility.
2. **Card-lift uniformity** — every card in the family (`gc-segcard`, `<Card>`,
   `post-card`, `gc-fixture`, `performer-card`) lifts exactly `-2px` on the same
   `--ease-spring`/`--dur-med`, with matching `--elev-1 → --elev-2` shadow. No
   stragglers on the old 0.2s ease.
3. **Additive tokens present in BOTH light selectors** — grep that every
   `--glass-*`/`--elev-*` appears in `[data-theme="light"]` *and* the
   `prefers-color-scheme:light` block, so paper mode never inherits dark shadows.
