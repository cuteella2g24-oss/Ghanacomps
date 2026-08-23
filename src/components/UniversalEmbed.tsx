import { useEffect, useRef } from 'react';
import { resolveEmbed } from '../lib/videoEmbed';
import TweetEmbed from './TweetEmbed';

/**
 * UniversalEmbed — plays ANY common video source INLINE so viewers never get
 * bounced to a platform login. It resolves the URL (src/lib/videoEmbed.ts) and
 * renders the right inline player:
 *   youtube/vimeo → responsive 16:9 iframe (nocookie/player hosts)
 *   twitter       → the existing TweetEmbed (no X logic duplicated here)
 *   tiktok        → tiktok-embed blockquote + lazy embed.js
 *   instagram     → instagram-media blockquote + lazy embed.js
 *   file          → native <video controls>
 *   unknown       → graceful "Watch on source ↗" link-out (today's behaviour)
 *
 * Platform scripts are lazy-loaded ONCE and cached on window, mirroring
 * TweetEmbed's loader (load-once, guarded, listeners cleaned up on unmount).
 */

interface TikTokEmbed {
  lib?: { render?: (el?: HTMLElement) => void };
}
interface InstagramEmbeds {
  Embeds?: { process?: () => void };
}
declare global {
  interface Window {
    tiktokEmbed?: TikTokEmbed;
    instgrm?: InstagramEmbeds;
  }
}

const TIKTOK_SRC = 'https://www.tiktok.com/embed.js';
const INSTAGRAM_SRC = 'https://www.instagram.com/embed.js';

/**
 * Inject a platform script once (keyed by src) and resolve when it has loaded.
 * The <script> is a shared singleton; only this component's `load`/`error`
 * listeners are attached/removed so nothing leaks.
 */
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    let s = document.querySelector<HTMLScriptElement>(`script[data-gc-embed="${src}"]`);
    if (s?.dataset.loaded === 'true') { resolve(); return; }
    if (!s) {
      s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.setAttribute('data-gc-embed', src);
      document.body.appendChild(s);
    }
    const onLoad = () => { s!.dataset.loaded = 'true'; cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error(`${src} load error`)); };
    const cleanup = () => {
      s!.removeEventListener('load', onLoad);
      s!.removeEventListener('error', onError);
    };
    s.addEventListener('load', onLoad);
    s.addEventListener('error', onError);
  });
}

interface Props {
  url: string;
  caption?: string;
}

export default function UniversalEmbed({ url, caption }: Props) {
  const info = resolveEmbed(url);

  // ---- Script-embedded platforms (TikTok / Instagram) --------------------
  const scriptRef = useRef<HTMLDivElement>(null);
  const needsScript = info.kind === 'tiktok' || info.kind === 'instagram';

  useEffect(() => {
    if (!needsScript) return;
    let cancelled = false;
    const src = info.kind === 'tiktok' ? TIKTOK_SRC : INSTAGRAM_SRC;
    loadScript(src)
      .then(() => {
        if (cancelled) return;
        // Ask the freshly-loaded lib to (re)scan our blockquote. On the very
        // first injection the script auto-scans; on later mounts we nudge it.
        if (info.kind === 'tiktok') window.tiktokEmbed?.lib?.render?.(scriptRef.current ?? undefined);
        else window.instgrm?.Embeds?.process?.();
      })
      .catch(() => { /* fallback link stays visible inside the blockquote */ });
    return () => { cancelled = true; };
  }, [needsScript, info.kind, info.id]);

  switch (info.kind) {
    case 'youtube':
    case 'vimeo':
      return (
        <div className="gc-embed-frame">
          <iframe
            src={info.iframeSrc}
            title={caption || (info.kind === 'youtube' ? 'YouTube video' : 'Vimeo video')}
            loading="lazy"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      );

    case 'twitter':
      return <TweetEmbed url={info.originalUrl} />;

    case 'tiktok':
      return (
        <div ref={scriptRef} className="gc-embed-script">
          <blockquote className="tiktok-embed" cite={info.originalUrl} data-video-id={info.id}>
            <a href={info.originalUrl} target="_blank" rel="noopener">
              {caption || 'Watch on TikTok ↗'}
            </a>
          </blockquote>
        </div>
      );

    case 'instagram':
      return (
        <div ref={scriptRef} className="gc-embed-script">
          <blockquote
            className="instagram-media"
            data-instgrm-permalink={info.originalUrl}
            data-instgrm-version="14"
          >
            <a href={info.originalUrl} target="_blank" rel="noopener">
              {caption || 'Watch on Instagram ↗'}
            </a>
          </blockquote>
        </div>
      );

    case 'file':
      return (
        <video className="gc-embed-video" controls playsInline preload="metadata">
          <source src={info.originalUrl} />
        </video>
      );

    default:
      return info.originalUrl ? (
        <a className="tweet-embed-link" href={info.originalUrl} target="_blank" rel="noopener">
          ▶ Watch on source ↗
        </a>
      ) : null;
  }
}
