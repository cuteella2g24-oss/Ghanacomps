import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { fetchContent, saveContent, type ContentData, type SaveResult } from '../lib/content';

/**
 * ContentContext — one in-memory copy of the site's editable content, loaded
 * once from /api/content. Pages read slices via useContentList / useContentField;
 * <Editable> reads inline text via getEdit. Every mutation stages into memory and
 * is written to the server in one shot by the admin "Save Changes" button (save()).
 */

interface ContentCtxType {
  loaded: boolean;
  getList: <T>(key: string, fallback: T) => T;
  setList: (key: string, value: unknown) => void;
  getField: <T>(key: string, fallback: T) => T;
  setField: (key: string, value: unknown) => void;
  getEdit: (path: string, eid: string) => string | undefined;
  /** Record one inline edit (write-through, so edits survive navigating between pages). */
  setEdit: (path: string, eid: string, html: string) => void;
  /** Snapshot the current page's inline edits from the DOM, then persist everything. */
  save: (token: string) => Promise<SaveResult>;
}

const EMPTY: ContentData = { edits: {}, lists: {}, fields: {} };

const ContentContext = createContext<ContentCtxType>({
  loaded: false,
  getList: (_k, f) => f,
  setList: () => {},
  getField: (_k, f) => f,
  setField: () => {},
  getEdit: () => undefined,
  setEdit: () => {},
  save: async () => 'error',
});

export function ContentProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ContentData>(EMPTY);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchContent().then(d => {
      if (!alive) return;
      setData(d);
      setLoaded(true);
    });
    return () => { alive = false; };
  }, []);

  const getList = useCallback(<T,>(key: string, fallback: T): T => {
    const v = data.lists[key];
    if (v === undefined) return fallback;
    // Defensive: a corrupted/hand-edited blob shouldn't crash every visitor at
    // render time (pages spread/.map these). Fall back if the shape is wrong.
    if (Array.isArray(fallback) && !Array.isArray(v)) return fallback;
    return v as T;
  }, [data]);

  const setList = useCallback((key: string, value: unknown) => {
    setData(prev => ({ ...prev, lists: { ...prev.lists, [key]: value } }));
  }, []);

  const getField = useCallback(<T,>(key: string, fallback: T): T => {
    const v = data.fields[key];
    return v === undefined ? fallback : (v as T);
  }, [data]);

  const setField = useCallback((key: string, value: unknown) => {
    setData(prev => ({ ...prev, fields: { ...prev.fields, [key]: value } }));
  }, []);

  const getEdit = useCallback((path: string, eid: string): string | undefined => {
    return data.edits[path]?.[eid];
  }, [data]);

  const setEdit = useCallback((path: string, eid: string, html: string) => {
    setData(prev => {
      if (prev.edits[path]?.[eid] === html) return prev; // no-op, avoid churn
      return { ...prev, edits: { ...prev.edits, [path]: { ...prev.edits[path], [eid]: html } } };
    });
  }, []);

  const save = useCallback(async (token: string): Promise<SaveResult> => {
    // Snapshot inline contentEditable text for the current page from the DOM.
    const path = window.location.pathname;
    const pageEdits: Record<string, string> = { ...(data.edits[path] || {}) };
    document.querySelectorAll<HTMLElement>('.editable[data-eid]').forEach(el => {
      pageEdits[el.dataset.eid!] = el.innerHTML;
    });
    const next: ContentData = { ...data, edits: { ...data.edits, [path]: pageEdits } };
    setData(next);
    return saveContent(next, token);
  }, [data]);

  return (
    <ContentContext.Provider value={{ loaded, getList, setList, getField, setField, getEdit, setEdit, save }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => useContext(ContentContext);

/** Drop-in replacement for useLocalStorage over an add/remove collection. */
export function useContentList<T>(key: string, fallback: T): [T, (v: T) => void] {
  const { getList, setList } = useContent();
  return [getList(key, fallback), (v: T) => setList(key, v)];
}

/** A single scalar override (link, team, embed URL, fixture date, …). */
export function useContentField<T>(key: string, fallback: T): [T, (v: T) => void] {
  const { getField, setField } = useContent();
  return [getField(key, fallback), (v: T) => setField(key, v)];
}
