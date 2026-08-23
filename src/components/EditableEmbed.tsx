import { useAdmin } from '../contexts/AdminContext';
import { useContentField } from '../contexts/ContentContext';
import UniversalEmbed from './UniversalEmbed';

/**
 * EditableEmbed — an admin-managed video embed slot stored server-side. When a
 * link is set the video renders inline (YouTube, TikTok, Instagram, X, Vimeo,
 * or a direct MP4 — see UniversalEmbed). When empty it shows nothing to
 * visitors (so there's never a broken icon) and an "Add a video" button to the
 * admin.
 */

interface Props {
  fieldKey: string;
  label?: string;
}

export default function EditableEmbed({
  fieldKey,
  label = 'video link (YouTube, TikTok, Instagram, X, Vimeo, or MP4)',
}: Props) {
  const { isAdmin } = useAdmin();
  const [url, setUrl] = useContentField<string>(fieldKey, '');

  function edit() {
    const next = prompt(`${label} — paste the video link (clear the box to remove it):`, url);
    if (next !== null) setUrl(next.trim());
  }

  if (!url && !isAdmin) return null;

  return (
    <div className="gc-embed-slot">
      {url
        ? <UniversalEmbed url={url} />
        : <div className="gc-embed-empty">No video embedded yet.</div>}
      {isAdmin && (
        <button type="button" className="gc-embed-edit" onClick={edit}>
          {url ? '✎ Change' : '＋ Add a video'}
        </button>
      )}
    </div>
  );
}
