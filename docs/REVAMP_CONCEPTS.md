# GhanaComps Revamp — Three Concept Directions

> UI/UX exploration. Three bold, distinct visual identities, each built
> **strictly** from the existing `src/style.css` `:root` tokens, with content
> frozen and fonts locked (Playfair / DM Sans / EB Garamond). Viewable mockups
> render the same two screens — **Home Hero** and **Current Players directory** —
> so the feel is directly comparable. Dark theme (site default); light-theme
> notes are called out per direction.
>
> Mockups (self-contained HTML, real tokens + real Google Fonts):
> - `scratchpad/concept-a.html` — The Broadsheet
> - `scratchpad/concept-b.html` — Matchday Broadcast
> - `scratchpad/concept-c.html` — The Gold Standard

Every direction obeys the hard constraints: tokens only (no new hue/px/rem),
no copy changes, no new fonts, themes by pure token-swap, and preserves the
`.editable`/`body.edit` admin seams, shadcn `<Button>`/`<Card>`, and the
Stripe/Nav/Footer shell. None invents a net-new component archetype — each is a
recomposition of cards, pills, eyebrows, stat cells, quote blocks, filter bars,
and the marquee.

---

## Concept A — The Broadsheet

**Essence:** A Ghanaian football gazette. Print-desk authority — rules, columns,
a dateline, a drop-cap — where names are set like headlines and the directory is
a ruled index.

### The big idea
Treat the site as a serious newspaper of record for Ghanaian football. The
emotion is "archival-proud" dialed toward *editorial gravitas*: this is the
paper that finally covers the story properly. Structure comes from **hairline
rules** (`--line`) and a strict grid, not from fills. Gold is ink — used as a
2px top-rule, a kicker color, a drop-cap — never as a background wash.

### Hero treatment
A masthead. A thin **dateline bar** (`gazette-top`) sits above: italic EB
Garamond date left, Playfair "Ghana *Comps*" wordmark center, `+233 · Est. Jan
2026` right. The three headline lines (`Ghanaian / Players / Celebrated.`) run at
`--fs-d1` Playfair 600 with `-0.02em` tracking, colored white → `--gold` →
`--green`. The lead paragraph sits in a narrow measure (`34ch`) with a Playfair
**drop-cap** in gold, separated from the headline by a `--line` rule above
(`--space-4xl` padding). The News panel becomes an **"In Brief" column**:
`--gold` 2px top-rule, EB Garamond headlines, tag color = flag hue by type
(transfer/gold, injury/red, general/green).

### Layout system & grid
A columnar broadsheet. Section headers use a repeated **rule component**
(`a-rule`): Playfair title left, uppercase meta right, sitting on a 2px bottom
border. Content hangs in 2- or 3-column measures separated by generous
`--space-10xl` gutters. Vertical rhythm is the token scale
(`--space-9xl`/`--space-10xl` section padding), and everything aligns to a shared
baseline via the hairline rules.

### Type treatment
- **Playfair (`--font-d`):** all headlines, player names, section titles,
  drop-cap, and the wordmark. This is the loudest voice.
- **DM Sans (`--font-b`):** eyebrows, kickers, meta, buttons, filter chips,
  index numerals.
- **EB Garamond (`--font-a`):** the lead/drop paragraph, news headlines, GPA
  body, and the closing "contact us" line — the "written word" texture.

### Flag deployment
Gold is the primary ink accent (rules, kickers, drop-cap, hover tint). Red and
green appear only as **section top-rules** in the GPA strip and as league-coded
dots in the directory index (PL gold, Ligue 1/Serie A green, La Liga/Bundesliga
red, Championship gold, Other neutral). The flag stripe top/bottom is the only
saturated element. A page never drowns in gold.

### Motion language
Restrained and "settling," like ink drying. Reveal-on-scroll fades
(`opacity` + 8px rise, 250ms ease). Directory rows shift `padding-left` by
`--space-sm` and reveal a faint gold gradient on hover. News rows lift their
background one surface step. All gated behind `prefers-reduced-motion`.

### Dense content (the directory)
This is the direction's power move: the directory is a **ruled ledger index**,
not cards. Two columns of entries (`01`–`NN` Playfair numerals, name in
`--fs-xl` Playfair, `club · position` meta beneath, league label hanging right
with a colored dot), each row on a `--line` bottom border. It scans like a
league table / index — extremely legible at 50+ rows, low ink, fast vertical
read. Filter + search sit above; search is a borderless Playfair field with a
single gold underline on focus.

