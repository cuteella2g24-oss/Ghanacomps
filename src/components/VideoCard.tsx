import { useState } from 'react';
import { type Clip, resolveClip } from '../data/clips';
import UniversalEmbed from './UniversalEmbed';
import { resolveEmbed } from '../lib/videoEmbed';

/**
 * VideoCard — a poster-first video tile that plays IN PLACE (spec §2.b, revised).
 * Tap the poster and the tile swaps to the live player right where it sits — no
 * modal. Embed clips (X, YouTube, TikTok, Instagram, MP4) render via
 * UniversalEmbed; self-hosted clips render a native <video>. Until tapped, NO
 * player is mounted, so a dense grid stays N images, not N players.
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
  const [playing, setPlaying] = useState(false);
  const [posterError, setPosterError] = useState(false);
  const resolved = resolveClip(clip);

  const ratioClass =
    clip.ratio === '9x16' ? 'r9x16' : clip.ratio === '4x5' ? 'r4x5' : 'r16x9';
  const withCaption = showCaption ?? size === 'lg';
  const isEmbed = clip.source === 'embed' && !!clip.originalUrl;
  // Card-style embeds (X / TikTok / Instagram) set their own tall height, so the
  // media box must grow to fit them instead of being clamped to the clip ratio.
  const embedKind = isEmbed ? resolveEmbed(clip.originalUrl!).kind : null;
  const cardEmbed = embedKind === 'twitter' || embedKind === 'tiktok' || embedKind === 'instagram';

  const caption = withCaption && (
    <span className="gc-vcard-cap">
      {clip.tag && <span className="gc-vcard-tag">{clip.tag}</span>}
      <span className="gc-vcard-title">{clip.title}</span>
    </span>
  );

  // Playing: the tile becomes a live player in place (not a button — it now
  // contains interactive media).
  if (playing) {
    return (
      <div className={`gc-vcard ${size} ${ratioClass} is-playing`}>
        <span className={`gc-vcard-media is-live${cardEmbed ? ' is-cardembed' : ''}`}>
          {isEmbed ? (
            <UniversalEmbed url={clip.originalUrl!} caption={clip.title} />
          ) : (
            <video
              className="gc-vcard-video"
              controls
              autoPlay
              playsInline
              poster={resolved.posterSrc}
            >
              {resolved.webmSrc && <source src={resolved.webmSrc} type="video/webm" />}
              <source src={resolved.mp4Src} type="video/mp4" />
            </video>
          )}
        </span>
        {caption}
      </div>
    );
  }

  return (
    <button
      type="button"
      className={`gc-vcard ${size} ${ratioClass}`}
      aria-label={`Play highlight: ${clip.title}`}
      onClick={() => setPlaying(true)}
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
      {caption}
    </button>
  );
}
