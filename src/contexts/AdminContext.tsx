import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { verifyToken } from '../lib/content';
import { useContent } from './ContentContext';

/**
 * Only used when the site is running WITHOUT the Worker/API (local `vite dev`),
 * so you can still preview edits against the localStorage fallback. In production
 * the real gate is the Worker's ADMIN_SECRET — this string grants nothing there.
 */
const DEV_FALLBACK_PASS = 'Abdul0244058517';

interface AdminContextType {
  isAdmin: boolean;
  login: () => void;
  exit: () => void;
  save: () => void;
  reset: () => void;
  saveLabel: string;
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false, login: () => {}, exit: () => {}, save: () => {}, reset: () => {}, saveLabel: 'Save Changes',
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const content = useContent();
  const [isAdmin, setIsAdmin] = useState(false);
  const [token, setToken] = useState('');
  const [saveLabel, setSaveLabel] = useState('Save Changes');

  const enter = useCallback((pass: string) => {
    setToken(pass);
    setIsAdmin(true);
    document.body.classList.add('edit');
  }, []);

  const exit = useCallback(() => {
    setIsAdmin(false);
    setToken('');
    document.body.classList.remove('edit');
  }, []);

  const login = useCallback(async () => {
    const p = prompt('Admin password:');
    if (p === null) return;
    const res = await verifyToken(p);
    if (res === 'ok' || (res === 'no-api' && p === DEV_FALLBACK_PASS)) {
      enter(p);
    } else if (res === 'error') {
      alert('Login service is temporarily unavailable. Please try again in a moment.');
    } else {
      alert('Wrong password.');
    }
  }, [enter]);

  const save = useCallback(async () => {
    setSaveLabel('Saving…');
    const r = await content.save(token);
    if (r === 'saved') setSaveLabel('Saved — live for everyone!');
    else if (r === 'local') setSaveLabel('Saved locally (dev only)');
    else if (r === 'unauthorized') { setSaveLabel('Save Changes'); alert('Wrong password — changes were not saved. Log in again.'); return; }
    else setSaveLabel('Save failed');
    setTimeout(() => setSaveLabel('Save Changes'), 3000);
  }, [content, token]);

  const reset = useCallback(() => {
    if (confirm('Discard unsaved changes and reload the latest published content?')) {
      window.location.reload();
    }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, exit, save, reset, saveLabel }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
