# GhanaComps — Visual Revamp Design Brief

> For the UI/UX engineer. This frames the problem and the guardrails. It does
> **not** prescribe a design. Explore bold theme directions freely **within**
> the constraints below.

---

## 0. Hard constraints (read first)

These are non-negotiable. Any direction that breaks one of these is out of scope.

- **Tokens only.** Every color, type size, spacing value, and radius must come
  from an existing token in `src/style.css` `:root`. No new hues, no ad-hoc
  `px`/`rem`/hex. See the token summary in §6.
- **No copy/content changes.** Do not rewrite, add, or remove any text, headline,
  player, quote, stat, or link. This is purely visual — how existing information
  is presented, grouped, weighted, and animated.
- **Fonts are locked.** DM Sans (`--font-b`, body/UI), Playfair Display
  (`--font-d`, display/headings/numbers), EB Garamond (`--font-a`, italic
  accents/quotes). No new families.
- **Don't break theming.** Everything themes by pure token-swapping (dark ↔
  light via `data-theme` + system preference). Because rules reference tokens,
  a redesign that references tokens themes for free. Never hardcode a value that
  would look wrong in the other theme.
- **Don't break admin editability.** The inline-edit system depends on specific
  hooks: `.editable[data-eid]` elements (contenteditable in admin mode),
  `body.edit`-gated controls (`.card-actions`, `.add-*-btn`, admin panels), and
  shadcn `<Button>`/`<Card>` usage. Restructuring markup must preserve these
  seams so admins can still click text to edit and add/remove cards.
- **No backend.** All dynamic content is static JSX or `localStorage`
  (see §5). Do not design features that assume a server.

---

## 1. Product framing

GhanaComps is a fan-run archive and weekly digest of **Ghanaian football** —
the goals, assists, saves, and standout performances of Ghanaians playing
abroad, the Black Stars on matchday, and the legends who carried the flag before
them. It launched January 2026, lives primarily on X/TikTok/Facebook, and this
site is its home base. The audience is Ghanaian football fans and the diaspora —
people who feel their football is under-covered and want it celebrated properly.
The emotional tone is **sporty, celebratory, and archival-proud**: the energy of
a matchday combined with the reverence of a hall of fame. It should feel like it
belongs to Ghana (flag gold/red/green, `+233`) — bold and loud where it hypes
current players, warm and reverent where it honours legends.

---

## 2. Page inventory

Seven routes, all rendered `Stripe → Nav → [content] → Footer → Stripe`. Nav and
Footer are shared shells (flag stripe, sticky blurred nav, dark/light toggle,
social buttons). Sources: `src/App.tsx`, `src/pages/*`, `src/components/*`.

### `/` — Home (`Home.tsx`)
Purpose: front door; orient a first-time fan and route them into the sections.
Sections:
- **Hero** — eyebrow, 3-line display headline (Ghanaian / Players / Celebrated),
  lead paragraph, "Follow us on X" + "Our Story" CTA; right column is a **Latest
  News panel** (admin-managed, up to 4 tagged headlines).
- **GPA preview** — "The Weekly Breakdown", 3 gpa-cards (Matchweek Review, Player
  of the Week, Goal & Assist), link to full GPA.
- **Marquee** — scrolling ribbon of current player names.
- **What We Do** — 4 cards (Weekend Highlights, Legend Throwbacks, Black Stars,
  Requests), each linking to a section.
- **Our Work So Far** — 3 post-cards with thumbnails (Fatawu 1.3M, Essien 2006,
  Abedi Pele) linking to X; "loud in two months" framing.

### `/gpa` — GPA Weekly (`GPA.tsx`)
Purpose: the weekly editorial column; the site's recurring reason to return.
Sections: page-header (GPA Weekly / "Ghanaian Players Abroad") + 4 editorial
blocks, each a written column with an optional "Watch" link button:
**Matchweek Review**, **Player of the Week** (red accent), **Goal & Assist of the
Week** (two blocks), **Underrated Performance** (green accent). All body text is
admin-editable; links are admin-managed via `localStorage`.

### `/players` — Current Players (`Players.tsx`)
Purpose: this-weekend highlights + a searchable directory of Ghanaians abroad.
Sections: page-header with **league filter bar** (All / PL / Ligue 1 / La Liga /
Serie A / Bundesliga / Championship / Other); **Weekend Performers** (admin cards
linking to comps, empty state by default); **Full Squad Directory** (~49 static
player cards: league tag, name, club·position; search-by-name; admin can add
players).

### `/legends` — Legends (`Legends.tsx`)
Purpose: the hall of fame — honour retired greats with their comps.
Sections: page-header with search + position filter (All / Midfielders /
Strikers / Goalkeepers); **Legends grid** (9 static legend-cards: era pill,
name, position·clubs, bio, "Our Comps" link rows with view/like stats, closing
italic quote); **Cult Heroes** section (same card format). Admin can add
legends/cult heroes.

