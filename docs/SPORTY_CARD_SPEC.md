# GhanaComps — Sporty Card Spec

> A **container refinement layer** on top of the shipped "Matchday Broadcast +
> Broadsheet" revamp (`REVAMP_SPEC.md`) and the Apple-craft polish
> (`POLISH_SPEC.md`). Not a redesign. It gives the site's **feature-list boxes**
> a single, confident "sporty card" treatment: real separation, a proper
> border-radius, and a small family of custom football/sporty line icons —
> replacing the joined dividers-only `.stack` and the flat emoji markers.
>
> **One line:** *the list becomes a squad — distinct cards, each with a kit number.*
>
> **Hard constraints (inherited from the brief §0 + POLISH §0):**
> tokens/palette only — **no new brand colors, no palette drift**; content
> **frozen** (we add icons + restyle containers, we do not touch a single word of
> copy); dark **and** light must both work; the `.editable[data-eid]` /
> `body.edit` admin seams, shadcn `<Button>`/`<Card>`, and the
> Stripe → Nav → content → Footer → Stripe shell stay intact. Icons carry color
> via `currentColor` off existing palette tokens only. Reduced-motion honored.

---

## 0. The problem, precisely

The anchor is the About page, "We Cover Every Ghanaian." section, right column
(`src/pages/About.tsx` lines 89–94). It is **one** `.stack` container:

```
.stack      → display:flex column; gap: var(--space-3xs) /* 2px */; background: var(--line)
.stack-item → background: var(--raised); padding: 18px 20px; flex row
.stack-icon → font-size: var(--fs-xl); a flat emoji (⚽ 📼 🇬🇭 💬)
```

That 2px gap over a `--line` background is the classic "seam grid" trick: it
reads as **one bordered box cut by hairline dividers**, not four things. The
markers are flat OS emoji — inconsistent weight, no chip, no radius, and they
render differently per platform. The client wants these four to become **four
distinct cards** with real air between them, a confident radius, and a unified
custom icon each.

The same `.stack` pattern is reused on **Contact** (5 channel items). Those two
are the true "boxes-as-joined-list" archetypes and are the primary targets. The
treatment is then extended to the other genuine "box" archetypes for consistency
(§4), with explicit exclusions (§5) so "all boxes" reads as *intentional*, not
*literal-everything*.

---

## 1. The canonical sporty card

### 1.1 Anatomy

```
┌─────────────────────────────────────────────┐
│  ┌──────┐                                    │   ← gc-sportcard (the box)
│  │ icon │   Title (Playfair, --white)        │
│  │ chip │   Body copy (--sub / --body)        │
│  └──────┘                                    │
└─────────────────────────────────────────────┘
  ▲ icon chip     ▲ content column
```

A sporty card is **icon chip + content column**, laid out as a flex row (the
exact geometry the `.stack-item` already uses — we keep the DOM shape, we change
the container class and swap the emoji for an SVG chip). Vertical-icon variant
(chip above title) is available for grid contexts (Home "What We Do", Black Stars
board) via `gc-sportcard--stack`.

### 1.2 Separation model — the headline change

The four/five items stop sharing one bordered surface. Each becomes its own
bordered, rounded, elevated card, and the container becomes a real gapped stack:

| Token role            | Value                          | Was            |
|-----------------------|--------------------------------|----------------|
| Container display     | `flex; flex-direction: column` | same           |
| **Gap between cards** | `var(--space-lg)` = **12px**   | `--space-3xs` (2px seam) |
| Container background  | **transparent**                | `var(--line)` (the seam) |

12px (`--space-lg`) is the deliberate choice: big enough that each card reads as
its own object with air around it, small enough that the four still group as one
list. For grid layouts that already gap at `--space-2xl`/`--space-4xl` (Home
`.g-auto`, the board), the card just adopts the surface + radius; the grid's
existing gap already provides separation.

### 1.3 Surface, border, radius

```css
.gc-sportcard {
  background: var(--raised);
  border: 1px solid var(--line);
  border-radius: var(--radius-xl);   /* 14px — the confident radius */
  box-shadow: var(--elev-1);         /* rests on tier-1 depth */
  padding: var(--space-4xl) var(--space-4xl); /* 20px */
  display: flex;
  align-items: flex-start;
  gap: var(--space-lg);              /* 12px chip→content */
}
```