### Flatters most
Home, GPA (a reading page — this direction *is* a reading layout), Legends,
About. The whole site reads as one authoritative publication.

### Risks / tradeoffs
- Least "loud" of the three — the matchday energy is quiet. On its own the
  Players directory as an index is calm; **Weekend Performers** must carry the
  hype (keep those as the existing gold-bordered `.performer-card`).
- The index abandons the boxed `.player-card` look; admins still edit names
  inline (each name stays an `.editable`), but the FE must re-skin the card as a
  row. Add/remove affordances move to end-of-row.
- Drop-cap needs a min line-length guard on mobile.

### Light-theme note
Reads beautifully in light — it becomes literal newsprint (warm `--bg` paper,
near-black `--white` ink). The gold rules go deeper/olive automatically via the
light `--gold-rgb`. No treatment depends on darkness.

---

## Concept B — Matchday Broadcast

**Essence:** A live sports-graphics package. A LIVE bug, a scrolling ticker,
angled flag chevrons, jersey-number type, and a scoreboard directory. Loud where
it hypes; strict where it lists.

### The big idea
The energy of a broadcast the moment Ghana kick off. This is the *sporty,
celebratory* pole of the brand at full volume. Signature devices: a **score-bug**
(red LIVE tab + meta), a **lower-third ticker** (the existing marquee, promoted),
and **angled flag chevrons** — thin diagonal gold/red/green keylines raked across
hero backgrounds using layered `linear-gradient`s at low alpha (all
`rgb(var(--*-rgb)/…)`, no new hues).

### Hero treatment
Full-bleed title card. The **marquee runs as a ticker at the very top** with a
red `LIVE` bug pinned left. Below, a two-column hero: left holds the score-bug
(`Live Archive · Ghanaian Football · +233`), the headline in **uppercase**
Playfair `--fs-d1` (white/gold/green), and a lead with a 3px gold left-border.
Primary CTA is a solid gold **"Follow us on X"** pill with the X glyph; secondary
"Our Story" is a ghost. The News panel is a **broadcast feed**: `--lift` header
with a blinking dot, rows with a transparent left-border that turns gold on
hover, chip-style flag-colored tags.

### Layout system & grid
Segments read like broadcast lower-thirds and stat panels. Section titles are
**uppercase Playfair** with a short gold underline eyebrow. GPA preview cards get
a **3px flag-colored top-bar** (gold/red/green) and an oversized ghosted Playfair
segment number (`01/02/03`). Filter chips are **angled tabs** (`clip-path`) like
channel selectors.

### Type treatment
- **Playfair (`--font-d`):** headlines and names, set **UPPERCASE** with tight
  tracking for a bold broadcast-caption feel; also the giant ghosted numbers.
- **DM Sans (`--font-b`):** all UI — score-bug, chips, CTAs, meta, feed tags.
- **EB Garamond (`--font-a`):** kept for GPA body copy so the *reading* voice
  still contrasts the loud chrome — prevents the whole page shouting.

### Flag deployment
The boldest use of all three hues — but disciplined. Gold leads (CTA fill, ticker
bg, primary top-bars). Red = live/urgent (LIVE bug, injury, one accent bar).
Green = go/positive (one accent bar, general news). In the directory each league
gets a **colored left-edge accent** on its cell (PL/Ch gold, L1/SA green,
LL/BL red, Other neutral) — color does real wayfinding work, not decoration.

### Motion language
Matchday energy: the ticker scroll (existing `marquee` keyframes), a blinking
LIVE dot (`opacity` pulse), hover lift + gold border on cards (existing
`--shadow-sm`), reveal-on-scroll. Slightly quicker easing (180–250ms). All
motion respects `prefers-reduced-motion` — the ticker and blink freeze.

### Dense content (the directory)
A **scoreboard**: `--line`-seamed cells on `--space-3xs` gaps (reusing the
`.stat-grid`/`.matchday-grid` seam pattern), each a jersey-style cell with a
colored league left-edge, uppercase league label in the league's color, name in
Playfair `--fs-xl`, `club · position` meta. The seam grid packs tightly and the
color-coding lets the eye jump by league instantly. Search + a small color-key
legend sit above.

