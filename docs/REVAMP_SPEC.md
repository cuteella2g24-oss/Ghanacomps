# GhanaComps Revamp — Definitive Design-System Spec (B + A Hybrid)

> The single buildable specification for the full-site revamp. This consolidates
> the two winning concepts into one system and is the unambiguous target for the
> frontend engineer across all 7 routes.
>
> **The hybrid in one line:** *Concept B "Matchday Broadcast"* is the spine —
> applied to the marquee pages (Home, Black Stars) and every page-header moment
> site-wide. *Concept A "The Broadsheet"* is the discipline — applied to the
> dense + reading pages (Players ledger, Legends index, GPA columns). About +
> Contact are quiet A with one B page-header. Legends borrows a touch of C's
> reverence for a single marquee legend plate.
>
> **Non-negotiables carried forward from the brief (§0):** tokens only (no new
> hue / px / rem / hex), content frozen, fonts locked (Playfair `--font-d` /
> DM Sans `--font-b` / EB Garamond `--font-a`), themes by pure token-swap, the
> `.editable[data-eid]` + `body.edit` admin seams intact, shadcn `<Button>`/
> `<Card>` preserved, and the Stripe → Nav → content → Footer → Stripe shell
> untouched. Every value below traces to a `src/style.css :root` token.

Companion mockups (self-contained, real tokens, dark theme):
- `scratchpad/concept-b.html` — Home hero (B) **[reuse as-is]**
- `scratchpad/concept-a.html` — Players ledger (A) **[reuse as-is]**
- `scratchpad/spec-gpa.html` — GPA Weekly, A-columns
- `scratchpad/spec-legends.html` — Legends, A-index + C reverence plate
- `scratchpad/spec-blackstars.html` — Black Stars, B broadcast
- `scratchpad/spec-about-contact.html` — About + Contact, quiet A + B page-header

---

## 1. The shared component vocabulary

Nine reusable pieces carry the whole site. Each is defined concretely below.
All are recompositions of the existing card/pill/eyebrow/grid vocabulary — no
net-new archetypes. Proposed class names are listed in §7; the FE owns the CSS.

### 1.1 Page-header / hero system (B — spine)

**Purpose.** The one loud broadcast moment every page earns. Two registers:
a full **hero** (Home only, already built in `concept-b.html`) and a **page
header** (`gc-pagehead`) used on every other route in place of the current
`.page-header`.

**Structure.**
1. `gc-pagehead` — `position:relative; overflow:hidden;` container.
2. `::before` **flag-chevron field** (see §1.4), sitting at `z-index:0`.
3. `gc-pagehead-inner` at `z-index:1` holding:
   - the **score-bug** (§1.2),
   - `gc-ph-title` — Playfair `--font-d`, `--fw-semibold`, `--fs-d2`,
     `text-transform:uppercase`, `letter-spacing:-0.015em`, `line-height:
     var(--lh-display)`. Emphasis word in `.gold`.
   - `gc-ph-lead` — the intro paragraph; `--fs-md`, `--lh-relaxed`, `--body`.

**Tokens / sizing.** Padding `var(--space-10xl) 5vw var(--space-9xl)` (matches
the current `.page-header` rhythm so the Nav→header gap is unchanged).
Background `--surface`. Bottom border `1px solid var(--line)`.

**Chevron intensity by page (this is the "range" lever):**
- **Loud** (Home hero, Black Stars): full 3-line red/gold/green chevron field.
- **Medium** (GPA, Players): 1–2 chevrons (gold + one flag hue).
- **Quiet** (Legends, About, Contact): a single faint gold chevron only, or
  none — reverence/utility register.

**States.** Static block; the only motion is the score-bug dot blink. Header has
no hover. Score-bug is decorative except where a `<s>` wraps a real link.

**Dark ↔ light.** Chevrons are `rgb(var(--*-rgb) / .09–.14)`; the channels
re-declare in light so the rake stays visible on paper `--bg`. **Risk flagged
in §6.**

### 1.2 Status / LIVE bug (B)

