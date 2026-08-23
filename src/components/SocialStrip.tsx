import { useEffect, useRef, useState } from 'react';
import UniversalEmbed from './UniversalEmbed';

/**
 * SocialStrip — the "Latest on X / TikTok" band (spec §2.e). The ONLY place raw
 * platform embeds live. Each embed is corralled in a `--raised` cell with our
 * gold "On X / On TikTok" badge asserting context first, physically separated
 * in its own `.alt` section. We cannot restyle inside the cross-origin iframe;
 * the cell frame + badge are the corral, and that's accepted here and nowhere
 * else.
 *
 * Rendering: each cell defers to <UniversalEmbed>, which builds the embed
 * EXPLICITLY (X via createTweet, TikTok via a scanned blockquote) rather than
 * relying on a platform script's one-shot auto-scan. That auto-scan is why
 * embeds used to intermittently vanish — if widgets.js was already loaded
 * elsewhere on the page it never re-scanned these late-mounted blockquotes.
 *
 * Performance: the embeds (and their platform scripts) are only mounted once the
 * strip scrolls into view (IntersectionObserver); until then each cell shows a
 * graceful "View on X ↗" link-out — still useful, never a broken frame.
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

export default function SocialStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="gc-social reveal" ref={sectionRef}>
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
            {visible ? (
              <UniversalEmbed url={post.url} caption={post.caption} />
            ) : (
              // Pre-scroll fallback: graceful, still useful.
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
