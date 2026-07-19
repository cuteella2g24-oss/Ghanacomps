import { useEffect, useRef, useState } from 'react';

/**
 * useVideoAutoplay — drives the ambient hero video (spec §2.a, Research A2/A3/A9).
 *
 * Mirrors the ScrollReveal IntersectionObserver pattern:
 *  - Autoplays a MUTED video only when scrolled into view; pauses when it leaves
 *    (matches iOS's own visible-to-play / pause-off-screen rule).
 *  - Always handles the play() promise rejection — on reject we stay on the
 *    poster and never throw or go loud.
 *  - Respects `prefers-reduced-motion` and the Save-Data header / very small
 *    screens by NOT enabling video at all (poster-only, no observer, no fetch).
 *
 * Returns:
 *  - `videoRef`  → attach to the <video>.
 *  - `enabled`   → whether the <video> element should even be rendered. When
 *                  false the caller shows the static poster only.
 *  - `isPlaying` → toggles the `.is-playing` class that cross-fades poster→video.
 */
export function useVideoAutoplay() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Decide ONCE, at mount, whether ambient video is allowed at all. Read the
  // media queries / Save-Data in the initializer (no setState-in-effect churn).
  // Under reduced-motion / very small screens / save-data we stay poster-only:
  // no <video> element, no observer, no MP4 fetched.
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.matchMedia('(max-width: 480px)').matches;
    // Save-Data (Network Information API — not in all TS lib targets).
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const saveData = conn?.saveData === true;
    return !(reducedMotion || smallScreen || saveData);
  });

  // Observe → play/pause once enabled and the <video> is mounted.
  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.then === 'function') {
        p.then(() => {
          if (!cancelled) setIsPlaying(true);
        }).catch(() => {
          // Autoplay was blocked / interrupted — stay on the poster, silently.
          if (!cancelled) setIsPlaying(false);
        });
      }
    };

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) tryPlay();
          else video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);

    return () => {
      cancelled = true;
      observer.disconnect();
      video.pause();
    };
  }, [enabled]);

  return { videoRef, enabled, isPlaying };
}
