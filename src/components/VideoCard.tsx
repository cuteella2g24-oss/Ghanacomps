import { useState } from 'react';
import { type Clip, resolveClip } from '../data/clips';
import VideoLightbox from './VideoLightbox';

/**
 * VideoCard — the single reusable poster-first video tile (spec §2.b). A real
 * <button> showing a lazy poster + one Apple play glyph; tap opens the immersive
 * lightbox. NO <video> is mounted here — the MP4 is only fetched once the
 * lightbox opens, so a dense grid stays N images, not N videos.
 *
 * Size: 'lg' (highlights grid) | 'sm' (player/legend card clips).
 * Ratio comes from the clip record ('16x9' | '9x16' | '4x5').
 * `showCaption` renders the tag + title block under the media (default true for
 * lg, false for sm which is usually captioned by its host layout).
 */

interface Props {
  clip: Clip;
  size?: 'lg' | 'sm';
  showCaption?: boolean;
}

const PlayGlyph = () => (
  <span className="gc-vcard-glyph" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  </span>
);

export default function VideoCard({ clip, size = 'lg', showCaption }: Props) {
  // The triggering element is captured on click (not read from a ref during
  // render) so the lightbox can return focus to it on close.
  const [trigger, setTrigger] = useState<HTMLButtonElement | null>(null);
  const [posterError, setPosterError] = useState(false);
  const resolved = resolveClip(clip);

  const ratioClass =
    clip.ratio === '9x16' ? 'r9x16' : clip.ratio === '4x5' ? 'r4x5' : 'r16x9';
  const withCaption = showCaption ?? size === 'lg';

  return (
    <>
      <button
        type="button"
        className={`gc-vcard ${size} ${ratioClass}`}
        aria-label={`Play highlight: ${clip.title}`}
        onClick={e => setTrigger(e.currentTarget)}
      >
        <span className="gc-vcard-media">
          {!posterError ? (
            <img
              className="gc-vcard-poster"
              src={resolved.posterSrc}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              onError={() => setPosterError(true)}
            />
          ) : (
            // Missing poster → reads as "clip unavailable", never a broken box.
            <span className="gc-vcard-noposter" aria-hidden="true">
              ▶
            </span>
          )}
          <span className="gc-vcard-scrim" aria-hidden="true" />
          {clip.duration && <span className="gc-vcard-dur">{clip.duration}</span>}
          <PlayGlyph />
        </span>
        {withCaption && (
          <span className="gc-vcard-cap">
            {clip.tag && <span className="gc-vcard-tag">{clip.tag}</span>}
            <span className="gc-vcard-title">{clip.title}</span>
          </span>
        )}
      </button>

      {trigger && (
        <VideoLightbox
          clip={resolved}
          triggerEl={trigger}
          onClose={() => setTrigger(null)}
        />
      )}
    </>
  );
}
