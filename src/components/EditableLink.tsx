import { useAdmin } from '../contexts/AdminContext';
import { useContentField } from '../contexts/ContentContext';

/**
 * EditableLink — an anchor whose href is admin-editable and stored server-side.
 * Use it to repoint a comp row at, say, a player's whole X archive instead of a
 * single post. In edit mode the link never navigates; a small "✎ link" button
 * prompts for the new URL. `children` (title/stats/watch tag) stay as they are.
 */

interface Props {
  fieldKey: string;
  defaultUrl?: string;
  className?: string;
  promptLabel?: string;
  children: React.ReactNode;
}

export default function EditableLink({
  fieldKey,
  defaultUrl = '#',
  className,
  promptLabel = 'Link URL (e.g. the player\'s archive on X):',
  children,
}: Props) {
  const { isAdmin } = useAdmin();
  const [url, setUrl] = useContentField<string>(fieldKey, defaultUrl);

  function editUrl() {
    const next = prompt(promptLabel, url === '#' ? '' : url);
    if (next !== null) setUrl(next.trim() || '#');
  }

  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noopener"
      className={className}
      onClick={isAdmin ? e => e.preventDefault() : undefined}
    >
      {children}
      {isAdmin && (
        <button
          type="button"
          className="edit-link-badge"
          title="Edit link URL"
          onClick={e => { e.preventDefault(); e.stopPropagation(); editUrl(); }}
        >
          ✎ link
        </button>
      )}
    </a>
  );
}
