# GhanaComps — Video Design Spec (Apple video language → our system)

> The single buildable specification for adding **self-hosted video** to
> GhanaComps at Apple-grade fit-and-finish, expressed entirely in the existing
> `src/style.css` token system and the `POLISH_SPEC` materials/motion tokens.
>
> **One line:** *Apple's two-mode video language — silent-ambient in the layout,
> immersive on demand — mapped onto our broadcast/broadsheet identity, tokens
> only, dark + light, admin-editable-ready.*
>
> **Grounded in:**
> - `scratchpad/VIDEO_RESEARCH.md` — the Apple rules checklist (A1–A9) and the
>   embed capability matrix. This spec **is** the design realization of Part C's
>   recommendation.
> - `docs/POLISH_SPEC.md` — reuses `--glass-*`, `--elev-1/2/3`, `--ease-spring`/
>   `--ease-soft`, `--dur-fast/med/slow` so video chrome feels native.
> - `docs/REVAMP_SPEC.md` + `src/style.css :root` — palette, `--fs-*`,
>   `--space-*`, `--radius-*`, `gc-` naming, admin seams.
>
> **Hard constraints (carried forward):** tokens only — **no new brand hue, no
> raw hex/px** in component rules (transparencies via `rgb(var(--*-rgb)/α)`);
> content frozen (new sections use only the minimal labels defined here); dark
> **and** light both work; the `.editable[data-eid]` / `body.edit` admin seams,
> shadcn `<Button>`/`<Card>`, and the Stripe → Nav → content → Footer → Stripe
> shell stay intact. Every value below traces to a `:root` token.
>
> **The decisions this spec designs to (from the brief):** three real placements
> are all **self-hosted muted MP4 + a custom player** (never raw embeds): (1)
> ambient hero background loop, (2) highlights grid/carousel, (3) player/legend
> card clips. Raw X/TikTok embeds appear **only** in a clearly-labelled social
> strip and as a contained-in-lightbox fallback. We scaffold with placeholder
> clips/posters; the client swaps real MP4s later with zero code change (§F).

Companion proof (self-contained, real tokens, dark theme):
`scratchpad/video-ui.html` — highlights grid, a player/legend card clip, and the
immersive lightbox open state. (Static render: motion is described here, not in
the proof — a still cannot show a fade or a spring.)

---

## 0. Two modes, kept religiously separate (Research A1)

Everything below is one of exactly two things. Never blur them.

| | **Ambient** (in the layout) | **Immersive** (on demand) |
|---|---|---|
| Sound | always muted | on (user-initiated) |
| Autoplay | yes, muted, on-scroll-into-view | no — opens on tap |
| Chrome | **none** (hero) / one play glyph (card) | full: play/pause, scrub, captions, replay, close |
| Loop | seamless loop | play through → **Replay** affordance, no auto-loop |
| Where | hero background layer; card poster preview | the lightbox only |
| Reduced-motion | **static poster**, manual play button | unaffected (already user-initiated) |

Rule: **no player chrome in ambient mode; no autoplaying sound anywhere; sound
only after an explicit user action.**

---

## 1. Additive tokens (video-specific)

The video UI is overwhelmingly built from existing tokens + the POLISH
materials. Only **four** additive tokens are needed — all geometry/scrim, none a
new brand hue, all re-declared per theme where they carry color. If the FE
prefers, these can inline as literals in the video rules; defining them keeps the
scrim tunable in one place.

```css
:root {
  /* ── VIDEO (additive) ─────────────────────────────────────────────────
     Only what existing tokens genuinely can't express: two legibility scrims
     and the lightbox backdrop. No new hue — pure black/neutral alpha ramps. */

  /* Hero legibility scrim — a directional dark wash under the headline column
     so the Playfair hero title stays AA over ANY video frame. Left-weighted
     (text lives left); fades to near-clear over the video's right side. */
  --video-scrim-hero:
    linear-gradient(90deg,
      rgba(0,0,0,.72) 0%, rgba(0,0,0,.58) 34%,
      rgba(0,0,0,.28) 62%, rgba(0,0,0,.08) 100%),
    linear-gradient(0deg, rgba(0,0,0,.45) 0%, transparent 42%); /* bottom grounding */

  /* Card poster scrim — a bottom-up gradient so a caption/tag/play glyph reads
     over a bright poster frame. Used on video-card + card-clip. */
  --video-scrim-card:
    linear-gradient(0deg, rgba(0,0,0,.62) 0%, rgba(0,0,0,.12) 46%, transparent 72%);

  /* Lightbox backdrop dim — pairs with the POLISH --glass-blur on the overlay. */
  --video-backdrop: rgba(0,0,0,.78);

  /* Play-glyph disc surface — frosted white disc, Apple's single control. */
  --video-glyph-bg: rgba(255,255,255,.16);
}

:root[data-theme="light"],
@media (prefers-color-scheme: light) { :root:not([data-theme]) {
  /* Hero scrim stays dark: the hero video is dark-cinematic in BOTH themes
     (video is imagery, not a themed surface) and the hero title is --white on
     video → keep the dark scrim so AA holds on paper too. */
  --video-scrim-hero:
    linear-gradient(90deg,
      rgba(0,0,0,.70) 0%, rgba(0,0,0,.54) 34%,
      rgba(0,0,0,.26) 62%, rgba(0,0,0,.06) 100%),
    linear-gradient(0deg, rgba(0,0,0,.42) 0%, transparent 42%);
  --video-scrim-card:
    linear-gradient(0deg, rgba(0,0,0,.58) 0%, rgba(0,0,0,.10) 46%, transparent 72%);
  /* Lightbox backdrop lightens slightly so paper mode isn't a black void, but
     stays dark enough to focus the player (the player content is dark video). */
  --video-backdrop: rgba(20,18,14,.72);
  --video-glyph-bg: rgba(255,255,255,.20);
} }
```

**Why these and nothing more:** corners = `--radius-*`; depth = `--elev-*`;
motion = `--ease-*`/`--dur-*`; glass = `--glass-*`; text = `--white`/`--body`/
`--sub`; brand accents = `--gold`/`--red`/`--green`. The scrims/backdrop are the
one thing the palette can't express because they must guarantee AA over
arbitrary imagery — so they're black-alpha ramps, not brand colors.

