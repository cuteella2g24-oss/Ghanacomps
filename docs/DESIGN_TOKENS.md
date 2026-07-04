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

## Known follow-ups (not yet done)
- Several gold-fill elements still set `color: var(--bg)` instead of
  `var(--on-gold)` (e.g. `.performer-link`, `.gpa-link-btn:hover`,
  `.archive-watch:hover`). In light mode this yields low-contrast text on gold.
  Migrate them to `--on-gold` in a follow-up pass.
- Neutral scrims/shadows (`rgb(0 0 0 / …)`, translucent nav backgrounds) are
  intentionally left as literals; tokenize only if they start to multiply.
