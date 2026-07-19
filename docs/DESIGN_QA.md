# GhanaComps — Holistic Design QA / Critique

> Read-only design pass over the shipped B+A revamp, Apple-craft polish, video
> system, and sporty-card layer. Assessed against `REVAMP_SPEC.md`,
> `POLISH_SPEC.md`, `VIDEO_DESIGN_SPEC.md`, `SPORTY_CARD_SPEC.md` and `style.css`.
> Ranked by visual impact. Dark theme reasoned from tokens; light verified in
> headless renders.

---

## Highest-impact next move (do this first)

**Fix the Home hero feed panel — it is the single weakest element on the site.**
Right now, over the dark hero with the news list empty, `.gc-feed` renders as a
flat translucent-gray rectangle floating on the chevron field. It reads as an
unstyled / unfinished placeholder, not a "frosted broadcast feed." It's the first
thing a visitor sees. See "Should refine #1".

---

## Ship-quality / working well (brief)

- **GPA Weekly** is the most finished page. Editorial columns, drop-caps, ruled
  gold/red/green measures, dateline eyebrows and the 62ch measure read as a
  genuine broadsheet. Type hierarchy and rhythm are correct. No notes.
- **Page-header system** (`gc-pagehead` + score-bug + chevron intensity) is
  consistent across all six non-Home routes. The loud/medium/quiet chevron ladder
  is real and legible. Score-bug LIVE mark is a strong, coherent signature.
