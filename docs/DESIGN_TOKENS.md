# GhanaComps — Design Tokens (Color)

Single source of truth for color. All tokens live in `:root` at the top of
`src/style.css`, with light-theme overrides in the
`@media (prefers-color-scheme: light)` block.

## The one rule
**Never write a raw hex or `rgb()`/`rgba()` hue in a style rule.** Always
reference a token. If you need a color that no token provides, add the token
first — don't inline it. This applies to CSS *and* to React inline `style={{}}`.

## Primary & brand colors
`--gold` is the **primary** color (Ghana flag gold). `--red` and `--green` are
the secondary flag hues, also used semantically (danger / success).

Each brand color is defined **once as RGB channels**, and every transparent
variant is derived from that channel token:

```css
--gold-rgb: 245 200 66;          /* the hue — defined once */
--gold:      rgb(var(--gold-rgb));

/* transparent gold at any alpha — hue can never drift: */
border-color: rgb(var(--gold-rgb) / .3);
background:   rgb(var(--gold-rgb) / .08);
```

Because only the channel is redeclared per theme, light mode needs a single
line per color and every alpha variant follows automatically.

## Token reference

| Token          | Dark            | Light           | Use |
|----------------|-----------------|-----------------|-----|
| `--bg`         | `#0a0a0a`       | `#f5f2ee`       | page background |
| `--surface`    | `#141414`       | `#ede9e3`       | headers, alt sections, footer |
| `--raised`     | `#1c1c1c`       | `#e4e0d8`       | cards |
| `--lift`       | `#242424`       | `#d8d4cc`       | nested/footer strips |
| `--line`       | `rgb(255 255 255 / .09)` | `rgb(0 0 0 / .1)` | borders, grid seams |
| `--white`      | `#ede8df`       | `#1a1814`       | strongest text |
| `--body`       | `#b8b2a8`       | `#3d3a35`       | body copy |
| `--sub`        | `#888078`       | `#6b6760`       | labels, muted text |
| `--dim`        | `#5a5550`       | `#9a968f`       | faintest text |
| `--gold-rgb`   | `245 200 66`    | `184 150 10`    | PRIMARY hue channel |
| `--red-rgb`    | `212 19 38`     | `192 17 31`     | red hue channel |
| `--green-rgb`  | `29 184 99`     | `23 138 74`     | green hue channel |
| `--gold` / `--red` / `--green` | `rgb(var(--*-rgb))` | (inherits) | solid brand fills |
| `--gold-hi`    | `#fdd84a`       | `#a07e08`       | brighter gold for hover/hi-light only |
| `--on-gold`    | `#0a0a0a`       | `#fff`          | text/icon on a gold fill |

## Alpha conventions (gold)
The codebase uses a handful of recurring alphas — reuse these rather than
inventing new ones:

- `/ .04`–`.08` — faint tint backgrounds (panels, special boxes)
- `/ .1`–`.12` — button/badge tint backgrounds
- `/ .18`–`.25` — subtle borders
- `/ .3`–`.4` — hover / focus borders
- `/ .9` — near-solid overlays (play button)

---

# Typography

Same rule: **never write a raw `rem` font-size, `em` letter-spacing, unitless
line-height, or numeric font-weight in a rule** — reference a token. Applies to
CSS and inline `style={{}}`.

## Families
| Token | Value | Use |
|-------|-------|-----|
| `--font-d` | Bebas Neue | display — headings, names, numbers |
| `--font-b` | DM Sans | body / UI (default) |
| `--font-a` | Playfair Display | accent — italic quotes |

## Size scale (rem, root = 16px)
| Token | rem | px | Use |
|-------|-----|----|-----|
| `--fs-micro` | 0.56 | 9.0 | eyebrows, tags, meta, micro-labels |
| `--fs-2xs` | 0.62 | 9.9 | buttons, filters, nav links |
| `--fs-xs` | 0.68 | 10.9 | small links, footer, admin text |
| `--fs-sm` | 0.76 | 12.2 | secondary body, captions, details |
| `--fs-base` | 0.82 | 13.1 | default card body copy |
| `--fs-md` | 0.90 | 14.4 | body / lead paragraphs |
| `--fs-lg` | 0.95 | 15.2 | emphasis body, small titles |
| `--fs-xl` | 1.10 | 17.6 | card / player titles |
| `--fs-2xl` | 1.30 | 20.8 | section subtitles, small display |
| `--fs-3xl` | 1.70 | 27.2 | large display names |
| `--fs-4xl` | 2.10 | 33.6 | stat numbers |
| `--fs-d1` | clamp(2.2→4.8) | — | hero display |
| `--fs-d2` | clamp(1.8→3.5) | — | page-header display |
| `--fs-d3` | clamp(1.3→2.0) | — | section display |