---

## 2. Component inventory

Each component is defined with structure, tokens, states (default/hover/focus/
active/disabled/loading/empty/error), motion, reduced-motion, a11y, performance,
and admin behavior.

### 2.a — Ambient hero video layer (`gc-hvideo`)

**Purpose.** A muted, looping clip sitting **behind** the existing Home (and
optionally Black Stars) hero — reads as motion design, not "a video." The
headline, score-bug, lead, and the frosted feed panel all sit on top, unchanged.

**Structure (added inside the existing `.gc-hero` / `.gc-pagehead`, before
`.gc-hero-glow`, at `z-index:0`):**
```
.gc-hero.gc-chevrons.loud            (existing — position:relative; overflow:hidden)
  └ .gc-hvideo            z-index:0   ← NEW ambient layer (wraps poster + video)
      ├ .gc-hvideo-poster            (the poster <img>, object-fit:cover)
      ├ video.gc-hvideo-el           (muted autoplay loop playsinline preload=none)
      └ .gc-hvideo-scrim  z-index:1  (the --video-scrim-hero wash)
  ├ .gc-hero-glow         z-index:0   (existing gold radial — sits ABOVE video, below content)
  └ .gc-hero-grid         z-index:1   (existing — untouched)
```

**Layering / interaction with existing hero pieces:**
- The **chevron field** (`.gc-chevrons::before`, z-index 0) currently rakes the
  surface. With video present, drop the chevron opacity is NOT needed — instead
  the chevrons render **above** the scrim (`z-index: 1`, still below content) so
  the broadcast keylines read as an overlay on the footage. This keeps the
  broadcast identity *on top of* the film, exactly the desired hybrid.
- The **hero glow** (gold radial) stays; over video it becomes a soft warm
  vignette on the right — pleasant, no change needed.
- The **frosted feed panel** (`.gc-feed`) already sits at z-index 1 on the right;
  its `--glass-blur` now frosts the *video* behind it instead of the flat
  surface — this is a bonus (Apple vibrancy over live motion). Contrast guard:
  the panel's neutral `--glass-bg` tint (.62 dark / .68 light) mutes any bright
  video frame before `--white` titles sit on it. **Verify AA over the worst
  frame — see §7 risk 1.**

**Video attributes (the exact silent-autoplay recipe, Research A2):**
```html
<video class="gc-hvideo-el"
       muted autoplay loop playsinline
       preload="none"
       poster="/assets/video/hero/home-hero.poster.jpg"
       aria-hidden="true" tabindex="-1">
  <source src="/assets/video/hero/home-hero.webm" type="video/webm" />
  <source src="/assets/video/hero/home-hero.mp4"  type="video/mp4" />
</video>
```

**Tokens / CSS:**
```css
.gc-hvideo { position: absolute; inset: 0; z-index: 0; overflow: hidden;
             background: var(--surface); /* base color before poster paints */ }
.gc-hvideo-poster, .gc-hvideo-el {
  position: absolute; inset: 0; width: 100%; height: 100%;
  object-fit: cover; object-position: center;
}
/* Poster-first, then cross-fade to video (Research A2). */
.gc-hvideo-el { opacity: 0; transition: opacity var(--dur-slow) var(--ease-soft); }
.gc-hvideo.is-playing .gc-hvideo-el { opacity: 1; }
.gc-hvideo.is-playing .gc-hvideo-poster { opacity: 0; transition: opacity var(--dur-slow) var(--ease-soft); }
.gc-hvideo-scrim { position: absolute; inset: 0; z-index: 1;
                   background: var(--video-scrim-hero); pointer-events: none; }
/* chevrons + glow + grid keep z-index per §2.a layering note */
.gc-hero.gc-chevrons.loud::before { z-index: 1; }  /* raise chevrons over the scrim */
```

**States.**
- *default (loading/before canplay):* poster paints (LCP is the image, never a
  black flash). Video at `opacity:0`, `preload="none"`.
- *is-playing:* JS adds `.is-playing` once the `play()` promise resolves →
  video cross-fades in over `--dur-slow`, poster fades out. **Always handle the
  `play()` rejection** (Research A3/A9): on reject, stay on poster, do nothing
  loud, optionally reveal a tiny manual play affordance.
- *scrolled out of view:* `IntersectionObserver` (< ~25% visible) → `pause()`;
  back in → `play()`. Matches iOS's own pause-off-screen rule.
- *error (source 404 / decode fail):* poster remains; layer degrades to a static
  hero image. No visible error — the poster IS the fallback.
