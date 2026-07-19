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

const inputStyle: React.CSSProperties = {
  flex: 1, minWidth: '160px', background: 'var(--raised)', border: '1px solid var(--line)',
  color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)',
  borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)',
};

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
  const [src, setSrc] = useState<'self' | 'embed'>('self');

  function addClip() {
    if (!title.trim() || !slug.trim()) {
      alert('Please enter at least a title and a slug (e.g. highlights/kudus-goal).');
      return;
    }
    const normalizedSlug = slug.includes('/') ? slug.trim() : `${slugPrefix}/${slug.trim()}`;
    onChange([
      ...clips,
      {
        slug: normalizedSlug, title: title.trim(), tag: tag.trim() || undefined,
        ratio, duration: duration.trim() || undefined,
        originalUrl: originalUrl.trim() || undefined, source: src,
      },
    ]);
    setTitle(''); setTag(''); setSlug(''); setDuration(''); setOriginalUrl('');
    setRatio('16x9'); setSrc('self'); setShowAdd(false);
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
            <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>
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
        <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-3xl)', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
          <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>Add Highlight Clip</div>
          <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="text" placeholder="Title..." value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Tag (e.g. Premier League)..." value={tag} onChange={e => setTag(e.target.value)} style={inputStyle} />
            <input type="text" placeholder={`Slug (e.g. ${slugPrefix}/kudus-goal)...`} value={slug} onChange={e => setSlug(e.target.value)} style={inputStyle} />
            <input type="text" placeholder="Duration (e.g. 1:24)..." value={duration} onChange={e => setDuration(e.target.value)} style={{ ...inputStyle, minWidth: '100px' }} />
            <select value={ratio} onChange={e => setRatio(e.target.value as ClipRatio)} style={{ ...inputStyle, flex: 'none' }}>
              <option value="16x9">16:9</option>
              <option value="9x16">9:16</option>
              <option value="4x5">4:5</option>
            </select>
            <input type="url" placeholder="Original URL (attribution)..." value={originalUrl} onChange={e => setOriginalUrl(e.target.value)} style={inputStyle} />
            <select value={src} onChange={e => setSrc(e.target.value as 'self' | 'embed')} style={{ ...inputStyle, flex: 'none' }}>
              <option value="self">Self-hosted</option>
              <option value="embed">Embed fallback</option>
            </select>
            <button className="add-archive-btn" onClick={addClip}>Add</button>
            <button className="clear-performers-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </div>
          <p style={{ fontSize: 'var(--fs-xs)', color: 'var(--sub)', marginTop: 'var(--space-sm)', fontStyle: 'italic' }}>
            Placeholder clips ship with the site — drop a real MP4 + poster at <code>/assets/video/{'{slug}'}.mp4</code> and <code>.poster.jpg</code> to swap it in (see the video README).
          </p>
        </div>
      )}
    </section>
  );
}