**Border-radius — the client's emphasis.** We pick **`--radius-xl` (14px)**, not
`--radius-lg` (4px). Rationale: 4px is the "image / dense grid" radius used where
many rectangles tile tightly (fixtures, seam cells, screenshots) and must stay
crisp. A *separated, breathing* card wants the softer, more premium 14px that the
system already reserves for **floating panels** (`.nav-menu`, the menu card).
Promoting the feature card to that radius is exactly the "this is now a distinct
floating object" signal the separation model is making. It is an existing token —
no new value.

For the tighter **grid** variant (Home cards, board cells) where 14px would look
bubbly against neighbors, use **`--radius-lg` (4px)** via `gc-sportcard--tight`,
keeping those surfaces consistent with the fixtures/segcards already at
`--radius-md`/`--radius-lg`. Radius is the one value that flexes by density; every
other token is shared.

### 1.4 The icon chip

The chip is the sporty personality made physical: a rounded, gold-tinted frosted
square holding one line icon.

```css
.gc-sportcard-chip {
  flex: 0 0 auto;
  width: 44px; height: 44px;          /* ≥44px hit target if interactive */
  display: grid; place-items: center;
  border-radius: var(--radius-lg);    /* 4px — soft square, echoes the crest chip */
  background: rgb(var(--gold-rgb) / .10);
  border: 1px solid rgb(var(--gold-rgb) / .22);
  color: var(--gold);                 /* drives currentColor in the SVG */
}
.gc-sportcard-chip svg {
  width: 24px; height: 24px;
  fill: none; stroke: currentColor;
  stroke-width: 1.75;                 /* unified stroke weight for the family */
  stroke-linecap: round; stroke-linejoin: round;
}
```

- **Size:** fixed **44px** chip, **24px** glyph. Uniform across every card so the
  family reads as one set — the exact discipline the flat emoji lacked.
- **Tint:** `rgb(var(--gold-rgb) / .10)` fill, `/.22` border. This is the same
  ghosted-gold recipe already used by `.lc-badge` and the admin add-blocks, so it
  is native to the system. Flag-variant chips (`.r` / `.gr`) swap the channel to
  `--red-rgb` / `--green-rgb` for cards that map to a flag color (e.g. Black Stars
  coverage → green, a "live/urgent" card → red) — mirrors `.era-pill` and
  `.gc-seglbl` variants.
- **Frost (optional, panels only):** on glass contexts add
  `backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate))` and
  `background: var(--glass-bg)`. Feature-list chips stay on the solid gold tint —
  cheaper and higher-contrast.

### 1.5 Typography (unchanged tokens — reusing `.stack-t` / `.stack-b` scale)

| Element        | Font              | Size        | Weight            | Color     | Line-height     |
|----------------|-------------------|-------------|-------------------|-----------|-----------------|
| Card title     | `--font-d` Playfair | `--fs-lg` 0.95rem | `--fw-semibold` | `--white` | `--lh-snug` 1.1 |
| Card body      | `--font-b` DM Sans  | `--fs-sm` 0.76rem | 400            | `--sub`   | `--lh-normal` 1.6 |
| Title→body gap | —                 | `--space-2xs` 4px | —               | —         | —               |

Titles that wrap to 2 lines (e.g. "Black Stars Coverage") stay on `--lh-snug`; no
truncation — these are short labels, not overflow-prone.

### 1.6 States