**Purpose.** The signature "broadcast is on" mark. Replaces the plain
`.eyebrow` on B-spine headers.

**Structure.** `gc-scorebug` = inline-flex of `<s>` segments with a shared
`1px solid var(--line)` frame. First segment `s.live`: `background:var(--red)`,
`color:var(--on-brand)`, `--fw-semibold`, a `::before` 6px dot with the `blink`
keyframe. Remaining `s.meta`: `color:var(--sub)`, transparent.

**Tokens.** Padding `var(--space-xs) var(--space-lg)`; `--fs-micro`; `--ls-4`;
uppercase. No radius (broadcast lower-third look).

**States.** `blink` = `opacity 1 → .2` at 1.4s. **Frozen under
`prefers-reduced-motion`.** The dot must never be the only signal — the "LIVE"/
label word carries meaning.

**Dark ↔ light.** `--on-brand` (`#fff`) stays on red in both themes; red channel
re-declares. AA-safe as a fill+text pairing.

### 1.3 Ticker (B — Home only)

**Purpose.** The promoted marquee as a lower-third. Home top only; do **not**
add it to other pages (avoids over-loud).

**Structure.** `b-ticker` (reuse from `concept-b.html`): `background:var(--gold)`,
`overflow:hidden`, a pinned `::before` red `LIVE` bug, and `b-ticker-track`
running the existing player-name list with `◆` dividers at `opacity:.3`.

**Tokens.** Text: Playfair `--fs-sm`, `--ls-3`, `--on-gold`. Padding
`var(--space-sm) 0`. Reuse the existing `@keyframes marquee`/`tick` (38–40s
linear infinite).

**Motion.** Scroll animation **must pause under `prefers-reduced-motion`** (set
`animation:none` and let the list truncate with `overflow:hidden`).

**Dark ↔ light.** Gold bg + `--on-gold` text; `--on-gold` flips `#0a0a0a` →
`#fff` automatically. Verified AA both ways.

### 1.4 Flag-chevron motif (B)

**Purpose.** The angled broadcast keylines that give hero/header energy without
a fill. Pure CSS, no assets.