### Flatters most
Current Players, Black Stars (matchday grid, fixtures, live coverage), Home hero.
This is the "hype current players" mandate incarnate.

### Risks / tradeoffs
- Highest risk of "too loud." The chevrons and colored bars must stay **low
  alpha**; on Legends/About the broadcast chrome would fight the reverence — those
  pages should dial down to just the eyebrow + uppercase title, no chevrons.
- Uppercase Playfair long names (e.g. "CHRISTOPHER BONSU BAAH") need `--lh-snug`
  and tested wrapping.
- `clip-path` angled chips need a non-angled fallback and adequate hit area
  (pad to ≥44px tall on touch).

### Light-theme note
The low-alpha chevrons and colored edges translate directly (channels re-declare
in light). Watch the ticker: gold bg + `--on-gold` text stays legible both ways
because `--on-gold` flips (`#0a0a0a` dark → `#fff` light) automatically.

---

## Concept C — The Gold Standard

**Essence:** A national hall-of-fame. Vast negative space, a single centered
plate framed by gold-leaf corners, exhibit-label captions, and a directory that
reads as a catalogue of framed specimen plates.

### The big idea
Reverence first — the "hall of fame" half of the brief taken to its most elegant.
Everything is **centered, spacious, and quiet**, so the few gold marks feel
precious. The signature gesture is the **framed plate**: thin gold-leaf corner
brackets around a hero of pure type. Names and numerals are treated as engraved
trophies. This is the most *restrained* and the most premium.

