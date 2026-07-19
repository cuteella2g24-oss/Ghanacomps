/**
 * Video clip model + default (placeholder) seed data for the GhanaComps video
 * system. See docs/VIDEO_DESIGN_SPEC.md §2.f.
 *
 * A Clip is CONTENT — it lives in localStorage (gc_highlights, folded into
 * archive/performer/legend records) and is admin-editable exactly like gc_news
 * / gc_archive. The component takes one base path and derives every asset file
 * from it, so swapping a placeholder for real footage = dropping the file at the
 * same path, with ZERO code change.
 */

export type ClipRatio = '16x9' | '9x16' | '4x5';

export interface Clip {
  /** Base path key under /assets/video, e.g. "highlights/kudus-masterclass".
   *  poster/mp4/webm/captions default to `${base}.poster.jpg` etc. */
  slug: string;
  title: string;
  /** Eyebrow tag: "Premier League" / "Highlight" / league label. */
  tag?: string;
  ratio: ClipRatio;
  /** "1:24" duration chip (decorative). */
  duration?: string;
  /** Explicit paths override the slug-derived defaults (admin can point anywhere). */
  poster?: string;
  mp4?: string;
  webm?: string;
  captions?: string;
  /** Attribution link — "View original on X / TikTok". */
  originalUrl?: string;
  /** 'self' = self-hosted <video> (default); 'embed' = open lightbox with the
   *  contained platform-embed fallback (§2.e). */
  source?: 'self' | 'embed';
}

/** Resolved, concrete asset paths for a clip (slug-derived unless overridden). */
export interface ResolvedClip extends Clip {
  posterSrc: string;
  mp4Src: string;
  webmSrc: string | undefined;
  captionsSrc: string | undefined;
}

const BASE = '/assets/video';

/** Derive concrete asset paths from a clip's base slug (or explicit overrides). */
export function resolveClip(clip: Clip): ResolvedClip {
  const base = `${BASE}/${clip.slug}`;
  return {
    ...clip,
    posterSrc: clip.poster ?? `${base}.poster.jpg`,
    mp4Src: clip.mp4 ?? `${base}.mp4`,
    webmSrc: clip.webm ?? `${base}.webm`,
    captionsSrc: clip.captions,
  };
}

/** Hero ambient-video record (admin-editable later via gc_hero_video). */
export interface HeroVideo {
  poster: string;
  mp4: string;
  webm?: string;
  /** Optional narrower encode served to small screens. */
  mp4Mobile?: string;
  posterMobile?: string;
}

export const HOME_HERO_VIDEO: HeroVideo = {
  poster: `${BASE}/hero/home-hero.poster.jpg`,
  mp4: `${BASE}/hero/home-hero.mp4`,
  webm: `${BASE}/hero/home-hero.webm`,
  mp4Mobile: `${BASE}/hero/home-hero-mobile.mp4`,
  posterMobile: `${BASE}/hero/home-hero-mobile.poster.jpg`,
};

/** Default Home highlights grid (placeholder clips — swap real files per README). */
export const DEFAULT_HOME_HIGHLIGHTS: Clip[] = [
  { slug: 'highlights/kudus-masterclass', title: "Kudus' Weekend Masterclass", tag: 'Premier League', ratio: '16x9', duration: '1:24', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'highlights/semenyo-cameo',     title: 'Semenyo Off the Bench',      tag: 'Premier League', ratio: '16x9', duration: '0:48', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'highlights/the-save',          title: 'The Save That Saved a Point', tag: 'La Liga',       ratio: '16x9', duration: '2:10', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'highlights/debut-to-remember', title: 'A Debut to Remember',        tag: 'Serie A',        ratio: '16x9', duration: '1:02', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'highlights/two-assists',       title: 'Two Assists, No Fuss',       tag: 'Bundesliga',     ratio: '16x9', duration: '0:36', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'highlights/nobody-talked',     title: 'The One Nobody Talked About', tag: 'Championship',  ratio: '16x9', duration: '1:55', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
];

/** Default Black Stars matchday highlights (placeholder clips). */
export const DEFAULT_BS_HIGHLIGHTS: Clip[] = [
  { slug: 'highlights/bs-goal-of-the-night', title: 'Goal of the Night', tag: 'Black Stars', ratio: '16x9', duration: '0:42', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'highlights/bs-keeper-heroics',    title: 'Keeper Heroics',    tag: 'Black Stars', ratio: '16x9', duration: '1:08', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'highlights/bs-late-winner',       title: 'The Late Winner',   tag: 'Black Stars', ratio: '16x9', duration: '0:55', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
];

/** Essien reverence-plate legend clip (Legends page, §3). */
export const ESSIEN_CLIP: Clip = {
  slug: 'clips/essien-volley',
  title: 'The Volley vs Arsenal · 2006',
  ratio: '4x5',
  duration: '0:52',
  originalUrl: 'https://x.com/Ghanacomps',
  source: 'self',
};

/** Default Weekend Performer vertical clips (Players page, §3). */
export const DEFAULT_PERFORMER_CLIPS: Clip[] = [
  { slug: 'clips/kudus-vertical',   title: 'Kudus vs Man City — Matchday',   tag: 'Weekend Performer', ratio: '9x16', duration: '0:44', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
  { slug: 'clips/semenyo-vertical', title: "Semenyo's Cameo — off the bench", tag: 'Weekend Performer', ratio: '9x16', duration: '0:31', originalUrl: 'https://x.com/Ghanacomps', source: 'self' },
];
