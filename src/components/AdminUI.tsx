import { useAdmin } from '../contexts/AdminContext';

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
          <button className="btn outline" onClick={reset}>Reset Page</button>
          <button className="btn outline" onClick={exit}>Exit</button>
          <button className="btn primary" onClick={save}>{saveLabel}</button>
        </div>
      </div>
    </>
  );
}