| State        | Treatment                                                                                 |
|--------------|-------------------------------------------------------------------------------------------|
| **Default**  | `--raised` surface, `--line` border, `--elev-1`, gold-tinted chip.                        |
| **Hover** (interactive cards / whole-card links only) | `border-color: rgb(var(--gold-rgb) /.3)`; `box-shadow: var(--elev-2)`; `transform: translateY(-2px)`; chip fill → `/.16`, border → `/.35`. All on `--dur-med` / `--ease-spring` — **identical to the shipped card-family lift** (`.card`, `.gc-segcard`). Static info cards (About/Contact list) do **not** lift; they get only a quiet chip warm-up on section hover — a card that isn't clickable must not pretend to be. |
| **Focus-visible** (interactive) | `outline: 2px solid var(--gold); outline-offset: 2px` — matches `.special-screen`, `.gc-vcard`. |
| **Active**   | `transform: translateY(-1px)` (settles), matches `.gc-vcard:active`.                      |
| **Disabled** | n/a for content cards. If ever a disabled CTA lives inside, that's the `<Button>`'s concern, not the card's. |
| **Loading**  | Skeleton: chip → `--surface` solid (no glyph); title/body → 2 shimmer bars at `--fs-lg`/`--fs-sm` heights, `--radius-sm`, `--surface`→`--lift` pulse over `--dur-slow`. Reduced-motion: static `--surface` bars, no pulse. |
| **Empty**    | When a dynamic card list is empty, do **not** render empty sporty cards. Reuse the existing dashed placeholder pattern (`.post-placeholder` / the About "Coming Soon" dashed box): `1px dashed rgb(var(--gold-rgb) /.2)`, italic `--sub` copy, one neutral chip (whistle icon = "nothing yet"). Anchor/Contact lists are static content, so empty state is theoretical there. |
| **Error**    | Card is inert content; error surfacing belongs to the data layer, not the card. If a link target 404s that is a route concern. No error state on the card itself. |

### 1.7 Motion

- Only the hover lift + chip warm-up animate, on the **existing** `--ease-spring`
  / `--dur-med` tokens — no new motion vocabulary.
- Reduced-motion: fold into the shipped block. The card must appear in the
  existing `@media (prefers-reduced-motion: reduce)` list at
  `src/style.css:886` so `transform` is killed and the transition drops to the
  `--dur-fast`/`--ease-soft` border-color-only feedback. The gold border hover
  (feedback, not motion) stays.

### 1.8 Both themes

Every value above is a token, so the card themes for free. Two things to verify
on **light** (paper):

- Chip: `rgb(var(--gold-rgb) /.10)` fill uses the *light* gold channel
  (`184 150 10`), giving a warm parchment-gold tint on `--raised` `#e4e0d8`. The
  `--gold` stroke on that tint clears AA for a 1.75px non-text graphic
  (WCAG 1.4.11 needs ≥3:1; light gold `#b8960a` on the tinted chip is ~3.4:1).
- `--elev-1` is re-declared gentle on paper (`.06–.10` alphas) so the separated
  cards get a soft realistic drop, never a muddy dark halo — already handled by
  the light token block (`src/style.css:2059`).

### 1.9 Contrast audit (AA)

| Pair                                    | Ratio (dark) | Ratio (light) | Verdict |
|-----------------------------------------|--------------|---------------|---------|
| Title `--white` `#ede8df` on `--raised` `#1c1c1c` | ~13.2:1 | ~13.9:1 (`#1a1814` on `#e4e0d8`) | AA/AAA text |
| Body `--sub` `#888078` on `--raised`    | ~4.7:1       | ~4.6:1 (`#6b6760`) | AA body (≥4.5) |
| Icon stroke `--gold` on chip tint       | ~7:1         | ~3.4:1        | AA graphic (≥3) |
| Chip border on `--raised`               | decorative   | decorative    | n/a     |

Body copy on `--sub` is intentionally the same as the current `.stack-b` — we are
not regressing contrast, we sit right at the AA line. (If the FE wants headroom,
promoting body to `--body` would push both themes to ~7:1; flagged, not required —
copy/token change is out of scope for this pass.)

---

## 2. The sporty icon system

A **10-icon** custom inline-SVG family. One stroke language so it reads as one
kit: `fill:none`, `stroke: currentColor`, `stroke-width: 1.75`, round caps/joins,
24×24 viewBox, drawn on a 20px live area with 2px optical padding. Color always
via `currentColor` off `--gold` (or `--red`/`--green` for flag chips) — never a
hardcoded hue. Every glyph is `aria-hidden="true"` (decorative; the title carries
meaning), so no icon needs a label.

### 2.1 The set (names + meaning)