### `/blackstars` — Black Stars (`BlackStars.tsx`)
Purpose: national-team hub — news, fixtures, matchday coverage, player archive.
Sections: page-header; **Latest Update** editorial block (coach news); **Next
Fixtures** (2 fixture cards with stakes write-ups); **Matchday Coverage** (6-cell
grid: Lineup, Goals Live, Breakdown, Comps, Ratings, Injuries); **Player Archive**
(searchable cards — Partey, Kudus, Kyereh + admin-added — each listing matches
with watch links).

### `/about` — About (`About.tsx`)
Purpose: the story, proof, and community around the brand.
Sections: page-header; **What We Do** (text + icon stack); **Our Story**
(text + quote stack incl. the Essien "special moment"); **Our Vision** ("young
talent" coming-soon card); **Fan Reactions Gallery** (grouped screenshot grids
by player, admin-removable); **Requests** (before/after request→delivered image
pairs + grids); **When Essien Watched** (special-box with TikTok/Facebook
screenshots + stats).

### `/contact` — Contact (`Contact.tsx`)
Purpose: let fans request comps / send feedback.
Sections: page-header; **contact form** (name, email, reason select, message —
opens a `mailto:`) beside a **channels stack** (Email, X, TikTok, Facebook, a
note on requests); a closing italic "big plans ahead" line.

### Shared shell (`Nav.tsx`, `Footer.tsx`, `Stripe.tsx`)
Flag stripe top+bottom of every page; sticky blurred nav with logo/`+233`
wordmark, 7 links, Follow-on-X / TikTok buttons, and a mobile drawer containing
the **theme toggle** and social buttons; footer with brand, tagline, links.

---

## 3. Information-presentation priorities (per page)

Keep it simple — what should read first vs. recede.

- **Home:** Hero headline + identity first; News panel second; then the three
  "what we do / weekly / proof" bands as scannable entry points. Proof numbers
  (1.3M, Essien) should feel like trophies, not footnotes.
- **GPA:** It's a **reading** page. Prioritize the written columns' legibility
  and voice; the section labels (Player/Goal/Assist/Underrated) orient; watch
  links are secondary CTAs. Let the red/green accents differentiate sections.
- **Current Players:** Weekend Performers (fresh, timely) lead; the directory is
  a **dense, scannable index** — filter + search + name must stay effortless at
  ~50+ cards. Legibility and quick scanning over decoration.
- **Legends:** Reverent and editorial. Name + era read first; bio and comps
  support; the closing quote is the emotional beat. This is a gallery to linger
  in — give it gravity.
- **Black Stars:** Timeliness first — Latest Update and Next Fixtures up top;
  matchday grid is a clear "what you get" scan; archive is a reference library.
- **About:** Narrative-led. Story and the Essien moment are the emotional peaks;
  the reaction/request galleries are social proof — group them so they read as
  "the crowd," not clutter.
- **Contact:** Form is primary and must feel trivially easy; channels support it.

---

## 4. What "simple, elegant, eye-catching" means here (testable principles)

Check every direction against these:

1. **One hero move per page.** Each page earns exactly one bold, memorable
   gesture (an oversized Playfair headline, an editorial pull, a striking grid).
   Everything else stays quiet. If two things shout, it fails.
2. **Distinct section personalities, one system.** Sections may differ in rhythm
   and weight (e.g. Legends reverent vs. Players energetic) but every one is
   built from the same tokens — no section invents its own look.
3. **Editorial large-type is the signature.** Lean on the Playfair display scale
   (`--fs-d1/d2/d3`, `--fs-3xl/4xl`) and generous negative space. Numbers and
   names are the art. (Tokens already force semibold on display elements.)
4. **Gold is the accent, not the wallpaper.** `--gold` is primary; red/green are
   secondary flag hues for differentiation/status. Surfaces stay neutral
   (`--bg`/`--surface`/`--raised`/`--lift`). A page drowning in gold fails.
5. **Legible at density.** The Players directory (~50 cards) and Legends grid
   must stay effortlessly scannable — clear hierarchy, consistent card anatomy,
   comfortable line-length for body copy (leading tokens exist for this).
6. **Motion with intent.** Purposeful, restrained motion (reveal-on-scroll,
   hover lift, the marquee) that adds matchday energy — never gratuitous. Must
   respect `prefers-reduced-motion` and never block reading.
7. **Themes both ways.** Every screen must look deliberate in **both** dark and
   light. If a treatment only works in one theme, it's using a raw value — fix
   the token reference.
8. **Reuse the component vocabulary.** Cards, pills, eyebrows, stat cells,
   quote blocks, filter bars, marquee already exist. Prefer restyling/recomposing
   these over inventing new component types.

