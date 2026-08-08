import { useAdmin } from '../contexts/AdminContext';
import { useContentField } from '../contexts/ContentContext';
import TweetEmbed from './TweetEmbed';

/**
 * EditableEmbed — an admin-managed X-post embed slot stored server-side. When a
 * post URL is set the tweet renders inline (native video plays on the site).
 * When empty it shows nothing to visitors (so there's never a broken icon) and
 * an "Embed an X post" button to the admin.
 */

interface Props {
  fieldKey: string;
  label?: string;
}

export default function EditableEmbed({ fieldKey, label = 'X post' }: Props) {
  const { isAdmin } = useAdmin();
  const [url, setUrl] = useContentField<string>(fieldKey, '');

  function edit() {
    const next = prompt(`${label} — paste the X/tweet link (clear the box to remove it):`, url);
    if (next !== null) setUrl(next.trim());
  }

  if (!url && !isAdmin) return null;

  return (
    <div className="gc-embed-slot">
      {url
        ? <TweetEmbed url={url} />
        : <div className="gc-embed-empty">No post embedded yet.</div>}
      {isAdmin && (
        <button type="button" className="gc-embed-edit" onClick={edit}>
          {url ? '✎ Change embedded post' : '＋ Embed an X post'}
        </button>
      )}
    </div>
  );
}
