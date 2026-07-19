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

    // Re-scan on each navigation; a microtask lets the new route paint first.
    const id = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('.reveal:not(.in)').forEach(el => {
        observer.observe(el);
      });
    }, 0);

    return () => {
      window.clearTimeout(id);
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}
