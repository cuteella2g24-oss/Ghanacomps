# GhanaComps — Video assets

Self-hosted video for the GhanaComps site. **The files here are PLACEHOLDERS**
(branded Ghana-flag-tinted gradient posters + short muted looping clips) so the
UI works end-to-end today. The client swaps in real footage later with **zero
code change** — just drop a real file at the same path.

## Directory & naming convention

```
public/assets/video/
  hero/        home-hero.poster.jpg   home-hero.mp4   home-hero.webm   home-hero-mobile.{poster.jpg,mp4,webm}
               blackstars-hero.poster.jpg  (+ .mp4 / .webm when a Black Stars hero loop is wanted)
  highlights/  {slug}.poster.jpg   {slug}.mp4   {slug}.webm   [{slug}.en.vtt]
  clips/       {slug}.poster.jpg   {slug}.mp4   {slug}.webm   [{slug}.en.vtt]   (player / legend card clips)
```

**Rules (from `docs/VIDEO_DESIGN_SPEC.md` §2.f):**

- **Poster is mandatory.** Every clip needs `{slug}.poster.jpg` — it is the
  image-first LCP frame, the reduced-motion end state, and the missing-video
  fallback. No poster → the card will not render.
- **Paired by base slug.** The code takes one base path
  (`/assets/video/highlights/kudus-masterclass`) and derives `.poster.jpg`,
  `.mp4`, `.webm`, and `.en.vtt` from it. To swap a placeholder for real
  footage, replace the file(s) at the same path — no code edit needed.
- **`.webm` and `.en.vtt` are optional.** WebM is a smaller-file `<source>`
  offered before the MP4; the `.en.vtt` caption track is wired automatically
  when present (needed for any clip with speech/meaning).
- **Mobile hero.** `home-hero-mobile.mp4` is served to narrow screens; on
  `save-data` or very small screens the hero shows the poster only.

## Recommended encodes for real files

- **Poster:** JPG/AVIF, ≤ ~150KB (hero), matching the clip's aspect ratio.
- **Hero loop:** H.264 (`yuv420p`) + WebM/AV1, muted, ≤ ~4MB desktop / ≤ ~2MB
  mobile, CRF ~23–28, seamless loop.
- **Highlight / card clip:** ≤ ~2–3MB, same codecs; ship an `.en.vtt` if the
  clip has commentary.

## Regenerating the placeholders

`ffmpeg` only (this build has no freetype, so posters carry no baked text —
placeholder status is surfaced in admin edit-mode and here). See
`scratchpad/gen-assets.sh` for the exact commands used.