### Hero treatment
A near-full-height centered plate. Four **gold-leaf corner brackets**
(`rgb(var(--gold-rgb)/.4)` 1px) frame the viewport. Centered: a rule-flanked
eyebrow, then the headline on **one line** — "Ghanaian *Players* *Celebrated.*"
with *Players*/*Celebrated* set in **italic Playfair** gold/green (italic display
is the elegance move). A 56px gold hairline divider, then the lead in **italic EB
Garamond** at `--fs-lg`. Actions are centered and minimal (X circle + underlined
"Our Story"). The News panel becomes a quiet **"acquisitions" label strip** below
the plate — a 2-column hairline grid of EB Garamond headlines, deliberately
secondary so it never competes with the plate.

### Layout system & grid
Center-axis symmetry. Sections are centered with an eyebrow + italic-accented
Playfair title and huge top/bottom padding (`--space-10xl`/`--space-11xl`). GPA
preview becomes three **exhibit plaques** on a hairline seam grid with Roman
numerals (I/II/III) in ghosted flag colors. Content lives in a constrained
max-width (≈1000px) so measures stay gallery-comfortable.

### Type treatment
- **Playfair (`--font-d`):** headlines, names, plaque titles — with **italic**
  used expressively for the emphasized words (the direction's signature).
- **EB Garamond (`--font-a`):** the hero lead, all body, news headlines, card
  meta, captions, and the search field — the dominant reading texture, giving the
  whole site a literary museum-label voice.
- **DM Sans (`--font-b`):** only the small uppercase labels/eyebrows/filters —
  the "wall text" system type.

### Flag deployment
The most sparing. Gold is leaf: corner brackets, hairline dividers, italic
emphasis, and the tiny hover underline that grows under a plate. Red/green appear
only as ghosted plaque numerals and news tags. Surfaces stay pure neutral
(`--bg`/`--surface`), and whitespace does the heavy lifting. Gold reads as
precious because there's so little of it.

### Motion language
Slow and dignified. Fades up (300ms), a hairline underline that **grows to 32px**
under a card on hover, gentle background lift on hover. No scroll ticker on this
direction — motion is a whisper. `prefers-reduced-motion` disables the grows/fades.

### Dense content (the directory)
A **catalogue of plates**: centered cards on a hairline seam grid, each with the
league label (gold, uppercase), name in Playfair, and `club · position` in italic
EB Garamond, plus a hover underline that draws in beneath. Calm and beautiful at
density — but intentionally lower-information-density than B (more padding, larger
measure), so it's the slowest to scan of the three.

### Flatters most
Legends (its natural home — reverent, framed, italic quotes), About (narrative),
Home as a statement front door. It gives the archive genuine gravity.

### Risks / tradeoffs
- **Weakest on the "matchday energy / legible-at-density" test.** Centered text
  is slower to scan than left-aligned; 50 centered cards is more work than B's
  scoreboard or A's index. Would need denser spacing tuning for the full 49.
- Italic EB Garamond body at `--fs-base` must be checked for contrast/legibility
  in long GPA columns (it can feel precious over paragraphs).
- Center-axis everything risks feeling static on utilitarian pages (Contact,
  Players). Those may need a left-aligned variant of the same system.
- Corner brackets are decorative; keep them out of the accessibility tree.

### Light-theme note
Stunning in light — becomes cream museum wall + engraved dark type, gold-leaf
brackets going deep-olive. The low-contrast gold-leaf (alpha .4) is the one thing
to verify in light: confirm the brackets still read against `--bg` paper (they
do, but it's the closest call — nudge to a higher alpha token combo if needed).

---

## Accessibility & contrast (all three)

- Body text uses `--body`/`--white` on `--bg`/`--surface` — comfortably AA. `--sub`
  (`#888078`) on `--bg` (`#0a0a0a`) ≈ 4.9:1 (AA for the small meta it carries);
  avoid `--dim` for anything but decorative numerals.
- Gold `#f5c842` on dark `--bg` is high-contrast (~11:1); `--on-gold` (`#0a0a0a`)
  on gold fills is AA-large-and-normal. Never put `--gold` text on `--gold` fill.
- Red/green as **text on dark** clear AA; as **fills** always pair with
  `--on-brand`/`--on-gold`. Concept B's colored league edges are supported by the
  text label (color is never the only signal).
- Hit targets: filter chips, CTAs, and the X button pad to ≥44px on touch. All
  three keep filters as real `<button>`s and search as real `<input>` for
  keyboard/focus order; focus rings use `--gold` (`--color-ring`).
- Motion respects `prefers-reduced-motion` everywhere (ticker, blink, fades,
  underline grows).

## Admin / edit-model fit (all three)

All three keep player names, headlines, and body copy as `.editable[data-eid]`
targets and leave the `body.edit`-gated controls intact:
- **A (index):** name = `.editable` inside the row; row is the new
  `.player-card`. Add/remove buttons render at row end in edit mode.
- **B (scoreboard cell):** cell = `.player-card` re-skinned; `.editable` name
  unchanged; `.card-actions`/remove sit inside the cell footer.
- **C (plate):** plate = `.player-card`; centered layout still hosts inline
  `contenteditable` (the dashed gold outline reads fine centered).
The Home news panel, Weekend Performers add/clear, and GPA link inputs keep their
existing `body.edit` seams in every direction.

---

## Recommendation

**Lead with Concept B (Matchday Broadcast) as the base system, and borrow
Concept A's ledger for the density pages.**

Reasoning:
1. **It answers the brief's emotional core best.** The brand lives on X/TikTok as
   matchday hype; B is the only direction that captures that energy on the
   marquee/hero while still being disciplined enough (low-alpha chevrons, flag
   hues doing wayfinding) to stay tokens-pure and theme both ways.
2. **It wins the two hard tests together.** The hero is genuinely eye-catching,
   and the scoreboard directory is legible at density via color-coded league
   edges — the marquee *and* the index both land.
3. **It has range.** Turning the chevrons off + keeping the uppercase Playfair
   titles gives Legends/About the quieter register they need, so one system
   covers all seven routes without a second dialect.

Where B is weakest is the calm *reading* pages (GPA long columns) and pure
*reverence* (Legends). That's exactly where **A's editorial rules and EB Garamond
columns** and **C's italic-Playfair gravity** shine. So the pragmatic build is:

- **System spine:** Concept B — score-bug eyebrow, uppercase Playfair titles,
  flag-hue accents, seam grids.
- **Reading pages (GPA, About):** apply A's ruled columns + drop-cap +
  EB Garamond measure.
- **Density directories (Players, Archive):** offer A's **ledger index** as the
  default view — it's the most scannable at 50+ and the lowest-risk — with B's
  scoreboard as an alternate that's already on-token.
- **Legends:** lend it C's centered, gold-framed reverence for the one page that
  truly needs it.

If the user wants a **single** pure direction with no blending, my pick is
**Concept A (The Broadsheet)** — it is the safest, most legible, most
unmistakably "archival-proud," and the directory-as-index is the strongest
density answer of the three. **Concept B** is the pick if the priority is
standing out and feeling like matchday. **Concept C** is the pick if the brand
wants to feel like a premium hall-of-fame above all else.
