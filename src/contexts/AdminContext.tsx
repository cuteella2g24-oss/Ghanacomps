import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

const PASS = 'Abdul0244058517';

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [saveLabel, setSaveLabel] = useState('Save Changes');

  const enter = useCallback(() => {
    setIsAdmin(true);
    document.body.classList.add('edit');
  }, []);

  const exit = useCallback(() => {
    setIsAdmin(false);
    document.body.classList.remove('edit');
  }, []);

  const login = useCallback(() => {
    const p = prompt('Admin password:');
    if (p === PASS) enter();
    else if (p !== null) alert('Wrong password.');
  }, [enter]);

  const save = useCallback(() => {
    const KEY = 'gc_edits_' + window.location.pathname;
    const out: Record<string, string> = {};
    document.querySelectorAll<HTMLElement>('.editable[data-eid]').forEach(el => {
      out[el.dataset.eid!] = el.innerHTML;
    });
    localStorage.setItem(KEY, JSON.stringify(out));
    setSaveLabel('Saved!');
    setTimeout(() => setSaveLabel('Save Changes'), 2000);
  }, []);

  const reset = useCallback(() => {
    const KEY = 'gc_edits_' + window.location.pathname;
    if (confirm('Reset all edits on this page?')) { localStorage.removeItem(KEY); window.location.reload(); }
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, exit, save, reset, saveLabel }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);

export function loadPageEdits(): Record<string, string> {
  try {
    const saved = localStorage.getItem('gc_edits_' + window.location.pathname);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}
