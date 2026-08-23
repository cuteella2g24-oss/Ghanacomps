import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollReveal — drives the site-wide `.reveal` entrance animation.
 *
 * Mounted once inside the router (App.tsx). It is deliberately JS-gated and
 * safe by construction:
 *  - Adds `reveal-ready` to <html> on mount. The hidden initial state in
 *    style.css is scoped to `html.reveal-ready .reveal` AND wrapped in
 *    `prefers-reduced-motion: no-preference`, so with JS off/failed OR under
 *    reduced motion, every `.reveal` stays fully visible.
 *  - A single IntersectionObserver adds `.in` when a section scrolls into
 *    view, then unobserves it (reveal once — never re-hides on scroll-up).
 *  - Re-scans `.reveal` elements after every client-side navigation (keyed on
 *    router location) so freshly mounted pages animate. Elements already in
 *    view on load intersect on first observe and reveal immediately.
 *  - Cleans up the observer on unmount / before each re-scan (no leaks).
 */
export default function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add('reveal-ready');
    return () => {
      document.documentElement.classList.remove('reveal-ready');
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    // Observe every not-yet-revealed section. Idempotent: re-observing an element
    // is a no-op, and `.in` ones are excluded, so this is safe to call repeatedly.
    let scheduled = false;
    const scanSoon = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach(el => observer.observe(el));
      });
    };

    scanSoon();

    // Catch sections added AFTER the initial scan without a route change — team
    // tabs, conditional blocks, admin add/remove. Without this, a freshly mounted
    // `.reveal` is never observed and stays at opacity:0, blanking the page.
    const mo = new MutationObserver(records => {
      for (const r of records) {
        if (r.addedNodes.length) { scanSoon(); return; }
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // Failsafe: if the observer never fires (some engines/edge cases don't emit
    // the initial intersection), content stuck at opacity:0 would blank the page.
    // After a short delay, force-reveal anything already at/above the fold so the
    // visible viewport can never stay blank — below-fold sections still animate
    // on scroll via the observer.
    const failsafe = window.setTimeout(() => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach(el => {
        if (el.getBoundingClientRect().top < vh) el.classList.add('in');
      });
    }, 1200);

    return () => {
      window.clearTimeout(failsafe);
      mo.disconnect();
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}
