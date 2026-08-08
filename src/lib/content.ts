/**
 * Content client — talks to the Worker's /api/content KV store.
 *
 * The whole editable site lives in one JSON blob:
 *   - edits:  inline <Editable> text, keyed by page path → element id → HTML
 *   - lists:  the add/remove collections (news, highlights, extra players, …)
 *   - fields: flat scalar overrides (comp/archive links, player teams, tweet
 *             embeds, fixture dates), keyed like "link:l2" / "team:p1".
 *
 * In production the Worker serves this from KV so every visitor sees it. When
 * there is no Worker (local `vite dev`), we transparently fall back to a
 * localStorage cache so editing still works while developing.
 */

export interface ContentData {
  edits: Record<string, Record<string, string>>;
  lists: Record<string, unknown>;
  fields: Record<string, unknown>;
}

const LS_KEY = 'gc_content';

function normalize(raw: unknown): ContentData {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const obj = (v: unknown) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
  return {
    edits: obj(r.edits) as ContentData['edits'],
    lists: obj(r.lists),
    fields: obj(r.fields),
  };
}

function isJson(res: Response): boolean {
  return (res.headers.get('content-type') || '').includes('application/json');
}

export async function fetchContent(): Promise<ContentData> {
  try {
    const res = await fetch('/api/content', { headers: { accept: 'application/json' } });
    if (res.ok && isJson(res)) return normalize(await res.json());
  } catch {
    /* fall through to local cache */
  }
  try {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) return normalize(JSON.parse(cached));
  } catch {
    /* ignore */
  }
  return normalize(null);
}

export type SaveResult = 'saved' | 'local' | 'unauthorized' | 'error';

export async function saveContent(data: ContentData, token: string): Promise<SaveResult> {
  try {
    const res = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    });
    if (res.ok && isJson(res)) {
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch { /* ignore */ }
      return 'saved';
    }
    if (res.status === 401) return 'unauthorized';
  } catch {
    /* fall through to local cache (dev) */
  }
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
    return 'local';
  } catch {
    return 'error';
  }
}

/**
 * Login check against the Worker:
 *  - 'ok'     correct password
 *  - 'bad'    wrong password (server said 401)
 *  - 'no-api' no Worker present (local `vite dev` serves index.html at 200) →
 *             caller may allow the dev-fallback password
 *  - 'error'  the API responded but is broken (5xx / proxy HTML) → don't treat
 *             a transient outage as a wrong password
 */
export async function verifyToken(token: string): Promise<'ok' | 'bad' | 'no-api' | 'error'> {
  try {
    const res = await fetch('/api/auth', { headers: { authorization: `Bearer ${token}` } });
    if (isJson(res)) {
      if (res.ok) return 'ok';
      if (res.status === 401) return 'bad';
      return 'error';
    }
    // Non-JSON: a 200 means the SPA fallback answered (no Worker) → dev mode.
    return res.ok ? 'no-api' : 'error';
  } catch {
    return 'no-api';
  }
}
