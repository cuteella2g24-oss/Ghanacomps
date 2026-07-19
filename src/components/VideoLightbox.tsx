import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { type ResolvedClip } from '../data/clips';

/**
 * VideoLightbox — the one immersive mode (spec §2.d). Sound + native controls,
 * opened on demand from a VideoCard. Portalled to <body> (a fixed-position
 * SIBLING of the app root) so it is NOT nested inside any `backdrop-filter`
 * ancestor — same containing-block discipline as the mobile nav menu.
 *
 * Behaviour:
 *  - Poster grows into the player: mount → next frame `.is-open` (spring), video
 *    fades in on canplay (`.is-ready`). Reduced-motion → instant, no scale.
 *  - Focus trap: focus moves to the close button on open, is trapped in the
 *    dialog, and returns to the trigger element on close.
 *  - Esc / backdrop-click / X all close. Body scroll-locked; app root inert +
 *    aria-hidden while open so SR/keyboard users can't reach behind.
 *  - `source: 'embed'` clips render a contained platform link-out fallback
 *    inside the frame instead of a <video> (§2.e) — we can't autoplay/mute an
 *    embed, so we keep it minimal and honest.
 */

interface Props {
  clip: ResolvedClip;
  /** Element to return focus to on close (the triggering card). */
  triggerEl: HTMLElement | null;
  onClose: () => void;
}

const CLOSE_MS = 200; // matches --dur-fast for the closing curve

export default function VideoLightbox({ clip, triggerEl, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [mediaError, setMediaError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClose = useCallback(() => {
    if (reducedMotion) {
      onClose();
      return;
    }
    setIsClosing(true);
    window.setTimeout(onClose, CLOSE_MS);
  }, [onClose, reducedMotion]);

  // Open sequence: next frame → .is-open (so the spring runs from scale(.92)).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsOpen(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Scroll-lock + app-root inert/aria-hidden while open; move focus in.
  useEffect(() => {
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';

    const appRoot = document.getElementById('root');
    if (appRoot) {
      appRoot.setAttribute('aria-hidden', 'true');
      appRoot.setAttribute('inert', '');
    }

    closeBtnRef.current?.focus();

    return () => {
      html.style.overflow = prevOverflow;
      if (appRoot) {
        appRoot.removeAttribute('aria-hidden');
        appRoot.removeAttribute('inert');
      }
      // Return focus to the trigger card.
      triggerEl?.focus();
    };
  }, [triggerEl]);

  // Esc to close + focus trap within the dialog.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const root = dialogRef.current;
      if (!root) return;
      const focusable = root.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  const ratioClass = clip.ratio === '9x16' ? 'r9x16' : '';
  const isEmbed = clip.source === 'embed';

  const stageState = isClosing
    ? 'is-closing'
    : isOpen && !reducedMotion
      ? 'is-open'
      : '';
  // Reduced-motion: appear instantly open (no scale/spring transition class).
  const openClass = reducedMotion ? 'is-open no-motion' : stageState;

  return createPortal(
    <div
      className={`gc-lightbox ${ratioClass} ${openClass} ${isReady ? 'is-ready' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={clip.title}
      ref={dialogRef}
    >
      <div
        className="gc-lightbox-backdrop"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="gc-lightbox-stage">
        <button
          type="button"
          className="gc-lightbox-close"
          onClick={handleClose}
          aria-label="Close video"
          ref={closeBtnRef}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="gc-lightbox-frame">
          <img
            className="gc-lightbox-poster"
            src={clip.posterSrc}
            alt=""
            aria-hidden="true"
          />
          {!isEmbed && !mediaError && (
            <video
              className="gc-lightbox-el"
              controls
              playsInline
              preload="metadata"
              poster={clip.posterSrc}
              onCanPlay={() => setIsReady(true)}
              onError={() => setMediaError(true)}
            >
              {clip.webmSrc && <source src={clip.webmSrc} type="video/webm" />}
              {/* onError on the last (authoritative) source: fires only when the
                  mp4 itself fails to load — a source error does NOT bubble to the
                  <video> React onError, so poster-only clips need this to flip to
                  the "view original" fallback. */}
              <source
                src={clip.mp4Src}
                type="video/mp4"
                onError={() => setMediaError(true)}
              />
              {clip.captionsSrc && (
                <track
                  kind="captions"
                  srcLang="en"
                  src={clip.captionsSrc}
                  label="English"
                  default
                />
              )}
            </video>
          )}
          {/* Embed fallback OR missing-media fallback: contained link-out. */}
          {(isEmbed || mediaError) && (
            <div className="gc-lightbox-fallback">
              <p>
                {isEmbed
                  ? 'This clip lives on its original platform.'
                  : 'Clip unavailable right now.'}
              </p>
              {clip.originalUrl && (
                <a href={clip.originalUrl} target="_blank" rel="noopener">
                  View original ↗
                </a>
              )}
            </div>
          )}
        </div>

        <div className="gc-lightbox-caption">
          <span className="t">{clip.title}</span>
          {clip.originalUrl && !mediaError && (
            <a href={clip.originalUrl} target="_blank" rel="noopener">
              View original ↗
            </a>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