- *reduced-motion:* **do not autoplay.** Poster only, no `.is-playing`, no
  observer. (No manual play button in the hero — the hero is ambient decoration;
  a static poster is the correct reduced-motion end state. A play control here
  would imply immersive content that doesn't exist.)

**Motion.** Poster→video cross-fade `--dur-slow` (520ms) `--ease-soft`. No other
motion in the ambient layer. All gated on `prefers-reduced-motion: no-preference`.

**a11y.** The video is decorative → `aria-hidden="true"`, `tabindex="-1"`, no
captions needed (muted, no speech — Research A8). It must never be a focus stop
or carry meaning the headline doesn't already state. Sound is impossible here.

**Performance.** `preload="none"` + poster; hero is the ONE video that may
`preload="metadata"` if LCP testing wants it, but default `none`. File budget
≤ ~4MB desktop / ≤ ~2MB mobile, H.264 + WebM/AV1, CRF ~23–28. Serve a smaller
`*-mobile.mp4` via a `media`-conditioned `<source>` or JS. On `save-data` or
≤ 480px, **skip the video entirely and show the poster** (Research A9).

**Admin.** The poster + source paths are conceptually admin-editable later
(like `gc_news`): a `gc_hero_video` localStorage record `{ poster, mp4, webm }`.
Under `body.edit`, a small dashed-gold "Set hero video" affordance (mirrors the
`.news-admin-row` pattern) swaps the paths. No structural change for MVP —
scaffold with placeholder paths (§F).

---

### 2.b — Video card (`gc-vcard`) — highlights grid **and** player/legend clips

**Purpose.** The single reusable poster-first video tile. One component, two
size variants and one aspect modifier. Poster + one Apple-style play glyph;
tap → opens the immersive lightbox (§2.d).

**Structure:**
```
button.gc-vcard[ .sm | .lg ][ .r16x9 | .r9x16 | .r4x5 ]   ← a real <button>
  ├ .gc-vcard-media          (aspect-locked box, overflow:hidden)
  │   ├ img.gc-vcard-poster  (loading="lazy", object-fit:cover)
  │   ├ .gc-vcard-scrim      (--video-scrim-card, bottom-up)
  │   ├ .gc-vcard-glyph      (the single play disc + triangle)
  │   └ .gc-vcard-dur        (optional "1:24" duration chip, top-right)
  └ .gc-vcard-cap            (optional caption block under the media)
      ├ .gc-vcard-tag        (eyebrow: "HIGHLIGHT" / league, --gold micro)
      └ .gc-vcard-title      (Playfair --fs-lg, --white)
```

**Aspect discipline (Research A5).** Ratio is locked on `.gc-vcard-media` via
`aspect-ratio` so there is zero layout shift while the poster loads:
- `.r16x9` → landscape highlight (`aspect-ratio: 16/9`) — default for the grid.
- `.r9x16` → phone-shot vertical clip (`aspect-ratio: 9/16`).
- `.r4x5` → portrait (`aspect-ratio: 4/5`) — the player/legend card-clip default.

**Tokens / CSS:**
```css
.gc-vcard {
  display: block; width: 100%; text-align: left; cursor: pointer;
  background: var(--raised); border: 1px solid var(--line);
  border-radius: var(--radius-lg);           /* image-class radius (§POLISH 5) */
  overflow: hidden; box-shadow: var(--elev-1);
  transition: border-color var(--dur-med) var(--ease-spring),
              box-shadow var(--dur-med) var(--ease-spring),
              transform var(--dur-med) var(--ease-spring);
}
.gc-vcard:hover { border-color: rgb(var(--gold-rgb) / .3);
                  box-shadow: var(--elev-2); transform: translateY(-2px); }
.gc-vcard:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.gc-vcard:active { transform: translateY(-1px); }   /* press settle */

.gc-vcard-media { position: relative; aspect-ratio: 16/9; overflow: hidden;
                  background: var(--surface); }
.gc-vcard.r9x16 .gc-vcard-media { aspect-ratio: 9/16; }
.gc-vcard.r4x5  .gc-vcard-media { aspect-ratio: 4/5; }
.gc-vcard-poster { width:100%; height:100%; object-fit:cover; filter: var(--img-filter);
                   transition: transform var(--dur-med) var(--ease-spring); }
.gc-vcard:hover .gc-vcard-poster { transform: scale(1.03); }
.gc-vcard-scrim { position:absolute; inset:0; background: var(--video-scrim-card);
                  pointer-events:none; }

/* The single Apple play glyph — frosted disc, centered, generous hit area. */
.gc-vcard-glyph {
  position: absolute; inset: 0; margin: auto;
  width: 56px; height: 56px; border-radius: var(--radius-full);
  display: flex; align-items: center; justify-content: center;
  background: var(--video-glyph-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  border: 1px solid rgba(255,255,255,.28);
  transition: transform var(--dur-med) var(--ease-spring),
              background var(--dur-fast) var(--ease-soft);
}
.gc-vcard:hover .gc-vcard-glyph { transform: scale(1.08); background: rgba(255,255,255,.24); }
.gc-vcard-glyph svg { width: 20px; height: 20px; fill: #fff; margin-left: 2px; } /* optical center */
.gc-vcard.sm .gc-vcard-glyph { width: 44px; height: 44px; }  /* ≥44px min hit target */
.gc-vcard.sm .gc-vcard-glyph svg { width: 16px; height: 16px; }

.gc-vcard-dur {
  position: absolute; top: var(--space-sm); right: var(--space-sm);
  padding: var(--space-3xs) var(--space-xs);
  font-size: var(--fs-micro); letter-spacing: var(--ls-1); font-weight: var(--fw-medium);
  color: #fff; background: rgba(0,0,0,.55); border-radius: var(--radius-sm);
  -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
}
.gc-vcard-cap { padding: var(--space-lg) var(--space-2xl) var(--space-2xl); }
.gc-vcard-tag { font-size: var(--fs-micro); letter-spacing: var(--ls-4);
                text-transform: uppercase; color: var(--gold); margin-bottom: var(--space-2xs); }
.gc-vcard-title { font-family: var(--font-d); font-weight: var(--fw-semibold);
                  font-size: var(--fs-lg); line-height: var(--lh-snug);
                  letter-spacing: -0.005em; color: var(--white); }
```

**Variants.**
- **Large (`.lg`)** — highlights grid, ~360–420px column. 56px glyph, caption
  shown, `--fs-lg` title. Default `.r16x9`.
- **Small (`.sm`)** — player/legend card clip and dense grids, ~200–260px. 44px
  glyph (still ≥44px hit target), caption optional (often just the media +
  duration chip). Default `.r4x5` on legend/player cards.

**States (all variants).**
- *default:* poster + scrim + resting glyph, `--elev-1`.
- *hover:* lift `translateY(-2px)`, `--elev-2`, gold border, poster `scale(1.03)`,
  glyph `scale(1.08)` (spring). Large surface lifts, **never scales** (POLISH §4).
- *focus-visible:* 2px gold outline, 2px offset (keyboard).
- *active/press:* settle to `translateY(-1px)`.
- *loading:* poster `loading="lazy"`; before it paints the `.gc-vcard-media`
  shows `--surface` at the locked ratio → **no layout shift**. Optional shimmer:
  a `--lift`→`--surface` linear-gradient pulse on `.gc-vcard-media::after`,
  frozen under reduced-motion.
- *empty (no clips in a section):* the grid renders the existing dashed
  placeholder idiom — reuse `.post-placeholder` markup with an italic
  "No highlights yet — <a>follow @Ghanacomps</a>." line (matches the Players
  performers empty state verbatim in tone).
- *error (poster 404):* `.gc-vcard-media` stays `--surface` with a centered
  `--sub` "▶" glyph on the scrim — reads as "clip unavailable," not broken.
- *disabled:* n/a for MVP (cards are always actionable). If ever needed:
  `opacity:.5; pointer-events:none;` and hide the glyph.

**Motion.** Hover lift + poster scale + glyph scale on `--ease-spring`
`--dur-med`; glyph bg on `--ease-soft` `--dur-fast`. All frozen under
reduced-motion (poster static, no scale, instant border feedback only — reuse
the existing card-family reduced-motion block by adding `.gc-vcard` to it).

**a11y.** Real `<button>` (or `<a>` if it deep-links) with an
`aria-label="Play highlight: {title}"`. The glyph SVG is `aria-hidden`. Duration
chip text is decorative but readable. Hit target ≥44px (glyph + card). Focus
order follows DOM; opening the lightbox moves focus into it (§2.d).

**Performance.** Poster `loading="lazy"` + `decoding="async"`; **no `<video>` is
mounted in the card at all** — the MP4 is fetched only when the lightbox opens.
This keeps a dense grid to N images, not N videos (Research A9). Optional
"preview-on-hover" (a muted inline `<video>` that plays on pointerenter) is
**out of scope for MVP** to protect the file budget; if added later it must be
desktop-pointer-only and reduced-motion-gated.

**Admin.** A card = a re-skinned archive/performer entry. Its `{poster, mp4,
webm, title, tag, duration, originalUrl}` live in the same localStorage records
that already back the archive/performers (§F, §5). `.card-actions` edit/remove
render at the card end under `body.edit`, exactly as `.archive-card` does today.

---

### 2.c — Highlights section (`gc-highlights`)

**Purpose.** The Apple-grade unified grid/carousel of `gc-vcard.lg` tiles. Lives
on Home and (optionally) Black Stars.

**Structure & header (reuses the existing broadcast section grammar):**
```
section.reveal
  .gc-eyebrow            "Highlights"            (existing gold-tick eyebrow)
  h2.gc-h2               "The Best of the <span class="gold">Weekend.</span>"
  .gc-highlights-grid    (the video-card grid)
      button.gc-vcard.lg.r16x9  × N
```
Header uses `gc-eyebrow` + `gc-h2` because this is a **broadcast** section (per
REVAMP §1.5 rule of thumb). Copy is minimal/new and defined here.

**Layout — grid (default) vs carousel:**
```css
.gc-highlights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-4xl);                 /* 20px — standard grid gap */
  margin-top: var(--space-8xl);          /* 36px — section head → grid (POLISH §1.2) */
}
```
- **Desktop (≥1024px):** 3 up (auto-fill lands ~3 at 320px min in the 5vw
  gutter).
- **Tablet (768–1024px):** 2 up.
- **Mobile (≤768px):** the grid becomes a **horizontal snap carousel** so the
  clips stay large and swipeable rather than a tall stack:
```css
@media (max-width: 768px) {
  .gc-highlights-grid {
    grid-auto-flow: column;
    grid-template-columns: none;
    grid-auto-columns: 82%;              /* peek the next card */
    overflow-x: auto; scroll-snap-type: x mandatory;
    scroll-padding: 0 5vw; gap: var(--space-2xl);
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;               /* hide bar; swipe affordance is the peek */
  }
  .gc-highlights-grid > .gc-vcard { scroll-snap-align: start; }
}
```
The "peek" (82% width) is the carousel affordance — no custom arrow chrome
needed on mobile (Apple keeps it minimal). Desktop stays a calm grid.

**Spacing rhythm.** Section vertical padding `--space-11xl` (60px, inherited from
`section`). Eyebrow→`gc-h2` `--space-md`. `gc-h2`→grid `--space-8xl` (36px).
Grid gap `--space-4xl`. This matches the polished section rhythm exactly.

**States.** *empty:* single centered `.post-placeholder` (italic, gold link).
*loading:* each tile shows its locked-ratio `--surface` box (no CLS).

**a11y.** Section has a heading (`gc-h2`) so it's a landmark target. The mobile
carousel is horizontally scrollable with the keyboard (native) and each tile is
a real button in DOM order.

**Admin.** Under `body.edit`, an `.add-*-btn` dashed-gold tile appends a clip
(same pattern as `.add-archive-btn`). Order is DOM order; no drag for MVP.

---

### 2.d — Immersive lightbox player (`gc-lightbox`)

**Purpose.** The one place video gets **sound + real controls**. Opens from any
`gc-vcard` (or a card-clip). The poster appears to **grow into** the player over
a dimmed, blurred backdrop; page behind is inert.

**Structure (portal to `document.body`, sibling of the app root — NOT nested in
any `backdrop-filter` ancestor, per the nav containing-block gotcha):**
```
.gc-lightbox[role="dialog"][aria-modal="true"][aria-label="…"]
  ├ .gc-lightbox-backdrop            (dim + blur, click to close)
  └ .gc-lightbox-stage
      ├ button.gc-lightbox-close     (X, top-right, ≥44px)
      ├ .gc-lightbox-frame           (aspect-locked; the poster grows into this)
      │   ├ img.gc-lightbox-poster   (shown until video canplay)
      │   └ video.gc-lightbox-el     (controls, captions <track>, NOT muted)
      └ .gc-lightbox-caption         (optional: title + "View original on X ↗")
```

**Open/close motion (Research A6, A7).** The trigger card's poster scales + fades
into the frame — a spring on open, slightly faster ease-in on close.
```css
.gc-lightbox { position: fixed; inset: 0; z-index: 9997;
               display: flex; align-items: center; justify-content: center;
               padding: clamp(var(--space-5xl), 4vw, var(--space-11xl)); }
.gc-lightbox-backdrop {
  position: absolute; inset: 0; background: var(--video-backdrop);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturate));
  opacity: 0; transition: opacity var(--dur-med) var(--ease-soft);
}
.gc-lightbox.is-open .gc-lightbox-backdrop { opacity: 1; }

.gc-lightbox-stage {
  position: relative; z-index: 1; width: min(100%, 1100px);
  transform: scale(.92); opacity: 0;
  transition: transform var(--dur-med) var(--ease-spring),   /* ~280ms open */
              opacity var(--dur-med) var(--ease-soft);
}
.gc-lightbox.is-open .gc-lightbox-stage { transform: none; opacity: 1; }
/* Close: slightly faster ease-in (Research A6) */
.gc-lightbox.is-closing .gc-lightbox-stage {
  transform: scale(.96); opacity: 0;
  transition: transform var(--dur-fast) var(--ease-soft), opacity var(--dur-fast) var(--ease-soft);
}

.gc-lightbox-frame {
  position: relative; width: 100%; aspect-ratio: 16/9;
  background: #000;                 /* letterbox = pure black, never a random color (A5) */
  border-radius: var(--radius-xl);  /* floating-panel radius */
  overflow: hidden; box-shadow: var(--elev-3);
}
/* Vertical clips: cap width so a 9:16 doesn't tower — center on black. */
.gc-lightbox.r9x16 .gc-lightbox-stage { width: min(100%, 420px); }
.gc-lightbox.r9x16 .gc-lightbox-frame { aspect-ratio: 9/16; }
.gc-lightbox-poster, .gc-lightbox-el { position:absolute; inset:0; width:100%; height:100%;
                                       object-fit: contain; }  /* contain: whole frame matters */
.gc-lightbox-el { opacity: 0; transition: opacity var(--dur-med) var(--ease-soft); }
.gc-lightbox.is-ready .gc-lightbox-el { opacity: 1; }

.gc-lightbox-close {
  position: absolute; top: calc(-1 * var(--space-9xl)); right: 0;   /* above the frame */
  width: 44px; height: 44px; border-radius: var(--radius-full);
  display: flex; align-items: center; justify-content: center;
  background: var(--video-glyph-bg); color: #fff;
  -webkit-backdrop-filter: blur(var(--glass-blur)); backdrop-filter: blur(var(--glass-blur));
  border: 1px solid rgba(255,255,255,.28);
  transition: background var(--dur-fast) var(--ease-soft), transform var(--dur-fast) var(--ease-spring);
}
.gc-lightbox-close:hover { background: rgba(255,255,255,.24); transform: scale(1.06); }
.gc-lightbox-close:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
.gc-lightbox-caption {
  margin-top: var(--space-lg); display: flex; justify-content: space-between;
  align-items: baseline; gap: var(--space-lg); color: var(--body);
}
.gc-lightbox-caption .t { font-family: var(--font-d); font-weight: var(--fw-semibold);
                          font-size: var(--fs-lg); color: #fff; letter-spacing: -0.005em; }
.gc-lightbox-caption a { font-size: var(--fs-xs); letter-spacing: var(--ls-1);
                         text-transform: uppercase; color: var(--gold); }
```

**Controls.** Use the **native `controls` attribute** on the `<video>` — Apple's
own players use platform-native controls, they auto-hide on playback and reveal
on tap/move, and they give us play/pause, scrub, volume, captions, fullscreen,
and keyboard operability **for free and accessibly**. Do **not** hand-roll a
control bar for MVP (a custom bar is a large a11y surface to get wrong). The one
custom chrome is the close button + optional caption row.
- **Replay:** on `ended`, do NOT loop; the native controls already show a replay
  affordance at the end of the scrubber. (If a fully custom bar is built later,
  add an explicit centered Replay glyph per Research A4.)
- **Captions:** a `<track kind="captions" srclang="en" src="…vtt" default>` when
  the clip has speech/meaning (Research A8). The native control exposes the CC
  toggle. Ambient hero + silent highlight loops need none.

**States.**
- *default (closed):* not mounted / `display:none`.
- *opening:* mount → next frame add `.is-open` → backdrop fades, stage springs
  in; poster shows; video `preload="metadata"` starts, `.is-ready` on canplay.
- *playing:* native controls auto-hide; sound on (user opened it → allowed).
- *loading (buffering):* poster stays under the video until `.is-ready`; native
  spinner handles buffering within playback.
- *error:* if the MP4 fails, keep the poster and show a `--sub` line
  "Clip unavailable — <a>view original ↗</a>" in the caption row.
- *empty:* n/a (only opens with a source).
- *closing:* `.is-closing` → stage scales/fades out on the faster curve →
  unmount, **pause + reset the video**, return focus to the trigger.

**Focus / keyboard / scroll (Research A6, A8).**
- On open: `role="dialog"`, `aria-modal="true"`, `aria-label` = clip title;
  move focus to `.gc-lightbox-close`; **trap focus** within the dialog.
- **Esc** closes; backdrop click closes; the X closes. All return focus to the
  triggering card.
- **Scroll-lock** the body while open (`overflow:hidden` on `<html>`), and set
  the app root `aria-hidden="true"` / `inert` so SR users don't reach behind.

**Reduced-motion.** Disable the scale/spring on open+close (backdrop + stage
just fade, or appear instantly). The video itself is user-initiated, so it plays
normally — reduced-motion governs the *UI transition*, not the content.

**Dark + light.** Backdrop `--video-backdrop` re-declares per theme (dark near-
black, light a dark warm dim). The frame is pure black in both (it holds video).
Close/caption chrome is white-on-scrim in both. Verified: white close glyph on
the dark backdrop clears AA in both themes.

**Admin.** The lightbox is a shared runtime component; no per-instance admin. It
reads the clip record passed by whichever card opened it (§F).

---

### 2.e — "Latest on X / TikTok" social strip (`gc-social`)

**Purpose.** The **only** place raw embeds live (Research B/C). Clearly labelled
as social, visually **corralled** so the platform's mandatory branded chrome
(handles, logos, "Discover more on TikTok") reads as an intentional "social
feed," never as our polished highlights.

**Structure:**
```
section.gc-social.alt.reveal        (uses .alt surface to visually separate it)
  .gc-eyebrow                        "From the Timeline"
  h2.gc-h2                           "Latest on <span class="gold">X / TikTok.</span>"
  p.gc-social-note                   (one --sub line: "Live posts from @Ghanacomps —
                                      served by X and TikTok.")
  .gc-social-strip                   (horizontal scroll rail of embed frames)
      .gc-social-cell × N            (one corral per embed)
        .gc-social-badge             ("X" / "TikTok" platform label, top-left)
        [ the raw blockquote/iframe ]
```

**Corralling rules (the whole point):**
- Each embed sits in a `.gc-social-cell`: a `--raised` card, `1px solid
  var(--line)`, `--radius-lg`, `--elev-1`, fixed max-width (`320px` for X,
  `325px` portrait for TikTok — their native widths), `overflow:hidden`. The
  card frame + our badge unify the mismatched platform skins into one row.
- A **`.gc-social-badge`** (our micro gold/`--sub` platform tag, top-left of the
  cell) tells the user "this is an X/TikTok post" before their brand chrome does
  — so their logos read as attribution, not as our design.
- **Never mix** these into the highlights grid. Different section, `.alt`
  background, its own header. Physical separation is the corral.
- **Lazy-mount the embed scripts** (`widgets.js` / `embed.js`) only when the
  strip scrolls into view (IntersectionObserver) — one script load, injected
  once, not per card, to contain the third-party cost (Research B).
- We do NOT (and technically cannot) restyle inside the cross-origin iframe;
  our control ends at the cell frame. That's accepted here and nowhere else.

```css
.gc-social-strip {
  display: flex; gap: var(--space-2xl); overflow-x: auto;
  scroll-snap-type: x proximity; padding-bottom: var(--space-md);
  margin-top: var(--space-8xl);
  -webkit-overflow-scrolling: touch; scrollbar-width: none;
}
.gc-social-cell {
  flex: 0 0 auto; width: 320px; scroll-snap-align: start;
  position: relative; background: var(--raised); border: 1px solid var(--line);
  border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--elev-1);
}
.gc-social-cell.tiktok { width: 325px; }
.gc-social-badge {
  position: absolute; z-index: 2; top: var(--space-sm); left: var(--space-sm);
  padding: var(--space-3xs) var(--space-sm); font-size: var(--fs-micro);
  letter-spacing: var(--ls-3); text-transform: uppercase; font-weight: var(--fw-semibold);
  color: var(--gold); background: rgb(var(--gold-rgb) / .12); border-radius: var(--radius-sm);
  -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px);
}
.gc-social-note { font-size: var(--fs-sm); color: var(--sub); margin-top: var(--space-md);
                  font-style: italic; font-family: var(--font-a); }
```

**States.** *loading:* cell shows a `--surface` box at a min-height (`420px`)
until the embed injects → no reflow jump. *empty/offline:* if a script fails,
the cell shows a `--sub` "View on X ↗" link-out (graceful, still useful). *error:*
same link-out fallback.

**a11y.** The section has a heading and the `.gc-social-note` states the source.
Embeds bring their own (imperfect) a11y; we don't override it. The strip is
keyboard-scrollable.

**Contained-in-lightbox fallback (Research C, Placement 2).** For a clip we
cannot self-host/clear, a `gc-vcard` may open the lightbox with the **embed
inside `.gc-lightbox-frame`** instead of a `<video>`. Accept that it won't
autoplay/mute and shows platform chrome — but it's contained in our immersive
shell, not scattered. This is the fallback path, not the default.

---

### 2.f — Placeholder / swappable-asset model

**Directory & naming convention (`public/assets/video/`):**
```
public/assets/video/
  hero/
    home-hero.poster.jpg      home-hero.mp4      home-hero.webm      home-hero-mobile.mp4
    blackstars-hero.poster.jpg  blackstars-hero.mp4  …
  highlights/
    {slug}.poster.jpg   {slug}.mp4   {slug}.webm   [{slug}.en.vtt]
  clips/                                  (player/legend card clips)
    {player-slug}.poster.jpg   {player-slug}.mp4   {player-slug}.webm   [{player-slug}.en.vtt]
```
**Rules:**
- **Poster is mandatory** for every clip (image-first LCP, reduced-motion end
  state, error fallback). No poster → no card renders (fail safe, not broken).
- Naming is **paired by base slug**: `{slug}.poster.jpg` + `{slug}.mp4`
  (+ optional `.webm`, `.en.vtt`). The component takes only the base path and
  derives the rest, so **swapping a real MP4 = drop the file at the same path;
  zero code change.**
- **Placeholder scaffold now:** ship a set of `placeholder-*.poster.jpg` (tasteful
  gradient/block posters — see the proof) and a tiny looping `placeholder.mp4`.
  The clip records point at these until the client swaps real files in.
- **Aspect metadata:** each clip record carries `ratio: "16x9" | "9x16" | "4x5"`
  so the card/lightbox lock the correct `aspect-ratio` before any file loads.

**The clip record shape (localStorage, admin-editable — mirrors `gc_archive`):**
```ts
interface Clip {
  slug: string;          // base path key → /assets/video/highlights/{slug}
  title: string;         // .editable
  tag?: string;          // "HIGHLIGHT" / league label
  ratio: '16x9'|'9x16'|'4x5';
  duration?: string;     // "1:24" chip
  poster: string;        // path (defaults to {base}.poster.jpg)
  mp4: string;           // path (defaults to {base}.mp4)
  webm?: string;
  captions?: string;     // .vtt path
  originalUrl?: string;  // "View original on X/TikTok" attribution link
  source?: 'self' | 'embed';  // 'embed' → open lightbox with embed fallback (§2.e)
}
```
Stored under `gc_highlights` (Home/BS) and folded into the existing
`gc_archive` / player records for card clips. Under `body.edit`, the same
add/edit/remove affordances that manage archive/performers manage clips — so
video sources are admin-editable exactly like today's content.

---

## 3. Per-page placement map

Content is frozen; existing section copy is untouched. New sections use only the
minimal labels defined here.

### `/` Home (`Home.tsx`)
1. **Hero (`.gc-hero.gc-chevrons.loud`, line 54):** add **`gc-hvideo`** ambient
   layer behind `.gc-hero-glow`, in front of the surface. Chevrons raise to
   z-index 1 over the scrim; the `.gc-feed` frosted panel now frosts the video.
   Reduced-motion / ≤480px / save-data → poster only.
2. **New `gc-highlights` section** placed **after the "Our Work So Far" proof
   section** (currently the last content section, ~line 214) and before the
   footer — so the page climaxes on real motion. `gc-eyebrow` "Highlights" +
   `gc-h2` "The Best of the **Weekend.**" + grid of `gc-vcard.lg.r16x9`.
3. **New `gc-social` strip** immediately after highlights (`.alt` surface),
   "Latest on **X / TikTok.**" — the corralled embeds. Last content band.

### `/blackstars` (`BlackStars.tsx`)
- **Option (recommended): highlights, not a second hero loop.** Add a
  **`gc-highlights`** section after "Latest Update" (line 68) / before "Next
  Fixtures" — "Matchday **Highlights.**" using `gc-vcard.lg` clips. This gives
  Black Stars real motion without a competing hero loop.
- **Optional hero loop:** the `gc-pagehead.gc-chevrons.loud` (line 57) *may*
  take a `gc-hvideo` layer for full broadcast weight. If used, apply the exact
  hero scrim + reduced-motion rules. **One of the two, not both loud at once** —
  default to the highlights section; enable the pagehead loop only if the client
  wants Black Stars as loud as Home.
- The **Player Archive** cards (line 117, `.archive-card`) each already carry a
  "Watch" link → upgrade to a `gc-vcard.sm` clip where a self-hosted MP4 exists;
  otherwise keep the link-out (embed fallback in lightbox).

### `/players` (`Players.tsx`)
- **Weekend Performers** cards (line 177, `.performer-card`) → attach a
  **`gc-vcard.sm.r9x16`** clip (phone-shot vertical is the natural comp format).
  The card clip poster + play glyph sits above the existing caption; tap → lightbox.
- The **Full Squad ledger** rows (line 216) stay text-dense (no video — keep the
  scannable index). Video belongs on the hype performer cards, not the directory.

### `/legends` (`Legends.tsx`)
- **Reverence plate (Essien, line 92, `.gc-marquee-legend`):** add ONE
  **`gc-vcard.sm.r4x5`** legend clip inside the plate (a classic-goal reel),
  placed after the bio / before the comp links — a single moment of moving
  footage inside the gallery frame. Keep the reverence register: no autoplay,
  poster + glyph, tap → lightbox.
- **`gc-legger` index rows** and **Cult Heroes** stay text (the comp-row links
  already deep-link out). Optional: a legend row's `comp-row-link` whose target
  is self-hosted opens the lightbox instead of leaving the site.

### Social strip location
- Primary: **Home**, after highlights (§Home 3).
- Do **not** repeat the social strip on every page (avoids third-party weight +
  visual noise). Black Stars may host a second instance only if the client wants
  live match-reaction posts; default is Home-only.

---

## 4. Proposed `gc-` class names (FE owns the CSS)

**Ambient hero:** `gc-hvideo`, `gc-hvideo-poster`, `gc-hvideo-el`,
`gc-hvideo-scrim` (+ state `.is-playing`).

**Video card:** `gc-vcard` (+ size `.sm`/`.lg`, ratio `.r16x9`/`.r9x16`/`.r4x5`),
`gc-vcard-media`, `gc-vcard-poster`, `gc-vcard-scrim`, `gc-vcard-glyph`,
`gc-vcard-dur`, `gc-vcard-cap`, `gc-vcard-tag`, `gc-vcard-title`.

**Highlights section:** `gc-highlights`, `gc-highlights-grid`. (Header reuses the
existing `gc-eyebrow` + `gc-h2`.)

**Lightbox:** `gc-lightbox` (+ `.is-open`/`.is-closing`/`.is-ready`, ratio
`.r9x16`), `gc-lightbox-backdrop`, `gc-lightbox-stage`, `gc-lightbox-frame`,
`gc-lightbox-poster`, `gc-lightbox-el`, `gc-lightbox-close`, `gc-lightbox-caption`.

**Social strip:** `gc-social`, `gc-social-strip`, `gc-social-cell` (+ `.tiktok`),
`gc-social-badge`, `gc-social-note`.

---

## 5. Admin / edit-mode behavior (consolidated)

- Video sources are **content**, so they follow the existing admin model. Clip
  records live in localStorage (`gc_highlights`, plus folded into `gc_archive`
  and performer/legend records) exactly like `gc_news`/`gc_archive` today.
- Under `body.edit`: each `gc-vcard` shows the standard `.card-actions`
  edit/remove pair at its end; each video section shows an `.add-*-btn`
  dashed-gold "Add clip" affordance and an inline add-panel (mirrors
  `.news-admin-row` / the archive add-panel) with fields for title, tag, ratio,
  poster path, mp4 path, captions path, original-URL, and a `self|embed` toggle.
- The **hero video** gets a `gc_hero_video` record with a "Set hero video" panel
  under edit (poster/mp4/webm). Titles/tags stay `.editable[data-eid]` where they
  are text.
- No admin control is ever visible outside `body.edit`; the lightbox is a shared
  runtime component with no per-instance admin.

---

## 6. Accessibility + performance requirements (consolidated)

**Accessibility (Research A8):**
- Ambient hero video: `aria-hidden`, `tabindex="-1"`, not focusable, no captions
  (muted, no meaning).
- Every play affordance is a real focusable `<button>`/`<a>` with an
  `aria-label`; glyph SVGs are `aria-hidden`.
- Lightbox: `role="dialog"`, `aria-modal="true"`, labelled by clip title; focus
  moves in on open and returns to the trigger on close; **focus trap**; **Esc**
  closes; backdrop click closes; body scroll-locked; app root `inert`/
  `aria-hidden` while open.
- **Captions:** any immersive clip with speech/meaning ships a WebVTT `<track …
  default>`; native controls expose the CC toggle. Ambient/silent loops need none.
- **Color is never the only signal** — league/era tags on cards always carry text.
- **Hit targets ≥ 44px** — card glyph (44/56px), close button (44px).
- **Contrast:** white text/glyphs sit on the `--video-scrim-*` / `--video-glyph-bg`
  scrims, guaranteed AA over arbitrary frames by the black-alpha ramp; card
  titles are `--white` on `--raised` (AA). Verify hero-panel case (§7 risk 1).
- **`prefers-reduced-motion`:** hero → static poster, no autoplay, no observer;
  cards → no lift/scale (instant border feedback only); lightbox → open/close
  fade only (no spring). Reuse the existing card-family reduced-motion block by
  adding the new classes.

**Performance (Research A9):**
- **Poster-first:** LCP is always an image; `<video>` in cards is **not mounted**
  until the lightbox opens.
- **Lazy:** posters `loading="lazy"` + `decoding="async"`; below-the-fold clips
  `preload="none"`. Only the hero may `preload="metadata"` (default `none`).
- **Muted + playsinline** on every ambient/autoplay video (mobile inline
  requirement); always handle the `play()` promise rejection.
- **Aspect-locked** containers (`aspect-ratio`) everywhere → zero CLS.
- **File budget:** hero ≤ ~4MB desktop / ≤ ~2MB mobile; highlight/clip ≤ ~2–3MB;
  H.264 + WebM/AV1, CRF ~23–28. Serve `*-mobile.mp4`; on ≤480px / `save-data`
  skip the hero video (poster only).
- **Third-party embeds:** scripts lazy-mounted on scroll, injected once, only in
  the corralled `gc-social` strip — never in the hero or the highlights grid.

---

## 7. Risks & tradeoffs (flagged for review)

1. **Hero-video legibility scrim — the #1 risk.** The Playfair hero title
   (`--white`, `--fs-d1`) must clear WCAG AA over *any* video frame, including a
   bright one. Mitigation: the left-weighted `--video-scrim-hero` puts ≥ .58–.72
   black under the entire text column, dropping to .08 over the video's right —
   so the title's local background is effectively `#0a0a0a`-equivalent and
   `#ede8df` on it is > 12:1. **Verify against the brightest expected frame**
   (e.g. a stadium floodlight pan) in both themes, and confirm the scrim doesn't
   over-darken the video into mud. If a specific clip is too bright, raise the
   left stop to .78 for that clip — still on the black-alpha ramp, no new token.
   *Second-order:* the `.gc-feed` glass panel now frosts live video — re-run the
   POLISH §8 risk-1 check (white feed titles over the worst frame *behind glass*);
   the neutral `--glass-bg` tint should still mute it, but a bright frame is a
   harder case than a static gold band.

2. **Corralling the embed strip.** X/TikTok chrome is un-styleable
   cross-origin. If the `gc-social-cell` frame + badge don't sufficiently
   "own" the row, the branded skins can still read as inconsistent. Mitigation:
   physical separation (own `.alt` section + header + note), a fixed cell width
   matching each platform's native size, our badge asserting context first, and
   `overflow:hidden` on the cell. Accept that inside-iframe styling is impossible
   — this is the one place we tolerate foreign chrome, by design. Watch the
   third-party script weight (lazy-mount once).

3. **Hero video as LCP.** Even poster-first, a large hero region risks LCP
   regression if the poster is heavy. Keep the poster a compressed JP/AVIF
   ≤ ~150KB; the MP4 loads after. Test Core Web Vitals with the video enabled;
   fall back to poster-only on ≤480px/save-data.

4. **Two loud loops.** If both Home hero and Black Stars hero run ambient video,
   the site can feel over-motioned. Default: Home hero loop + Black Stars
   *highlights* (not a second hero loop). Enable the BS hero loop only on
   explicit client request.

5. **Rights.** Self-hosting requires cleared footage (Research C). The
   `source: 'self' | 'embed'` flag lets un-cleared clips fall back to the
   contained-in-lightbox embed automatically — design supports both; the client
   decides per clip. Always keep `originalUrl` attribution.

6. **Vertical (9:16) in the lightbox.** A phone clip must not tower. Handled by
   capping `.gc-lightbox-stage` width to 420px on `.r9x16` and letterboxing on
   pure black — verify on short laptop viewports it still fits with the caption.

---

## 8. Handoff to Frontend

**Files to touch (source — after sign-off; do NOT touch as part of this spec):**
- `src/style.css` — add the four `--video-*` additive tokens to `:root` **and**
  both light blocks (§1); author the `gc-hvideo`, `gc-vcard`, `gc-highlights`,
  `gc-lightbox`, `gc-social` rules (§2) outside `@layer` like the rest of the
  revamp classes; add the new video classes to the existing card-family
  **reduced-motion** block.
- `src/pages/Home.tsx` — mount `gc-hvideo` in the hero; add the `gc-highlights`
  and `gc-social` sections (§3).
- `src/pages/BlackStars.tsx` — add `gc-highlights` (default) / optional hero loop
  (§3); upgrade archive cards to `gc-vcard.sm` where self-hosted.
- `src/pages/Players.tsx` — attach `gc-vcard.sm.r9x16` to performer cards.
- `src/pages/Legends.tsx` — one `gc-vcard.sm.r4x5` in the Essien plate.
- **New shared component:** a `<VideoLightbox>` React component (portal to body,
  focus trap, scroll-lock, Esc/backdrop close) + a `<VideoCard>` wrapper that
  opens it. New: a tiny `useVideoAutoplay` hook (IntersectionObserver +
  `play()`-promise handling + reduced-motion + save-data guard) for `gc-hvideo`.
- `public/assets/video/` — the placeholder posters + `placeholder.mp4` (§2.f).

**Reusable pieces to lean on (don't reinvent):**
- The **card-family lift + reduced-motion** block in `style.css` (~L814–862) —
  add `gc-vcard` to both selector lists so it inherits the exact spring lift and
  the reduced-motion freeze.
- `--glass-*` / `--elev-*` / `--ease-*` / `--dur-*` — the lightbox backdrop,
  glyph disc, and all motion ride these; no new motion/material tokens.
- `gc-eyebrow` + `gc-h2` — the highlights & social section headers reuse them
  verbatim.
- The `.post-placeholder`, `.archive-card` add/remove, `.news-admin-row` idioms —
  the empty states and admin affordances copy these patterns exactly.
- The nav's `backdrop-filter` **containing-block discipline** — the lightbox is a
  body-level portal (a fixed-position sibling of the app), NOT nested in any
  blurred ancestor, mirroring why the mobile menu is a sibling of `<nav>`.

**The three details I will personally check on review:**
1. **Hero title AA over the brightest video frame, both themes** — including the
   `--white` feed-panel titles now sitting over live footage behind glass (§7.1).
2. **Poster-first with zero CLS and zero black flash** — every `gc-vcard-media`
   and `gc-lightbox-frame` locks `aspect-ratio` before load; the hero cross-fades
   poster→video, never cuts to black; `<video>` is not mounted in cards.
3. **The embed corral holds** — X/TikTok chrome stays inside `gc-social-cell`
   with our badge asserting context, physically separated from the highlights
   grid, scripts lazy-mounted once. And the four `--video-*` tokens appear in
   **both** light selectors (the POLISH §risk-5 gotcha).
