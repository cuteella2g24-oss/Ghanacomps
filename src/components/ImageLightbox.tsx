import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * ImageLightbox — tap-to-expand mode for still screenshots (fan reactions,
 * special-moment screens). A parallel to VideoLightbox that renders a full
 * <img> (object-fit: contain, untruncated) instead of a <video>, but reuses
 * the SAME `.gc-lightbox*` shell CSS and the identical a11y/portal/motion
 * behaviour so the two feel like one system:
 *
 *  - Portalled to <body> (a fixed-position SIBLING of the app root) so it is
 *    NOT trapped inside any `backdrop-filter` ancestor.
 *  - Stage springs open (scale(.92) → 1) on the next frame; reduced-motion →
 *    instant open, no scale.
 *  - Focus trap: focus moves to the close button on open, is trapped in the
 *    dialog, and returns to the trigger element on close.
 *  - Esc / backdrop-click / X all close. Body scroll-locked; app root inert +
 *    aria-hidden while open.
 *
 * The frame auto-sizes to the natural aspect of the screenshot (portrait tweet
 * caps, wide platform grabs) rather than being pinned to a fixed ratio.
 */

interface Props {
  src: string;
  /** Accessible name for the dialog + fallback alt for the image. */
  label: string;
  /** Element to return focus to on close (the triggering tile). */
  triggerEl: HTMLElement | null;
  onClose: () => void;
}

const CLOSE_MS = 200; // matches --dur-fast for the closing curve

export default function ImageLightbox({ src, label, triggerEl, onClose }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
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
      // Return focus to the trigger tile.
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
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
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

  const stageState = isClosing
    ? 'is-closing'
    : isOpen && !reducedMotion
      ? 'is-open'
      : '';
  // Reduced-motion: appear instantly open (no scale/spring transition class).
  const openClass = reducedMotion ? 'is-open no-motion' : stageState;

  return createPortal(
    <div
      className={`gc-lightbox gc-lightbox-img ${openClass}`}
      role="dialog"
      aria-modal="true"
      aria-label={label}
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
          aria-label="Close image"
          ref={closeBtnRef}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <div className="gc-lightbox-frame gc-lightbox-imgframe">
          {!mediaError ? (
            <img
              className="gc-lightbox-el is-ready"
              src={src}
              alt={label}
              onError={() => setMediaError(true)}
            />
          ) : (
            <div className="gc-lightbox-fallback">
              <p>Screenshot unavailable right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
