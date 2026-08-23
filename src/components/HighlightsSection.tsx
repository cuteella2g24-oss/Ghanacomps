import { useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { type Clip, type ClipRatio } from '../data/clips';
import VideoCard from './VideoCard';

/**
 * HighlightsSection — the Apple-grade grid/carousel of highlight tiles (spec
 * §2.c). Grid on desktop, horizontal snap-carousel ≤768px. Header reuses the
 * existing `gc-eyebrow` + `gc-h2` broadcast grammar. Empty state uses the
 * dashed-placeholder idiom; under `body.edit` an add-panel + per-card remove
 * mirror the archive/performers admin affordances.
 *
 * Clips are CONTENT: the page owns the localStorage list and passes
 * value/onChange, so a HighlightsSection persists exactly like gc_archive.
 */

interface Props {
  /** Eyebrow label (e.g. "Highlights"). */
  eyebrow: string;
  /** h2 with the trailing gold word split out. */
  headingLead: string;
  headingGold: string;
  clips: Clip[];
  onChange: (clips: Clip[]) => void;
  /** Slug prefix for admin-added clips (e.g. "highlights"). */
  slugPrefix?: string;
  /** Extra section classes (e.g. "alt"). */
  className?: string;
}

export default function HighlightsSection({
  eyebrow, headingLead, headingGold, clips, onChange, slugPrefix = 'highlights', className = '',
}: Props) {
  const { isAdmin } = useAdmin();
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [ratio, setRatio] = useState<ClipRatio>('16x9');
  const [slug, setSlug] = useState('');
  const [duration, setDuration] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const [poster, setPoster] = useState('');
  const [src, setSrc] = useState<'self' | 'embed'>('embed');

  function addClip() {
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }
    if (src === 'embed' && !originalUrl.trim()) {
      alert('Paste the video link (e.g. the X post URL) to embed it.');
      return;
    }
    if (src === 'self' && !slug.trim()) {
      alert('Self-hosted clips need a slug (e.g. highlights/kudus-goal).');
      return;
    }
    // Embed clips don't need a real asset path — derive a stable slug from the
    // title so the key stays unique without the admin having to invent one.
    const rawSlug = slug.trim()
      || title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const normalizedSlug = rawSlug.includes('/') ? rawSlug : `${slugPrefix}/${rawSlug}`;
    onChange([
      ...clips,
      {
        slug: normalizedSlug, title: title.trim(), tag: tag.trim() || undefined,
        ratio, duration: duration.trim() || undefined,
        originalUrl: originalUrl.trim() || undefined, source: src,
        poster: poster.trim() || undefined,
      },
    ]);
    setTitle(''); setTag(''); setSlug(''); setDuration(''); setOriginalUrl(''); setPoster('');
    setRatio('16x9'); setSrc('embed'); setShowAdd(false);
  }

  function removeClip(i: number) {
    if (!confirm('Remove this clip?')) return;
    const next = [...clips];
    next.splice(i, 1);
    onChange(next);
  }

  return (
    <section className={`gc-highlights reveal ${className}`.trim()}>
      <div className="gc-eyebrow">{eyebrow}</div>
      <h2 className="gc-h2">
        {headingLead} <span className="gold">{headingGold}</span>
      </h2>

      {clips.length === 0 ? (
        <div className="post-placeholder" style={{ marginTop: 'var(--space-8xl)' }}>
          <p>
            No highlights yet —{' '}
            <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" style={{ color: 'var(--white)' }}>
              follow @Ghanacomps
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="gc-highlights-grid">
          {clips.map((clip, i) => (
            <div key={`${clip.slug}-${i}`} className="gc-highlights-item">
              <VideoCard clip={clip} size="lg" />
              {isAdmin && (
                <div className="card-actions">
                  <button className="btn-remove-card" onClick={() => removeClip(i)}>✕ Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <div style={{ marginTop: 'var(--space-4xl)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          <button className="add-archive-btn" onClick={() => setShowAdd(s => !s)}>+ Add Clip</button>
        </div>
      )}

      {isAdmin && showAdd && (
        <div className="gc-news-admin" style={{ marginTop: 'var(--space-xl)' }}>
          <div className="gc-news-admin-h">Add Highlight Clip</div>
          <p className="gc-news-admin-hint">
            The usual flow: keep <strong>Embed</strong> selected, paste the <strong>X post link</strong>,
            and add a <strong>thumbnail image URL</strong> so the tile shows a still. The X video then
            plays inline when the tile is clicked. (YouTube, TikTok, Instagram, Vimeo and direct MP4
            links work too.)
          </p>
          <div className="gc-news-admin-grid">
            <label className="gc-field gc-field--full">
              <span>Video link <em>(required for embeds)</em></span>
              <input type="url" placeholder="https://x.com/Ghanacomps/status/…" value={originalUrl} onChange={e => setOriginalUrl(e.target.value)} />
            </label>
            <label className="gc-field gc-field--full">
              <span>Thumbnail image URL</span>
              <input type="url" placeholder="https://…/still.jpg — shown on the tile" value={poster} onChange={e => setPoster(e.target.value)} />
            </label>
            <label className="gc-field gc-field--full">
              <span>Title <em>(required)</em></span>
              <input type="text" placeholder="e.g. Kudus' Weekend Masterclass" value={title} onChange={e => setTitle(e.target.value)} />
            </label>
            <label className="gc-field">
              <span>Tag</span>
              <input type="text" placeholder="e.g. Premier League" value={tag} onChange={e => setTag(e.target.value)} />
            </label>
            <label className="gc-field">
              <span>Duration</span>
              <input type="text" placeholder="e.g. 1:24" value={duration} onChange={e => setDuration(e.target.value)} />
            </label>
            <label className="gc-field">
              <span>Aspect ratio</span>
              <select value={ratio} onChange={e => setRatio(e.target.value as ClipRatio)}>
                <option value="16x9">16:9 (landscape)</option>
                <option value="9x16">9:16 (vertical)</option>
                <option value="4x5">4:5 (portrait)</option>
              </select>
            </label>
            <label className="gc-field">
              <span>Source</span>
              <select value={src} onChange={e => setSrc(e.target.value as 'self' | 'embed')}>
                <option value="embed">Embed a link</option>
                <option value="self">Self-hosted MP4</option>
              </select>
            </label>
            {src === 'self' && (
              <label className="gc-field gc-field--full">
                <span>Slug <em>(self-hosted path)</em></span>
                <input type="text" placeholder={`e.g. ${slugPrefix}/kudus-goal`} value={slug} onChange={e => setSlug(e.target.value)} />
              </label>
            )}
          </div>
          <div className="gc-news-admin-foot">
            <button className="add-archive-btn" onClick={addClip}>Add Clip</button>
            <button className="clear-performers-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
          {src === 'self' && (
            <p className="gc-news-admin-hint" style={{ marginTop: 'var(--space-md)', marginBottom: 0 }}>
              Self-hosted: drop a real MP4 + poster at <code>/assets/video/{'{slug}'}.mp4</code> and{' '}
              <code>.poster.jpg</code> (see the video README).
            </p>
          )}
        </div>
      )}
    </section>
  );
}
