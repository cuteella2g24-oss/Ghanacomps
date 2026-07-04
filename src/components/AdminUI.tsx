import { useAdmin } from '../contexts/AdminContext';
import { Button } from '@/components/ui/button';

export default function AdminUI() {
  const { isAdmin, login, exit, save, reset, saveLabel } = useAdmin();
  return (
    <>
      <button className="admin-lock" title="Admin" onClick={isAdmin ? exit : login}>
        {isAdmin ? '🔓' : '🔒'}
      </button>
      <div className={`admin-bar${isAdmin ? ' show' : ''}`} id="admin-bar">
        <span className="admin-bar-txt">Edit mode active — click any text to edit</span>
        <div className="admin-bar-btns">
          <Button variant="outline" size="sm" onClick={reset}>Reset Page</Button>
          <Button variant="outline" size="sm" onClick={exit}>Exit</Button>
          <Button size="sm" onClick={save}>{saveLabel}</Button>
        </div>
      </div>
    </>
  );
}
