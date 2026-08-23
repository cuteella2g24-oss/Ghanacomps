/**
 * videoEmbed — a pure, defensive resolver that turns any common video URL into
 * the minimal info UniversalEmbed needs to play it INLINE on the site (never a
 * redirect to a platform login). Supports YouTube, Vimeo, TikTok, Instagram,
 * X/Twitter, and direct media files; anything else falls back to a link-out.
 *
 * Every code path is wrapped so a malformed/empty URL degrades to
 * {kind:'unknown'} instead of throwing — callers can render it safely.
 */

export type EmbedKind =
  | 'youtube'
  | 'vimeo'
  | 'tiktok'
  | 'instagram'
  | 'twitter'
  | 'file'
  | 'unknown';

export interface EmbedInfo {
  kind: EmbedKind;
  originalUrl: string;
  /** Ready-to-use iframe src for youtube/vimeo (privacy-friendly hosts). */
  iframeSrc?: string;
  /** The platform id/code (video id, tweet id, post code…) when known. */
  id?: string;
}

/** Strip a leading "www." so host checks stay simple. */
function bareHost(host: string): string {
  return host.replace(/^www\./, '').toLowerCase();
}

const FILE_RE = /\.(mp4|webm|mov|m4v)$/i;

/**
 * Parse a video URL into an EmbedInfo. Never throws — any failure or empty
 * input resolves to {kind:'unknown', originalUrl:url}.
 *
 * Supported forms:
 *  - YouTube:   youtube.com/watch?v=ID · youtu.be/ID · youtube.com/shorts/ID · youtube.com/embed/ID
 *  - Vimeo:     vimeo.com/ID · player.vimeo.com/video/ID
 *  - TikTok:    tiktok.com/@user/video/ID (script embed, no iframeSrc)
 *  - Instagram: instagram.com/(p|reel|tv)/CODE (script embed)
 *  - X/Twitter: x.com|twitter.com/.../status/ID (reuses TweetEmbed)
 *  - File:      any path ending .mp4/.webm/.mov/.m4v (query ignored)
 */
export function resolveEmbed(url: string): EmbedInfo {
  const originalUrl = (url ?? '').trim();
  if (!originalUrl) return { kind: 'unknown', originalUrl: originalUrl };

  try {
    const u = new URL(originalUrl);
    const host = bareHost(u.hostname);
    const path = u.pathname;

    // YouTube --------------------------------------------------------------
    if (host === 'youtu.be') {
      const id = path.split('/').filter(Boolean)[0];
      if (id) return youtube(id, originalUrl);
    }
    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
      const v = u.searchParams.get('v');
      if (v) return youtube(v, originalUrl);
      const seg = path.split('/').filter(Boolean);
      // /shorts/ID · /embed/ID · /v/ID
      if ((seg[0] === 'shorts' || seg[0] === 'embed' || seg[0] === 'v') && seg[1]) {
        return youtube(seg[1], originalUrl);
      }
    }

    // Vimeo ----------------------------------------------------------------
    if (host === 'vimeo.com' || host === 'player.vimeo.com') {
      const seg = path.split('/').filter(Boolean);
      // player.vimeo.com/video/ID  or  vimeo.com/ID
      const id = seg[0] === 'video' ? seg[1] : seg[0];
      if (id && /^\d+$/.test(id)) {
        return { kind: 'vimeo', originalUrl, id, iframeSrc: `https://player.vimeo.com/video/${id}` };
      }
    }

    // TikTok ---------------------------------------------------------------
    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
      const m = path.match(/\/video\/(\d+)/);
      if (m) return { kind: 'tiktok', originalUrl, id: m[1] };
    }

    // Instagram ------------------------------------------------------------
    if (host === 'instagram.com' || host.endsWith('.instagram.com')) {
      const m = path.match(/\/(?:p|reel|tv)\/([\w-]+)/);
      if (m) return { kind: 'instagram', originalUrl, id: m[1] };
    }

    // X / Twitter ----------------------------------------------------------
    if (host === 'x.com' || host === 'twitter.com' || host.endsWith('.twitter.com') || host.endsWith('.x.com')) {
      const m = path.match(/status(?:es)?\/(\d+)/);
      if (m) return { kind: 'twitter', originalUrl, id: m[1] };
    }

    // Direct media file (query ignored) ------------------------------------
    if (FILE_RE.test(path)) {
      return { kind: 'file', originalUrl };
    }

    return { kind: 'unknown', originalUrl };
  } catch {
    return { kind: 'unknown', originalUrl };
  }
}

/** Build a privacy-friendly (youtube-nocookie) YouTube EmbedInfo. YouTube ids are
 * always [A-Za-z0-9_-]; reject anything else so a malformed link falls through to
 * the link-out fallback rather than yielding a junk id (defense-in-depth). */
function youtube(id: string, originalUrl: string): EmbedInfo {
  if (!/^[\w-]+$/.test(id)) return { kind: 'unknown', originalUrl };
  return { kind: 'youtube', originalUrl, id, iframeSrc: `https://www.youtube-nocookie.com/embed/${id}` };
}