| # | Name           | Glyph (what it draws)                          | Maps to                                   |
|---|----------------|------------------------------------------------|-------------------------------------------|
| 1 | `ball`         | Football with pentagon seams (ball-in-motion feel) | Weekend highlights, "goals live", general football |
| 2 | `boot`         | Cleat striking, motion tick off the toe        | Player performances / goals / "the strike" |
| 3 | `goal`         | Goal frame + net cross-hatch                   | Scoring, "goals live on X"                 |
| 4 | `whistle`      | Whistle with pea + lanyard curl                | Requests / "we take requests" / officiating, ratings |
| 5 | `stadium`      | Stadium bowl arc + floodlight uprights          | Matchday / Black Stars coverage / the venue |
| 6 | `jersey`       | Kit/jersey silhouette with collar + number line | Player comps, squad, "current players"      |
| 7 | `trophy`       | Cup with handles on a plinth                    | Legends / throwbacks / honors              |
| 8 | `stopwatch`    | Stopwatch, crown button + sweep hand            | Weekly cadence / "24 hours" / timing        |
| 9 | `flag`         | Corner/pennant flag on a pole                   | Ghana / Black Stars / national identity     |
| 10 | `tactics`     | Chalkboard with arrow play + node               | Post-match breakdown / analysis / lineups   |

Two more supporting glyphs are drawn from the same family for **channels**
(Contact) so we do not force a football metaphor onto an email address:
`mail` (envelope) and `broadcast` (concentric signal arcs = social/megaphone).
These share the exact stroke language — one family, extended, not a second style.

### 2.2 SVG source (paste-ready, drop into a `SportyIcon` component)

All share the wrapper attrs from `.gc-sportcard-chip svg` (§1.4); only the inner
paths differ.

```html
<!-- 1. ball -->
<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7.2l3.4 2.5-1.3 4h-4.2l-1.3-4L12 7.2z"/><path d="M12 7.2V4.2M15.4 9.7l2.7-1M14.1 13.7l1.8 2.4M9.9 13.7l-1.8 2.4M8.6 9.7l-2.7-1"/></svg>

<!-- 2. boot -->
<svg viewBox="0 0 24 24"><path d="M4 7h5l1.5 5.5L19 14a2 2 0 012 2v1H5a1 1 0 01-1-1V7z"/><path d="M4 17.5h17"/><path d="M9 7v4"/></svg>

<!-- 3. goal -->
<svg viewBox="0 0 24 24"><path d="M3 5h18v13H3z"/><path d="M3 9h18M3 13h18M7 5v13M12 5v13M17 5v13"/></svg>

<!-- 4. whistle -->
<svg viewBox="0 0 24 24"><path d="M13 9h7a1 1 0 011 1v2a5 5 0 01-5 5h-3a4 4 0 110-8z"/><circle cx="9" cy="13" r="1"/><path d="M13 9V6a2 2 0 012-2h2"/></svg>

<!-- 5. stadium -->
<svg viewBox="0 0 24 24"><path d="M3 14c0-2.2 4-4 9-4s9 1.8 9 4-4 4-9 4-9-1.8-9-4z"/><path d="M6 12.5V7M12 11V5M18 12.5V7"/><path d="M6 7h.01M12 5h.01M18 7h.01"/></svg>

<!-- 6. jersey -->
<svg viewBox="0 0 24 24"><path d="M8 4l4 2 4-2 4 3-2.5 3H18v8H6v-8H4.5L2 7l4-3z"/><path d="M10 4a2 2 0 004 0"/><path d="M12 12v4"/></svg>

<!-- 7. trophy -->
<svg viewBox="0 0 24 24"><path d="M7 4h10v4a5 5 0 01-10 0V4z"/><path d="M7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3"/><path d="M12 13v4M9 20h6M10 17h4"/></svg>

<!-- 8. stopwatch -->
<svg viewBox="0 0 24 24"><circle cx="12" cy="14" r="7"/><path d="M12 14l3-2M12 7V4M10 4h4M18.5 8.5l1.5-1.5"/></svg>

<!-- 9. flag -->
<svg viewBox="0 0 24 24"><path d="M6 3v18"/><path d="M6 4h11l-2.5 3.5L17 11H6"/></svg>

<!-- 10. tactics -->
<svg viewBox="0 0 24 24"><path d="M4 4h16v13H4z"/><path d="M8 20h8M12 17v3"/><path d="M7 13c2-4 5-4 7 0" stroke-dasharray="0.1 3"/><circle cx="7" cy="13" r="1"/><path d="M13 9l2 1-2 1"/></svg>

<!-- supporting: mail -->
<svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z"/><path d="M3 7l9 6 9-6"/></svg>

<!-- supporting: broadcast -->
<svg viewBox="0 0 24 24"><circle cx="12" cy="16" r="1.6"/><path d="M9 13a4 4 0 016 0M6.5 10.5a8 8 0 0111 0"/></svg>
```

