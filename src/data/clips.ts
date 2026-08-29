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

/** Default Home highlights grid — empty until the admin adds real clips, so the
 *  whole Highlights section stays hidden on the public site until then. */
export const DEFAULT_HOME_HIGHLIGHTS: Clip[] = [];

/** Default Black Stars matchday highlights — empty until the admin adds real
 *  clips, so the matchday highlights grid stays hidden on the public site. */
export const DEFAULT_BS_HIGHLIGHTS: Clip[] = [];