**Structure.** Layered `linear-gradient(115deg, …)` bands on a `::before`,
each a 1–2% wide stripe at low alpha:
```
background:
  linear-gradient(115deg, transparent 0 60%, rgb(var(--red-rgb)/.10) 60% 61%, transparent 61%),
  linear-gradient(115deg, transparent 0 65%, rgb(var(--gold-rgb)/.14) 65% 67%, transparent 67%),
  linear-gradient(115deg, transparent 0 70%, rgb(var(--green-rgb)/.10) 70% 71%, transparent 71%);
```
**Rules.** Gold band is the widest/strongest; red + green are hairlines. Always
`z-index:0` under `z-index:1` content; `overflow:hidden` on the parent so the
rake is clipped. `pointer-events:none` implicitly (it's a `::before`).
Decorative → not in the a11y tree.

**Dark ↔ light.** Alpha values hold in both themes because they ride the
re-declared channels. Keep gold ≤ .14, flag hues ≤ .10 so light-paper contrast
of foreground text is never compromised.

### 1.5 Section-header / eyebrow + rule system (A — discipline)

**Purpose.** The editorial gazette section header for reading/dense pages. Two
variants share one grammar:

**Variant A — `gc-rule` (broadsheet, for A-pages: GPA, Legends, About, Contact).**
A baseline-aligned flex: Playfair title left (`gc-rule-l`, `--fs-d3`,
`--fw-semibold`, `.gold` emphasis) + uppercase meta right (`gc-rule-r`,
`--fs-micro`, `--ls-4`, `--sub`), sitting on a `border-bottom:2px solid
var(--line)` with `padding-bottom:var(--space-sm)` and
`margin-bottom:var(--space-7xl)` (or `--space-8xl` for grid sections).

**Variant B — `gc-eyebrow` + `gc-h2` (broadcast, for B-pages: Black Stars, Home
sub-sections).** The existing `.eyebrow` recomposed with a 2px gold underline
tick, above an uppercase Playfair `gc-h2` (`--fs-d2`). Use where the section is
part of the loud spine.

**Rule of thumb.** If the section is *reading or indexing* → `gc-rule`. If it's
*broadcast/scoreboard* → `gc-eyebrow + gc-h2`.

**Dark ↔ light.** Both ride `--line` / `--gold` / `--sub`; theme-free.

### 1.6 Ledger / index list (A — density power move)

**Purpose.** The most scannable answer for 50+ rows. Used for the Players
directory (already built in `concept-a.html`) and the Legends index.

**Structure (`gc-ledger` / `gc-legger`).** Two-column CSS grid
(`grid-template-columns:1fr 1fr; gap:0 var(--space-10xl)`), collapsing to one
column ≤ 820px. Each row (`gc-entry`/`gc-lentry`) is a
`grid-template-columns:auto 1fr auto` of: index numeral (Playfair `--dim`),
main block (name + meta + optional bio/comps/quote), and a hanging right-side
league/era label with a colored `●` dot. Row divider `1px solid var(--line)`.

**Tokens.** Player row padding `var(--space-lg) 0`; Legends row (richer)
`var(--space-4xl) 0`. Name Playfair `--fs-xl` (players) / `--fs-2xl` (legends).
Meta `--fs-2xs`, `--sub`, `--ls-1`.

**League/era color coding (wayfinding, never sole signal — always paired with a
text label):** PL/Championship = `--gold`, Ligue 1/Serie A = `--green`,
La Liga/Bundesliga = `--red`, Other = `--sub`.

**States.**
- *hover:* `padding-left:var(--space-sm)` shift + faint gold gradient wash
  (`linear-gradient(90deg, rgb(var(--gold-rgb)/.05), transparent 60%)`); name → `.gold`.
- *empty (search miss):* the row's `display:none` filter; section shows the
  existing italic "no players" line.
- *loading:* n/a (static/localStorage data — renders synchronously).

**Admin.** The row **is** the re-skinned `.player-card` / `.legend-card`; the
name stays `.editable[data-eid]`. Add/remove controls render at row end under
`body.edit` (players: `.add-player-btn`; legends: `.card-actions` +
`.add-legend-btn`).

**Dark ↔ light.** Gradient wash alpha .05 is subtle in both; verify the hover
wash is perceptible on light paper (nudge to `.07` if needed — still on-token
via channel).

### 1.7 Scoreboard card grid (B — density, marquee pages)

**Purpose.** The tight, color-coded broadcast grid. Used for Black Stars
matchday coverage, the Black Stars archive library, and available as an
on-token alternate for the Players directory.

**Structure (`gc-board` + cells).** `display:grid` with
`grid-template-columns:repeat(auto-fill,minmax(220–260px,1fr))` (or fixed
`repeat(3,1fr)` for the 6-cell matchday), `gap:var(--space-3xs)`,
`background:var(--line)` so the gaps read as hairline seams (reuses the
`.stat-grid` / `.matchday-grid` seam pattern verbatim). Cells `background:
var(--raised)`, padding `var(--space-3xl)`.

**Accents.** A 3px league-colored **left edge** (`::before`) on directory/archive
cells; a gold **top-bar** that reveals on hover for matchday cells; an oversized
ghosted Playfair segment number (`rgb(var(--gold-rgb)/.16)`) top-right.

**States.** *hover:* `background:var(--lift)` (+ top-bar fade-in on matchday).
*empty:* archive shows the dashed placeholder / italic line. *loading:* n/a.

**Admin.** Cell = re-skinned `.archive-card`; edit/remove in a `.card-actions`
footer inside the cell under `body.edit`.

**Dark ↔ light.** Seam = `--line`; edges = flag channels — theme-free.

### 1.8 Editorial column (A — reading power move)

**Purpose.** The GPA written columns and About prose. Legibility is the whole
job.

**Structure (`gc-col` / `gc-measure` / `gc-drop`).** Playfair headline
(`gc-col-head`, `--fs-d3`/`--fs-2xl`) hangs above a **ruled measure**: a
`border-top:1px solid var(--gold)` (red/green on accented sections), a
constrained `max-width:62ch`, and EB Garamond body (`--font-a`, `--fs-md`,
`--lh-relaxed`, `--body`) with an optional **Playfair drop-cap**
(`::first-letter`, `--fs-4xl`, `.gold`, `float:left`). Watch link uses the
existing `gpa-link-btn`.

**Rhythm.** Section padding `var(--space-10xl) 5vw`. Headline→measure gap
`var(--space-4xl)`. Paragraph spacing `p + p { margin-top: var(--space-lg) }`.
Two-block sections (Goal + Assist) use `gc-col-split` at
`grid-template-columns:1fr 1fr; gap:var(--space-10xl)`, stacking ≤ 820px.

**States.** *empty* (admin not yet written): reuse the existing
`.gpa-write-body:empty::before` "Write your column here…" affordance. *editing:*
inline `contenteditable` dashed-gold outline unchanged.

**Dark ↔ light.** EB Garamond italic body on `--body` clears AA in both; the
red/green top-rules re-channel. **Verify red-on-paper rule visibility (§6).**

### 1.9 Reverence marquee legend plate (C — Legends only)

**Purpose.** The single most-honoured legend gets a framed plate at the top of
the index — the page's one moment of gallery gravity. Used exactly once
(Michael Essien — he has the ★ TikTok/Facebook acknowledgment badge).

**Structure (`gc-marquee-legend`).** Centered, `border:1px solid
rgb(var(--gold-rgb)/.22)`, `background:rgb(var(--gold-rgb)/.04)`, padding
`var(--space-9xl) var(--space-8xl)`. Four **gold-leaf corner brackets**
(`gc-corner`, `1px solid rgb(var(--gold-rgb)/.45)`, 20px, `aria-hidden`). Stack:
era pill → Playfair name with an **italic** emphasized surname (`--fs-d2`) → pos
meta → 56px gold hairline divider → the `lc-badge` acknowledgment → EB Garamond
bio → comp chips → italic quote.

**States.** *hover* on comp chips: `background rgb(var(--gold-rgb)/.12)`. No
scroll motion (reverence register).

**Admin.** Plate = the Essien `.legend-card` re-skinned; all `.editable` eids
(`l2-*`) preserved; the plate is centered but inline edit still works.

**Dark ↔ light.** The `.45` gold-leaf corners are the lowest-contrast element —
**verify in light (§6);** bump to a channel+higher-alpha combo if they vanish on
paper. Keep brackets decorative/aria-hidden.

### 1.10 shadcn mapping

- **`<Button>`** (mapped to `--primary`=`--gold` / `--primary-foreground`=
  `--on-gold` in `@theme`): the hero X-follow CTA, fixture "Follow for Updates"
  (`variant="ghost"`), GPA "Set Link"/admin actions, Contact "Send Message".
  New `.gc-cta` / `.gc-ghost` styles are for **non-button anchors** only
  (`<a>` deep-links); real `<button>`/submit actions keep shadcn `<Button>`.
- **`<Card>`** (`--card`=`--raised`): the underlying surface for fixtures,
  scoreboard cells, gpa blocks, legend plate. Restyle via className; keep the
  component so shadcn theming + `p-6`/border utilities still apply.

---

## 2. Section rhythm (token-based, apply uniformly)

| Rule | Value | Token |
|---|---|---|
| Section vertical padding (desktop) | 52px top/bottom | `--space-10xl` |
| Section vertical padding (≤768px) | 40px | `--space-9xl` |
| Page-header padding | `52px 5vw 40px` | `--space-10xl` / `--space-9xl` |
| Hero padding (Home) | 60px vert | `--space-11xl` |
| Horizontal gutter (all sections) | `5vw` | (matches shell) |
| Section divider | `1px solid` | `--line` |
| Alt section background | — | `--surface` |
| Rule-header → content gap | 32px (reading) / 36px (grid) | `--space-7xl` / `--space-8xl` |
| Card/cell inner padding | 24px / 18px | `--space-5xl` / `--space-3xl` |
| Seam-grid gap | 2px | `--space-3xs` |
| Standard grid gap | 20px | `--space-4xl` |
| Column gutter (ledger/split) | 52px | `--space-10xl` |

**Max-widths (measure discipline).** Reading body ≤ `62ch`; page-header lead
≤ `64ch`; hero/editor block `760px` (unchanged from current GPA/BS). Ledgers and
scoreboards are full-bleed within the `5vw` gutter. Do **not** introduce a
global max-width container — the site is intentionally edge-to-edge; measure is
controlled per text block.

**Grid.** Reuse existing `g2`/`g3`/seam grids. Breakpoints stay at the current
1024 / 768 / 480 stops (§ `src/style.css` responsive block) — no new breakpoints.

---

## 3. Motion spec

All durations/easings below; **every one gated behind
`@media (prefers-reduced-motion: reduce)` which sets the property to `none`.**

| Motion | Property | Duration / easing | Notes |
|---|---|---|---|
| Ticker scroll | `transform: translateX` | 38–40s linear infinite | Home only; freezes on reduced-motion |
| LIVE dot blink | `opacity 1 → .2` | 1.4–1.6s infinite | score-bug + feed; label carries meaning |
| News-panel pulse dot | `opacity` | 2s infinite | existing `pulse` keyframe |
| Card hover lift | `border-color`, `box-shadow` | 250ms ease | existing `--shadow-sm` + gold border |
| Ledger row hover | `padding-left`, `background` | 180ms | 8px shift + gold wash |
| Matchday cell top-bar | `opacity 0 → 1` | 200ms | reveal on hover |
| Comp-chip / watch hover | `background`, `border-color` | 200ms | gold fill-in |
| Entrance reveal-on-scroll | `opacity` + 8px `translateY` rise | 250ms ease | reuse existing `.reveal` hook; disabled on reduced-motion |
| Theme crossfade | bg/border/color/shadow | 350ms (transient) | existing `.theme-transition` |

**Principle:** loud pages (Home, Black Stars) may run 2–3 motions at once
(ticker + blink + hover). Quiet pages (Legends, About, Contact) get hover +
reveal only — no blink beyond the single score-bug dot, no ticker.

---

## 4. Per-page treatment map

References the **real** current sections from `src/pages/*`.

### `/` Home (`Home.tsx`) — **B spine (built: `concept-b.html`)**
- **Ticker** (top): §1.3 promoted marquee with LIVE bug.
- **Hero:** §1.1 full hero — score-bug + uppercase Playfair 3-line headline
  (Ghanaian / Players / Celebrated) + gold-left-border lead + shadcn `<Button>`
  X-CTA + ghost "Our Story"; **News panel** = broadcast feed (§ `concept-b.html`
  `b-feed`), tags flag-colored, `gc_news` seam intact.
- **GPA preview** ("The Weekly Breakdown"): §1.5 B eyebrow+`gc-h2` + 3 broadcast
  segment cards with 3px flag top-bar + ghosted `01/02/03`.
- **Marquee** section: keep existing `.marquee-wrap` (or fold into the top ticker
  visually — FE choice; content frozen).
- **What We Do** (4 cards) + **Our Work So Far** (3 post-cards, 1.3M/Essien/Abedi
  proof): reuse `.card`/`.post-card`; proof numbers get `stat-num` weight.

### `/gpa` GPA Weekly (`GPA.tsx`) — **A columns (built: `spec-gpa.html`)**
- **page-header** → §1.1 `gc-pagehead`, **medium** chevron; score-bug "Updated
  Every Week · Ghanaian Players Abroad".
- **§1 Matchweek Review / §2 Player of the Week (red) / §3 Goal+Assist (split) /
  §4 Underrated (green):** each becomes a §1.8 editorial column — `gc-rule`
  header (dateline meta "Column No. 0X"), Playfair `gc-col-head`, gold/red/green
  ruled `gc-measure`, EB Garamond `gc-drop` with drop-cap, existing
  `gpa-link-btn` watch link. `gpa-write-body` eids + `gpa-admin-link` seams
  unchanged; `:empty::before` prompt preserved.

### `/players` Current Players (`Players.tsx`) — **A ledger (built: `concept-a.html`)**
- **page-header + league filter bar** → `gc-pagehead` (medium chevron) + the
  existing `.filters`/`.f-btn` bar (keep real `<button>`s; ≥44px touch).
- **Weekend Performers:** keep the loud gold-bordered `.performer-card` grid +
  its empty state (this carries the hype since the directory is calm). `gc_performers`
  seam intact.
- **Full Squad Directory (~49):** §1.6 `gc-ledger` two-column ruled index with
  league color dots + search (`gc-rule` header "Ghanaians Playing Abroad").
  Names stay `.editable`; `.add-player-btn` at end.

### `/legends` Legends (`Legends.tsx`) — **A index + C plate (built: `spec-legends.html`)**
- **page-header + search + position filter** → `gc-pagehead` **quiet** register
  (single faint gold chevron), italic EB Garamond lead; `.search` + `.filters`.
- **Legends section:** `gc-rule` header → **one §1.9 reverence plate (Essien)** →
  §1.6 `gc-legger` index of the other 8 (bio + comp links + quote per row, era
  color dot). All `l*-` eids + `comp-row-link`s preserved.
- **Cult Heroes:** `gc-rule` header + `gc-legger` (Quincy). `.add-legend-btn` /
  `.card-actions` remove seams intact for dynamic entries.

### `/blackstars` Black Stars (`BlackStars.tsx`) — **B broadcast (built: `spec-blackstars.html`)**
- **page-header** → `gc-pagehead` **loud** (full 3-line chevron), score-bug
  "Black Stars Watch".
- **Latest Update:** B `gc-eyebrow`+`gc-h2` + §1.8-style `editor-block`
  (gold left-border, EB Garamond body). `bs-*` eids intact.
- **Next Fixtures (2):** `gc-eyebrow`+`gc-h2` + `gc-fixture` scoreboard cards
  (gold top-bar, uppercase Playfair title); shadcn `<Button variant="ghost">`
  CTAs preserved.
- **Matchday Coverage (6):** §1.7 `gc-board` seam grid (3-col) with ghosted
  segment numbers + hover top-bar. `md*` eids intact.
- **Player Archive:** `gc-eyebrow`+`gc-h2` + `.search` + §1.7 scoreboard library
  (`gc-lib`/`gc-arc`, gold left-edge). `a-*` eids, `.card-actions` edit/remove,
  `.add-archive-btn`, add-panel all intact.

### `/about` About (`About.tsx`) — **quiet A + B page-header (built: `spec-about-contact.html`)**
- **page-header** → `gc-pagehead` **quiet** (single gold chevron), italic lead.
- **What We Do / Our Story / Our Vision:** `gc-rule` headers over the existing
  `g2` two-column layouts — EB Garamond prose (drop-cap on the lead paragraph) +
  `stack`/`quote-stack`/"Coming Soon" card reused as-is. `quote-block special`
  Essien beat kept.
- **Fan Reactions Gallery / Requests / When Essien Watched:** `gc-rule` headers;
  `player-group`/`react-grid`, `req-pair`/`req-grid`, `special-box` all reused
  unchanged. `gc_removed_imgs` seam intact.

### `/contact` Contact (`Contact.tsx`) — **quiet A + B page-header (built: `spec-about-contact.html`)**
- **page-header** → `gc-pagehead` **quiet**, italic lead.
- **Form + channels (`g2`):** `gc-rule` "Send a Message" header; existing
  `form-row`/`form-inp` + shadcn `<Button>` submit + `form-ok` success state on
  the left; the `stack` channels (Email/X/TikTok/Facebook/Note) on the right,
  gold-accent on the Note item. `mailto:` behavior unchanged.
- **Closing line:** `alt` centered section, italic EB Garamond "big plans ahead".

### Shared shell (Nav / Footer / Stripe) — **untouched**
No structural change. The flag stripe, sticky blurred nav, theme toggle, social
buttons, and footer stay exactly as-is. The revamp lives entirely in the
`[content]` slot.

---

## 5. Implementation notes for the FE

- **Token-only, always.** No new colors/px/rem/hex anywhere. Every value in this
  spec and the mockups is a `:root` token or an `rgb(var(--*-rgb)/<alpha>)`
  transparency. A reviewer diffing for stray hex/px must find none. The mockups
  inline the tokens for portability — **in the app, reference the tokens, don't
  re-inline them.**
- **Content frozen.** Every headline, column body, player, club, quote, stat,
  and link matches `src/pages/*` verbatim. The mockups use the real copy. Do not
  add/edit/remove text — this is presentation only.
- **Keep the admin seams.** Preserve every `.editable[data-eid]` (names,
  headlines, bios, column bodies), every `body.edit`-gated control
  (`.card-actions`, `.add-*-btn`, `.gpa-admin-link`, `.news-admin-row`, add
  panels), and the `contenteditable` dashed-gold outline. When a card becomes a
  ledger row or scoreboard cell, the row/cell **is** the re-skinned card — move
  the `.card-actions` to the row/cell end; don't drop it.
- **Preserve the shell + shadcn.** Stripe → Nav → content → Footer → Stripe on
  every route. shadcn `<Button>`/`<Card>` stay; new `.gc-*` classes restyle, not
  replace.
- **Theme both ways.** Build and check every screen in dark **and** light. If a
  treatment only reads in one theme, it's using a raw value — fix the token ref.

**Three known-risky spots to nail (verify on review):**

1. **Hero/header vertical rhythm.** The headline→lead gap and the news-panel
   top alignment. Target: score-bug `margin-bottom:var(--space-4xl)` →
   headline → lead `margin-top:var(--space-lg)`. In the Home hero grid, the
   news panel's top edge should align to the **headline cap-height**, not the
   score-bug — set `align-items:center` on `hero-grid` (as `concept-b.html`) or
   `align-items:start` with a matching top offset. Do not let the panel float
   above the headline.
2. **Long player-name wrapping in the density grids.** e.g. "Christopher Bonsu
   Baah", "Abdul Fatawu Issahaku", "Kevin Prince Boateng". In the **ledger**
   (A) names are mixed-case Playfair `--fs-xl` and wrap naturally with
   `line-height:var(--lh-none)` — give the name block `min-width:0` so the grid
   cell can shrink. In the **scoreboard** (B), uppercase names need
   `line-height:var(--lh-snug)` and must be tested at the 220px `minmax`
   min-width — confirm no clipping / no overflow past the cell edge.
3. **Light-theme contrast of faint-gold / low-alpha treatments.** The three to
   confirm on paper `--bg`: (a) the chevron field (gold ≤ .14) must stay a
   whisper, not muddy the header text; (b) the ledger hover gold wash (.05) must
   still be perceptible — nudge to .07 if it disappears; (c) the C-plate
   gold-leaf corner brackets (.45) are the closest call — verify they read
   against light paper, bump the alpha combo if not. All fixes stay on-token via
   the channel syntax.

---

## 6. Accessibility & contrast (carried + specific)

- Body copy uses `--white`/`--body` on `--bg`/`--surface`/`--raised` — AA. Avoid
  `--dim` for anything but decorative numerals (index numbers, ghosted segment
  numbers).
- Gold `#f5c842` on dark ≈ 11:1; `--on-gold` on gold fills is AA. Never gold
  text on gold fill. Red/green as text on dark clear AA; as fills always pair
  `--on-brand`/`--on-gold`.
- **Color coding is never the only signal** — ledger dots and scoreboard edges
  are always accompanied by the league/era text label.
- Filters/CTAs/search stay real `<button>`/`<input>` for focus order; hit
  targets pad to ≥ 44px on touch (filter chips especially). Focus ring = `--gold`
  (`--color-ring`).
- Decorative elements (chevron `::before`, gold-leaf corners, `◆` ticker
  dividers) are CSS-generated / `aria-hidden` → out of the a11y tree.
- All motion respects `prefers-reduced-motion` (§3).

---

## 7. New CSS class names (proposed — FE owns the CSS)

Consistent `gc-` prefix to namespace the revamp additions alongside the existing
vocabulary. Reuse existing classes where noted rather than aliasing.

**Page-header / hero (B):**
`gc-pagehead`, `gc-pagehead-inner`, `gc-ph-title`, `gc-ph-lead`, `gc-ph-kicker`,
`gc-scorebug` (+ `s.live`, `s.meta`), `gc-chevrons` (the `::before` field — or
apply directly on `gc-pagehead::before`).

**Section headers (A + B):**
`gc-rule`, `gc-rule-l`, `gc-rule-r`, `gc-rule-eyebrow` (+ `.r`/`.gr`),
`gc-rule-meta`; `gc-eyebrow`, `gc-h2` (+ `.tight`). *(Existing `.eyebrow` may be
reused directly for the B variant.)*

**Editorial column (A):**
`gc-col`, `gc-col-head`, `gc-col-split`, `gc-measure` (+ section modifiers
`red-accent`/`green-accent`), `gc-drop`, `gc-watch` *(or reuse `gpa-link-btn`)*.

**Ledger / index (A):**
`gc-ledger` / `gc-legger`, `gc-entry` / `gc-lentry`, `gc-idx` / `gc-lidx`,
`gc-entry-name` / `gc-lname`, `gc-entry-meta` / `gc-lmeta`, `gc-lbio`,
`gc-lcomps`, `gc-lcomp`, `gc-lquote`, `gc-entry-lg` / `gc-lera` (+ league/era
modifiers `pl l1 ll sa bl ch ot` / `g r gr`).

**Scoreboard grid (B):**
`gc-board`, `gc-cell` (+ league modifiers), `gc-cell-lg`, `gc-cell-name`,
`gc-cell-meta`; matchday: `gc-md-cell`, `gc-md-num`, `gc-md-icon`, `gc-md-title`,
`gc-md-body`; archive: `gc-lib`, `gc-arc`, `gc-arc-name`, `gc-arc-match`,
`gc-arc-watch`.

**Fixtures / editor (B):**
`gc-fixture`, `gc-fix-lbl`, `gc-fix-title`, `gc-fix-det`, `gc-fix-stake`,
`gc-ghost`; `gc-editor`, `gc-editor-heading`, `gc-editor-body`. *(May instead
restyle the existing `.fixture` / `.editor-block` classes in place — FE choice;
if so, drop the `gc-` aliases.)*

**Reverence plate (C):**
`gc-marquee-legend`, `gc-corner` (+ `tl tr bl br`), `gc-ml-era`, `gc-ml-name`,
`gc-ml-pos`, `gc-ml-divider`, `gc-ml-badge`, `gc-ml-bio`, `gc-ml-comps`,
`gc-ml-comp`, `gc-ml-quote`.

**Quiet editorial (A — About/Contact):**
`gc-prose` (+ `.first` for drop-cap), `gc-sec` (+ `.alt`), `gc-g2`. *(Reuse
existing `stack`/`quote-stack`/`special-box`/`form-*` classes as-is.)*

---

## 8. How the hybrid resolves — per page, one line each

- **Home / Black Stars:** full B broadcast — ticker, LIVE score-bug, flag
  chevrons, uppercase Playfair, scoreboard grids — the matchday-hype mandate at
  full volume.
- **GPA:** A editorial columns (gazette rule headers, gold/red/green ruled
  measures, EB Garamond drop-cap prose) under one B page-header, so the reading
  page reads.
- **Players / Legends:** A ruled ledger index for effortless density at 50+ /
  9 entries, with league/era color wayfinding; Legends adds a single C reverence
  plate (Essien) for gravity.
- **About / Contact:** quiet A editorial prose + reused stacks/quotes/form, each
  fronted by exactly one B page-header moment so they still belong to the same
  broadcast.
