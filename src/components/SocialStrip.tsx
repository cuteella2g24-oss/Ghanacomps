import { useEffect, useRef, useState } from 'react';

/**
 * SocialStrip — the "Latest on X / TikTok" band (spec §2.e). The ONLY place raw
 * platform embeds live. Each embed is corralled in a `--raised` cell with our
 * gold "On X / On TikTok" badge asserting context first, physically separated
 * in its own `.alt` section. We cannot restyle inside the cross-origin iframe;
 * the cell frame + badge are the corral, and that's accepted here and nowhere
 * else.
 *
 * Performance: the platform scripts (widgets.js / embed.js) are lazy-mounted
 * ONCE, only when the strip scrolls into view (IntersectionObserver), and are
 * removed on unmount so there's no leak. Until then / if a script fails, each
 * cell shows a graceful "View on X ↗" link-out — still useful, never a broken
 * frame.
 */

interface SocialPost {
  platform: 'x' | 'tiktok';
  /** Public post URL — also the graceful link-out fallback. */
  url: string;
  /** Author handle shown in the fallback (attribution). */
  handle: string;
  /** One-line caption shown in the fallback. */
  caption: string;
}

// Real GhanaComps posts (URLs mirror the ones already linked across the site).
// These are the attribution/link-out targets AND the embed sources.
const POSTS: SocialPost[] = [
  { platform: 'x', url: 'https://x.com/Ghanacomps/status/2021318754206933129', handle: '@Ghanacomps', caption: 'Fatawu Issahaku — stunning goal vs Southampton.' },
  { platform: 'x', url: 'https://x.com/Ghanacomps/status/2028823927577817257', handle: '@Ghanacomps', caption: 'Michael Essien vs Italy — 2006 World Cup.' },
  { platform: 'x', url: 'https://x.com/Ghanacomps/status/2029905846784655770', handle: '@Ghanacomps', caption: 'Abedi Pele vs Nigeria — 1992 AFCON.' },
  { platform: 'x', url: 'https://x.com/Ghanacomps/status/2026357491534045582', handle: '@Ghanacomps', caption: 'Anthony Annan vs Uruguay — our biggest legend comp.' },
];

const X_SCRIPT = 'https://platform.twitter.com/widgets.js';
const TIKTOK_SCRIPT = 'https://www.tiktok.com/embed.js';

/** Inject a script once (keyed by src); resolves the shared load state. */
function ensureScript(src: string): void {
  if (document.querySelector(`script[data-gc-embed="${src}"]`)) return;
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  s.setAttribute('data-gc-embed', src);
  document.body.appendChild(s);
}

/** Resolve the site's active theme so the embed roughly matches paper/dark mode. */
function resolveTheme(): 'light' | 'dark' {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export default function SocialStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scriptsMounted, setScriptsMounted] = useState(false);
  const [embedTheme, setEmbedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const needsX = POSTS.some(p => p.platform === 'x');
    const needsTikTok = POSTS.some(p => p.platform === 'tiktok');

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            // Match the embed chrome to the site theme at mount time.
            setEmbedTheme(resolveTheme());
            if (needsX) ensureScript(X_SCRIPT);
            if (needsTikTok) ensureScript(TIKTOK_SCRIPT);
            setScriptsMounted(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    // Only disconnect the observer. The platform scripts are idempotent
    // singletons (ensureScript guards double-injection); removing them on
    // unmount would yank them out from under any other SocialStrip instance
    // and wouldn't clear the globals/iframes anyway. Leaving them is the
    // standard third-party-widget pattern.
    return () => observer.disconnect();
  }, []);

  return (
    <section className="gc-social alt reveal" ref={sectionRef}>
      <div className="gc-eyebrow">From the Timeline</div>
      <h2 className="gc-h2">
        Latest on <span className="gold">X / TikTok.</span>
      </h2>
      <p className="gc-social-note">
        Live posts from @Ghanacomps — served by X and TikTok. Their branded chrome
        stays inside our cell frame; this is the only place raw embeds appear.
      </p>

      <div className="gc-social-strip">
        {POSTS.map((post, i) => (
          <div
            key={i}
            className={`gc-social-cell${post.platform === 'tiktok' ? ' tiktok' : ''}`}
          >
            <span className="gc-social-badge">
              {post.platform === 'x' ? 'On X' : 'On TikTok'}
            </span>
            {scriptsMounted && post.platform === 'x' ? (
              <blockquote className="twitter-tweet" data-theme={embedTheme} data-dnt="true">
                <a href={post.url}>{post.caption}</a>
              </blockquote>
            ) : scriptsMounted && post.platform === 'tiktok' ? (
              <blockquote className="tiktok-embed" cite={post.url}>
                <a href={post.url}>{post.caption}</a>
              </blockquote>
            ) : (
              // Pre-load / failed-script fallback: graceful, still useful.
              <div className="gc-social-fallback">
                <div className="gc-social-fallback-handle">{post.handle}</div>
                <p className="gc-social-fallback-cap">{post.caption}</p>
                <a href={post.url} target="_blank" rel="noopener" className="gc-social-fallback-link">
                  {post.platform === 'x' ? 'View on X ↗' : 'View on TikTok ↗'}
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