- **Ledger discipline** (Players / Legends) — the two-column ruled index is
  genuinely scannable; long names ("Christopher Bonsu Baah", "Abdul Fatawu
  Issahaku") wrap without clipping. `min-width:0` is in place.
- **Legends reverence plate** (Essien) — gold-leaf corner brackets, italic
  surname, centered gravity. The one gallery moment lands.
- **Sporty icon family** — one stroke language (1.75px, round caps), consistent
  weight, reads as a single kit. Genuinely custom, not emoji.
- **Additive-token discipline** — `--glass-*`, `--elev-*`, `--video-*` are all
  correctly re-declared in *both* light selectors (`[data-theme="light"]` and the
  `prefers-color-scheme` block). The flagged POLISH risk-5 gotcha is handled.
- **Nav pills** — centered, calm gold-wash hover, active pill at `/.14`. Clean.
  The circular X/TikTok icon buttons are tidy.
- **Fan Reactions gallery** — `.react-img-wrap` is correctly locked to
  `aspect-ratio:4/5`; tiles are uniform, with a frosted expand glyph on hover and
  a real focus ring. Spec satisfied.

---

## Should refine (ranked by visual impact)

### 1. Home hero feed panel reads as an empty gray box — HIGHEST IMPACT
**Where:** `Home.tsx` hero, `.gc-feed` (style.css ~1480).
Two compounding problems: (a) the news list is empty, so the panel shows only
`.gc-feed-empty` italic text in a large frosted rectangle; (b) `--glass-bg` is a
neutral gray tint, so over the dark broadcast hero the panel resolves to a
washed, low-contrast gray slab with a header bar — it looks like a loading
skeleton, not a designed surface. On a headless light render it's a flat
off-white box floating mid-hero.
**Recommendation:** design the *empty* state properly — it is the state the
client will ship in. Either (i) seed 3–4 real placeholder headlines so the feed
is never empty on first paint, or (ii) give `.gc-feed-empty` real presence: a
centered mark/icon, a headline ("Live headlines coming this weekend"), and a
"Follow @Ghanacomps" CTA — the same tone as the Players performers empty state,
which is already good. Also verify the glass tint over the *dark* hero: the panel
edge and header currently disappear into the film; nudge `--glass-border` visible
or add a hairline top-accent so the panel reads as intentional depth, not a hole.

### 2. Players filter-bar crests are visually inconsistent — HIGH IMPACT
**Where:** `Players.tsx` filter bar, `.f-btn-crest` / `.f-btn-badge` (style.css 749).
The crest chips are the busiest, least-coherent element on the site. Issues:
- Raw brand logos at wildly different visual weights sit in identical 34px chips:
  the **Ligue 1** crest carries a McDonald's sponsor logo, **Bundesliga** and
  **Championship** are horizontal wordmarks that shrink to near-illegible, while
  **La Liga** / **Serie A** are compact marks. They do not read as one set.
- The neutral chip is a **raw hex `#f4f2ec`** (style.css 760) — a real token
  violation in an otherwise disciplined system, and it produces a hard off-white
  rectangle that fights the parchment/dark surfaces on both themes.
- "ALL" and "OTHER" are text-only pills whose height is matched by padding, but
  the baseline still reads slightly off against the taller crest buttons.
**Recommendation:** (a) crop/mask the crests to a uniform *square* focal area
(drop the Ligue 1 sponsor lockup; use crest-only art), normalizing optical weight;
(b) replace `#f4f2ec` with an on-token neutral (e.g. `--white` at low alpha, or a
dedicated `--crest-chip` token) so it themes; (c) if wordmark crests can't be made
to read at 26px, fall back to the text label + colored dot for those leagues
rather than a cramped logo. The row should read as a tidy set of equal-weight
chips.

### 3. "What We Do" glass cards read as weak tinted boxes with no image behind
**Where:** `Home.tsx` "We Cover Every Ghanaian", `.gc-glasscard` (style.css 463).
As the brief flagged: glass over the flat `--surface`/paper background is just a
subtle tint — there is no imagery to frost, so the "material" does nothing except
slightly lighten the card. On the light render the four cards are near-invisible
low-contrast rectangles; the whole section feels faint and unfinished next to the
confident dark hero above it.
Additionally this diverges from the SPORTY_CARD_SPEC: the spec said "What We Do"
should be `gc-sportcard--tight` (opaque `--raised`, `--radius-lg` 4px). The build
instead invented `.gc-glasscard` (glass, `--radius-xl` 14px) with the title/body
set via **inline styles** rather than the `.gc-sportcard-t/-b` classes — so it's
off-spec *and* off the shared type system.
**Recommendation:** drop the glass here (glass needs something behind it to earn
its keep — this is exactly the POLISH guardrail "if a refinement makes the page
quieter than its personality, it has overshot"). Make these opaque `--raised`
sporty cards with a real border and `--elev-1`, matching the About/Contact sporty
cards so the icon-chip family reads as one system across pages. Move the inline
title/body styles onto `.gc-sportcard-t/-b`.

### 4. Card radius is inconsistent across the card family
**Where:** system-wide. POLISH §5 mandated one radius per surface class:
cards = `--radius-md` (3px). In practice: `.gc-glasscard` = 14px, `.gc-sportcard`
(About/Contact) = 14px, `.gc-vcard` = 4px, `.react-img-wrap` = 4px, `.gc-segcard`
/fixtures = 3px, ledger/scoreboard = square. So the "feature card" surfaces sit at
14px while the video/image cards sit at 4px and the broadcast cards at 3px — three
different radii on sibling-feeling surfaces across the site.
**Recommendation:** reconcile to the POLISH table. The sporty feature cards at 14px
are defensible *as a distinct floating-object class* (the spec argued this), but
then the video cards and reaction tiles reading at 4px next to them on the same
pages looks unresolved. Pick two tiers deliberately — "floating feature card" (14px)
vs "media/dense card" (4px) — and document which surfaces are which, so it reads as
a decision, not drift.

### 5. Highlights grid placeholder posters look like error states
**Where:** Home "The Best of the Weekend" / Black Stars "Matchday Highlights",
`HighlightsSection` + `VideoCard`.
The placeholder posters are flat dark tiles with a single red/gold/green tint and a
play glyph. With three in a row (one red, one gold, one green) they read as a
color-test / broken-thumbnail state rather than "highlights coming soon." The
captions underneath ("Goal of the Night", etc.) partly rescue it, but the tiles
themselves feel unfinished.
**Recommendation:** for the placeholder era, give the poster a designed treatment —
a subtle GhanaComps mark or chevron motif ghosted into the tile, or a duotone
gradient rather than a flat single-hue wash — so an empty highlights grid looks
intentional. Keep the play glyph. This is a "shipping with placeholders" state, so
it deserves the same care as the empty feed (#1).

### 6. Reaction tiles miss the reduced-motion freeze
**Where:** `.react-img-wrap` hover lift (style.css 1288); reduced-motion block
(923–938).
`.react-img-wrap` lifts `translateY(-2px)` + shadow on hover on `--ease-spring`,
but it is **not** in the `prefers-reduced-motion` selector list, unlike every other
lifting surface. A reduced-motion user still gets the transform animation.
**Recommendation:** add `.react-img-wrap` (and confirm `.special-screen`) to the
reduced-motion `transform:none` list. One-line fix, consistency + a11y.

---

## Nitpicks / optional polish

- **Score-bug single-segment headers.** On Players/GPA/etc. the score-bug is one
  lone `.live` red segment with no `.meta` companion. The 1px frame around a single
  red pill looks slightly orphaned vs the multi-segment broadcast look the spec
  intended. Consider a trailing `.meta` segment (e.g. the dateline) to complete the
  lower-third read, or accept single-segment as the quiet register.
- **`.gc-glasscard` chip centering via inline style.** The chip uses
  `style={{ marginBottom }}` inline instead of the `.gc-sportcard--tight`
  `margin-bottom` rule. Fold into a class.
- **`.gc-glasscard` isn't in the reduced-motion or hover-lift family** the same way
  `.gc-sportcard--link` is — it inherits `[data-slot="card"]` lift, which is fine,
  but the two paths (glasscard vs sportcard) should be unified per #3/#4.
- **Nav actions vs centered pills.** `.nav-links` is `flex:1; justify-content:center`
  between brand (left) and social actions (right). Because brand and actions have
  unequal widths, the pill row is centered within the *remaining* space, not the
  *viewport* — so it's very slightly off true-center. Only noticeable if you're
  looking for it; a 3-column grid (`brand | 1fr-centered links | actions`) would
  make it optically exact.
- **Chevron rake angle vs content.** On the quiet pages (Legends/About/Contact) the
  single gold chevron rakes across the top-right and, on wider viewports, can clip
  awkwardly close to the score-bug/title block. Verify the chevron stays clear of
  the headline cap on 1440px+.
- **`--fs-micro` (0.56rem) meta on dark.** The `.gc-scorebug span` and various
  eyebrows at 0.56rem with `--sub` are legible but right at the small end;
  fine for decorative labels, worth a contrast spot-check on light paper where
  `--sub` is `#6b6760`.
- **Raw `rgba(255,255,255,...)` in glyph/close chrome.** The video glyph disc and
  expand glyph use raw white alphas (`.28`, `.24`) rather than channel tokens.
  Acceptable for on-media white chrome (it must stay white over any frame), but
  note it as an intentional exception to "tokens only" so a reviewer diffing for
  stray values doesn't flag it as a mistake.

---

## Summary

The system has a strong, coherent spine: GPA, the page-header/score-bug family, the
ledgers, the Legends plate, and the sporty icon set are ship-quality and clearly one
product. The rough edges cluster in three places, all tied to **placeholder / empty
states and the "glass with nothing behind it" material**: the Home hero feed (#1),
the What-We-Do glass cards (#3), and the highlights placeholders (#5). Fix the empty
feed first — it's the front-door impression — then reconcile glass usage (drop it
where there's no image to frost) and normalize card radii. The Players filter crests
(#2) are the one genuinely inconsistent *finished* element and the token violation
worth cleaning before launch.
