import { type HeroVideo as HeroVideoRecord } from '../data/clips';
import { useVideoAutoplay } from '../hooks/useVideoAutoplay';

/**
 * HeroVideo — the ambient hero video layer (spec §2.a). Sits BEHIND the hero
 * content at z-index 0: poster paints first (LCP is the image, never a black
 * flash), then the muted autoplay loop cross-fades in once it can play. A
 * left-weighted legibility scrim (`--video-scrim-hero`) keeps the Playfair
 * headline AA over any frame; the chevron keylines raise over the scrim.
 *
 * The whole layer is decorative → aria-hidden. Under reduced-motion / very small
 * screens / save-data the hook keeps `enabled` false: poster only, no autoplay,
 * no observer, no MP4 fetched (see useVideoAutoplay).
 */

interface Props {
  video: HeroVideoRecord;
}

export default function HeroVideo({ video }: Props) {
  const { videoRef, enabled, isPlaying } = useVideoAutoplay();

  return (
    <div
      className={`gc-hvideo ${isPlaying ? 'is-playing' : ''}`}
      aria-hidden="true"
    >
      <img className="gc-hvideo-poster" src={video.poster} alt="" />
      {enabled && (
        <video
          className="gc-hvideo-el"
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          poster={video.poster}
          tabIndex={-1}
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
      <div className="gc-hvideo-scrim" />
    </div>
  );
}