## Weight
`--fw-medium` 500 · `--fw-semibold` 600 (body default is 400).

## Leading (line-height)
`--lh-none` 1 · `--lh-display` 0.9 · `--lh-snug` 1.1 · `--lh-heading` 1.5 ·
`--lh-normal` 1.6 · `--lh-body` 1.75 · `--lh-relaxed` 1.85

## Tracking (letter-spacing, uppercase labels)
`--ls-1` 0.08em · `--ls-2` 0.12em · `--ls-3` 0.16em · `--ls-4` 0.2em · `--ls-5` 0.3em

## Appearance shifts from rationalizing (approved)
The 36 ad-hoc sizes were snapped to the 11-step scale. Notable (>1px) shifts:
- **1.4rem → 1.3rem** (−1.6px): card headings (`.gpa-name`, `.editor-heading`,
  `.fix-title`, `.gpa-write-heading`) — the most visible change.
- **1.2rem → 1.1rem** (−1.6px): `.plat-num`, icon glyphs, one About title.
- **1.5rem → 1.3rem** (−3.2px): `.plat-icon` (an emoji glyph only).
- **0.88rem → 0.82rem** (−1px): `.quote-txt`, `.editor-body`.
- **1rem → 0.95rem** (−0.8px): `.nav-name`, `.performer-caption`.

Letter-spacing: most uppercase labels moved by ±0.02em (imperceptible).
Line-height kept faithful (±0.05 max).

---

# Spacing

Same rule: **never write a raw px value for `padding` / `margin` / `gap`** —
reference a token. Applies to CSS and inline `style={{}}`. Other px (widths,
borders, positioning, transforms) are intentionally left alone.

**Compact-faithful scale:** the design is dense and deliberately tuned, so the
populous values (10/12/14/16/18/20px) are kept exact; only sparse oddballs were
snapped to the nearest rung (≤2px, one exception noted below).

| Token | px | Token | px |
|-------|----|-------|----|
| `--space-3xs` | 2 | `--space-4xl` | 20 |
| `--space-2xs` | 4 | `--space-5xl` | 24 |
| `--space-xs` | 6 | `--space-6xl` | 28 |
| `--space-sm` | 8 | `--space-7xl` | 32 |
| `--space-md` | 10 *(base)* | `--space-8xl` | 36 |
| `--space-lg` | 12 | `--space-9xl` | 40 |
| `--space-xl` | 14 | `--space-10xl` | 52 |
| `--space-2xl` | 16 | `--space-11xl` | 60 *(hero)* |
| `--space-3xl` | 18 | | |

**Snaps applied** (everything at 10/12/14/16/18/20/24/28/32/36/40/52/60 is exact):
`1→2`, `3→4`, `5→6`, `7→8`, `9→8`, `13→12`, `22→24`, `26→24` — all ≤2px.
One larger shift: **`44→40`** (−4px) on the page-header bottom padding only.

# Border radius

| Token | Value | Use |
|-------|-------|-----|
| `--radius-sm` | 2px | buttons, inputs, pills, tags (dominant) |
| `--radius-md` | 3px | mid elements |
| `--radius-lg` | 4px | images, larger cards |
| `--radius-full` | 50% | circles: logos, icon buttons |

Faithful — no radius values changed.

## Known follow-ups (not yet done)
- Several gold-fill elements still set `color: var(--bg)` instead of
  `var(--on-gold)` (e.g. `.performer-link`, `.gpa-link-btn:hover`,
  `.archive-watch:hover`). In light mode this yields low-contrast text on gold.
  Migrate them to `--on-gold` in a follow-up pass.
- Neutral scrims/shadows (`rgb(0 0 0 / …)`, translucent nav backgrounds) are
  intentionally left as literals; tokenize only if they start to multiply.