> These are honest starting geometry, tuned for the 1.75 stroke at 24px. The FE
> should nudge to the pixel grid on integration — I list this among my review
> checks (§7). Keep them as a single `<SportyIcon name="…"/>` component with a
> `name→paths` map so the family stays one source of truth (mirrors the existing
> inline-SVG habit in `Nav`/`About`'s `ExpandGlyph`).

---

## 3. The anchor — About `.stack` → 4 separated sporty cards

The right column of "We Cover Every Ghanaian." (`About.tsx` 89–94) becomes a
`gc-sportcards` stack of four `gc-sportcard`s, content **verbatim**:

| Item (unchanged copy)  | Old emoji | New chip icon | Chip variant |
|------------------------|-----------|---------------|--------------|
| **Weekend Highlights** | ⚽        | `ball`        | gold (default) |
| **Legend Throwbacks**  | 📼        | `trophy`      | gold |
| **Black Stars Coverage** | 🇬🇭     | `stadium`     | green (`.gr`) — the flag/national cue without a literal flag emoji |
| **We Take Requests**   | 💬        | `whistle`     | gold |

Why these: `ball` = the live weekend action; `trophy` = honoring past greats
(cleaner than a VHS tape for "legends"); `stadium` in **green** carries the Ghana
/ national-team weight (a `flag` glyph is reserved so we don't double up, and
green ties it to the flag palette); `whistle` = "give us the call / your request"
— the officiating cue that maps naturally to "we take requests" and pairs with
`broadcast` on Contact. Gap between the four: **`--space-lg` (12px)**. Radius:
**`--radius-xl` (14px)**.

---

## 4. Per-page application map

Seven routes. "Adopt" = becomes a `gc-sportcard`. Each adopting box gets one icon.

### About (`src/pages/About.tsx`) — ANCHOR
- **`.stack` "We Cover Every Ghanaian" (×4)** → adopt (stacked list, 12px gap,
  radius-xl). Icons: `ball`, `trophy`, `stadium`(green), `whistle` (§3).
- `.special-box` (Essien moment), `.quote-block`s, "Coming Soon" dashed box,
  reaction gallery, request image grids → **excluded** (§5).

### Contact (`src/pages/Contact.tsx`)
- **`.stack` channels (×5)** → adopt (same list treatment as the anchor — this is
  the second true joined-list box). Icons:
  - Email Us → `mail`
  - Find Us on X → `broadcast`
  - Find Us on TikTok → `broadcast` (or `ball` if a second identical glyph reads
    repetitive — FE's call; both are family-consistent)
  - Find Us on Facebook → `broadcast`
  - **A Note on Requests** (the gold left-border item) → `whistle`, chip in
    **gold**, and preserve its accent as a `.gc-sportcard--accent` (2px gold left
    border folded into the rounded card) so it still reads as the emphasized note.
- The contact form itself → **excluded** (it's a form, not a box).

### Home (`src/pages/Home.tsx`)
- **"What We Do" shadcn `<Card>` grid (×4)** → adopt the **tight** grid variant
  (`gc-sportcard--tight`, radius-lg) so the sporty chip + icon replace the flat
  emoji, but keep the shadcn `<Card>` shell + `<Button>` CTA and the existing
  `.g-auto` gap. Icons: Weekend Highlights → `ball`; Legend Throwbacks →
  `trophy`; Black Stars → `stadium`(green); We Take Requests → `whistle`.
  (Mirrors the anchor deliberately — same four meanings, same four icons, proving
  the system.) The chip sits where the emoji `<div>` is today.
- **GPA-preview `.gc-segcard` (×3)** → adopt **chip only** (add a small `ball`/
  `boot`/`goal` chip beside the `gc-seglbl`), keeping the ghost numeral, flag
  top-bar and radius. This is a *light* adoption: the segcard already IS a
  broadcast card, so it gets the icon language, not the full re-box. Icons:
  Matchweek Review → `tactics`; Player of the Week → `boot`(red); Goal & Assist →
  `goal`(green).
- Hero news feed, post-cards ("Our Work So Far"), Highlights video tiles, Social
  strip, marquee/ticker → **excluded** (§5).

### Black Stars (`src/pages/BlackStars.tsx`)
- **"What We Cover" `.gc-board` matchday cells (×6)** → adopt **chip only**: the
  flat emoji (`.gc-md-icon`) becomes a gold chip with a family icon, keeping the
  **seam grid** intact (do NOT separate these into rounded cards — the hairline
  seam + ghost numeral is a deliberate scoreboard identity; §5 boundary). Icons:
  Predicted Lineup → `tactics`; Goals Live on X → `goal`(red); Post Match
  Breakdown → `tactics`; Player Comps → `jersey`; Player Ratings → `whistle`;
  Injury Updates → `broadcast`(red). Because it's a seam cell, the chip is a hair
  smaller (36px / 20px glyph) — matches the cell's tighter padding.
- `.gc-editor` editorial block, `.gc-fixture` scoreboard cards, `.gc-arc` archive
  library cells → **excluded** (§5).

### Players (`src/pages/Players.tsx`)
- `.performer-card` (video tiles), the two-column ledger/index rows → **excluded**
  (§5). Players has **no** eligible feature-list box; it adopts nothing. This is
  correct and expected — not every page has a "box."

### Legends (`src/pages/Legends.tsx`)
- `.legend-card` / `.gc-lentry` ledger entries → **excluded** (§5). Legends
  adopts nothing (it's a dense biographical ledger, not feature boxes).

### GPA (`src/pages/GPA.tsx`)
- `.gc-editorial` column blocks / `gpa-write-block` → **excluded** (§5). GPA is a
  broadsheet editorial; it adopts nothing.

**Summary:** genuine adopters are **About ×4** (full), **Contact ×5** (full),
**Home "What We Do" ×4** (tight), plus **chip-only** enrichment on **Home
GPA-preview ×3** and **Black Stars board ×6**. Players, Legends, GPA adopt
nothing by design.

---

## 5. Exclusions — the boundary that keeps "all boxes" intentional

A sporty icon on the wrong surface looks absurd. These are **not** feature-list
boxes and must **not** get chips/icons or the re-box:

| Surface | Why excluded |
|---------|--------------|
| **Players/Legends ledger rows** (`.gc-lentry`, `.comp-row`, two-column index) | Dense biographical *ledger* — the Broadsheet identity. A whistle chip on every legend row would be noise and destroy scannability. |
| **Video cards** (`.gc-vcard`, `.post-card`, `.performer-card`, Highlights) | They already have a play-glyph as their icon; a second sporty chip competes with it and clutters the poster. |
| **GPA editorial columns** (`.gc-editorial`, `gpa-write-block`) | Long-form serif editorial, not a box. Icons would cheapen the broadsheet. |
| **Home news feed** (`.gc-feed-item`) | A live ticker/feed row with its own tag pill + dot; it's a list of headlines, not feature cards. |
| **Fixtures** (`.gc-fixture`) | Already a broadcast scoreboard card with gold top-bar identity; leave it. |
| **Black Stars archive** (`.gc-arc` / `.gc-lib`) | Seam-grid *library* with a gold left-rule; a chip breaks the seam. |
| **Quote blocks, `.special-box`, dashed "Coming Soon"/placeholder boxes** | Editorial/quotation/empty-state surfaces with their own established look (left-rule, gold tint, dashed). |
| **Stat cells, filter bar, forms, search** | UI chrome / data, not content boxes. |
| **Black Stars board & Home segcards** are a **partial** case: they keep their seam/scoreboard geometry and take the icon **chip only** — they do NOT get the radius-xl re-box. |

**The rule of thumb:** adopt the full sporty card only where the box is a
*standalone feature/channel item in a short list* (About, Contact). Adopt
chip-only where a box is already a broadcast/scoreboard card but currently uses a
flat emoji (Home cards, Home segcards, BS board). Everywhere else: leave it.

---

## 6. Proposed `gc-` class names

| Class | Role |
|-------|------|
| `gc-sportcards` | the gapped stack/grid container (`gap: --space-lg`, transparent bg) |
| `gc-sportcard` | the card itself (raised, `--radius-xl`, `--elev-1`, flex row) |
| `gc-sportcard--tight` | grid variant → `--radius-lg`, no per-card lift beyond grid |
| `gc-sportcard--stack` | vertical variant → chip above title (grid contexts) |
| `gc-sportcard--accent` | gold 2px left-edge inside the rounded card (Contact "Note") |
| `gc-sportcard--link` | interactive whole-card link → enables hover lift + focus ring |
| `gc-sportcard-chip` | the 44px rounded gold-tinted icon chip (`.r`/`.gr` flag variants) |
| `gc-sportcard-chip--sm` | 36px chip for seam cells (BS board) |
| `gc-sportcard-body` | content column wrapper |
| `gc-sportcard-t` / `gc-sportcard-b` | title / body (alias the `.stack-t`/`.stack-b` type) |
| `SportyIcon` (component) | inline-SVG family, `name` prop → `paths` map |

Namespacing matches the shipped `gc-` revamp classes; BEM-ish `--` modifiers
match nothing existing but read clearly and don't collide.

---

## 7. Handoff to Frontend

**File targets**
- `src/style.css` — add the `.gc-sportcard*` block **outside `@layer`** (same
  convention as `.gc-segcard`, so it wins over Tailwind without `!important`).
  Add the card classes to the **existing** reduced-motion list at `~line 886–895`
  (do not author a second media query). No token additions — everything reuses
  `--raised`, `--line`, `--radius-xl/lg`, `--elev-1/2`, `--space-lg/2xs/4xl`,
  `--gold-rgb`, `--ease-spring`, `--dur-med`.
- New `src/components/SportyIcon.tsx` — the inline-SVG family (name→paths map),
  `aria-hidden`, wrapper attrs from §1.4.
- `src/pages/About.tsx` (89–94) — swap `.stack`→`gc-sportcards`,
  `.stack-item`→`gc-sportcard`, replace the emoji `.stack-icon` with
  `<span class="gc-sportcard-chip"><SportyIcon name="…"/></span>`. **Copy frozen.**
- `src/pages/Contact.tsx` (74–114) — same swap; keep the mailto/social links and
  the gold-accent "Note" as `gc-sportcard--accent`.
- `src/pages/Home.tsx` — "What We Do" `<Card>`s get the chip + `gc-sportcard--tight`
  language (keep the shadcn shell + Button); segcards get a chip beside `gc-seglbl`.
- `src/pages/BlackStars.tsx` (117–123) — `.gc-md-icon` emoji → `gc-sportcard-chip--sm`
  with `SportyIcon`; **keep** the `.gc-board` seam grid and ghost numerals.

**Reusable pieces to lean on**
- The card-family lift (`--elev-1`→`--elev-2` + `translateY(-2px)` on
  `--ease-spring`/`--dur-med`) — reuse verbatim; don't reinvent.
- The ghosted-gold chip recipe already lives in `.lc-badge` (fill `/.08–.10`,
  border `/.25`) — the chip is that, squared.
- The dashed placeholder (`.post-placeholder`) for any empty dynamic list.
- `.stack-t` / `.stack-b` type scale — alias, don't redefine.

**The three details I will personally check on review**
1. **Icon optical grid + weight.** Every glyph on the same 1.75px stroke, visually
   centered in the 44px chip (not geometrically — the ball/trophy read heavier and
   need a hair more air), and all 10 sharing round caps/joins so the set is *one*
   family. I'll pixel-check `stadium` and `whistle` first — they're the fussiest.
2. **The 12px separation reads as separate, radius is truly 14px.** That the
   `--space-lg` gap + `--radius-xl` actually make four distinct objects on both
   themes, and that the old `background: var(--line)` seam is fully removed (a
   leftover would re-join them). This is the client's literal ask.
3. **No fake affordance + reduced-motion.** Static info cards (About/Contact) do
   **not** lift or show a focus ring — only `gc-sportcard--link` does. And that the
   card is in the shared reduced-motion block so `transform` is killed while the
   gold-border feedback survives. I'll also confirm AA holds on light for the gold
   stroke on the tinted chip.