---

## 5. Data / content — where each thing lives (no backend)

So the designer knows what is fixed vs. dynamic vs. editable:
- **Static JSX content:** all page copy, the ~49 player directory, the 9
  legends + cult hero, the 3 seed archive players, matchday grid, fixtures,
  reaction/request image sets, contact channels. Editable copy is wrapped in
  `<Editable eid=…>` (contenteditable in admin; saved to `localStorage`).
- **`localStorage`-backed (admin-managed):** Home news (`gc_news`), GPA links
  (`gc_gpa_links`), Weekend Performers (`gc_performers`), added players
  (`gc_extra_players`), added legends/cult (`gc_extra_legends`/`gc_extra_cult`),
  archive cards (`gc_archive`), removed reaction images (`gc_removed_imgs`),
  per-page text edits (`gc_edits_<path>`), theme choice.
- **External:** all "watch" actions deep-link to X/TikTok; contact uses a
  `mailto:`. There is no on-site video, auth, or database.

**Backend needed?** **No.** This revamp is visual only and rides entirely on the
existing static + `localStorage` model.

---

## 6. Token system available (the palette & scales to design within)

Summarized from `src/style.css` `:root` (and the light-theme override block).
Design **only** with these.

- **Surface ramp (neutral):** `--bg`, `--surface`, `--raised`, `--lift`,
  `--line` (hairline borders).
- **Text ramp:** `--white` (strongest), `--body`, `--sub`, `--dim` (faintest).
- **Brand / flag:** `--gold` (PRIMARY) with `--gold-hi` (hover) and `--on-gold`
  (text on gold); `--red`, `--green` (secondary flag hues); `--on-brand`. All
  brand hues are RGB-channel tokens (`--gold-rgb` etc.) so transparency is
  `rgb(var(--gold-rgb) / <alpha>)` — never a new hex.
- **Type families:** `--font-d` Playfair (display), `--font-b` DM Sans (body/UI),
  `--font-a` EB Garamond (italic accent).
- **Type sizes:** `--fs-micro … --fs-4xl` plus fluid display `--fs-d1/d2/d3`
  (hero / page-header / section). Use the scale — never a raw font-size.
- **Weights:** `--fw-medium` (500), `--fw-semibold` (600). Display elements are
  already pinned to semibold globally.
- **Leading:** `--lh-none … --lh-relaxed` (display tight, body relaxed).
- **Tracking:** `--ls-1 … --ls-5` — for uppercase labels/eyebrows.
- **Spacing:** `--space-3xs (2px) … --space-11xl (60px)`; `--space-md` (10px) is
  the base unit, `--space-10xl` section padding, `--space-11xl` hero padding.
- **Radius:** `--radius-sm (2px)` pills/buttons/inputs → `--radius-lg (4px)`
  images/cards → `--radius-xl (14px)` floating panels → `--radius-pill` /
  `--radius-full`.
- **Effects:** `--shadow`, `--shadow-sm` (card hover depth), `--img-filter`
  (photo treatment, flips per theme), `--nav-bg` (translucent nav).

---

## 7. Success criteria & non-goals

**Success:**
- A distinct, bold new visual identity that reads unmistakably as
  sporty + Ghanaian + archival-proud across all 7 routes.
- Each page has one clear hero move and a coherent section rhythm; density pages
  (Players, Legends, Archive) stay effortlessly scannable.
- Zero regressions: dark **and** light themes both look intentional; admin
  inline-edit and add/remove flows still work; shadcn `<Button>`/`<Card>` and
  the flag-stripe/nav/footer shell remain intact.
- Everything traces to a token — a reviewer can diff for stray hex/px and find
  none.

**Non-goals (explicitly out):**
- Changing any copy, content, data, or routes.
- Introducing new colors, fonts, or arbitrary values.
- Breaking or bypassing the admin edit system or the dark/light theme toggle.
- Adding backend-dependent features, on-site video, or auth.
- Adding net-new component archetypes where an existing one can be recomposed.

---

## Handoff to UI/UX

Prioritize an **editorial, large-type identity** that celebrates names and
numbers — this is a football hall-of-fame meets weekly digest, so type and space
do the heavy lifting, not ornament. Give each page **one hero move** and let
sections carry distinct personalities (Legends reverent, Players energetic, GPA
readable) **all from the shared token system**. Hard constraints: tokens-only
(§6), copy frozen, fonts locked, must theme in both modes, and must preserve the
`.editable`/`body.edit` admin seams and shadcn `<Button>`/`<Card>` +
Stripe/Nav/Footer shell. Reuse the existing component vocabulary (cards, pills,
eyebrows, stat cells, quote blocks, marquee, filter bars) before proposing
anything new. Watch the two density pages — **Current Players** (~50-card
directory) and **Legends/Archive** — where legibility must win over decoration.
