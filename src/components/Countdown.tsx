import { useEffect, useState } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useContentField } from '../contexts/ContentContext';

/**
 * Countdown — live ticking DD·HH·MM·SS to a kickoff time. EditableCountdown wraps
 * it with an admin control to set/repoint the target date (stored server-side),
 * so fixtures can show a real countdown that everyone sees.
 */

function CountCell({ value, label }: { value: number; label: string }) {
  return (
    <div className="gc-count-cell">
      <span className="gc-count-num">{String(value).padStart(2, '0')}</span>
      <span className="gc-count-lbl">{label}</span>
    </div>
  );
}

export function Countdown({ target }: { target: string }) {
  const t = Date.parse(target);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (Number.isNaN(t)) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [t]);

  if (Number.isNaN(t)) return null;

  const ms = Math.max(0, t - now);
  if (ms === 0) return <div className="gc-countdown is-live">● Kickoff</div>;

  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const mins = Math.floor((ms % 3_600_000) / 60_000);
  const secs = Math.floor((ms % 60_000) / 1000);

  return (
    <div className="gc-countdown" role="timer" aria-label="Time to kickoff">
      <CountCell value={days} label="Days" />
      <span className="gc-count-sep">:</span>
      <CountCell value={hours} label="Hrs" />
      <span className="gc-count-sep">:</span>
      <CountCell value={mins} label="Min" />
      <span className="gc-count-sep">:</span>
      <CountCell value={secs} label="Sec" />
    </div>
  );
}

export function EditableCountdown({ fieldKey, defaultIso = '' }: { fieldKey: string; defaultIso?: string }) {
  const { isAdmin } = useAdmin();
  const [iso, setIso] = useContentField<string>(fieldKey, defaultIso);

  function edit() {
    const next = prompt(
      'Kickoff date & time in ISO format, e.g. 2026-05-22T17:00:00Z (clear to hide):',
      iso,
    );
    if (next !== null) setIso(next.trim());
  }

  const valid = iso && !Number.isNaN(Date.parse(iso));
  if (!valid && !isAdmin) return null;

  return (
    <div className="gc-fix-countdown">
      {valid && <Countdown target={iso} />}
      {isAdmin && (
        <button type="button" className="gc-embed-edit" onClick={edit}>
          {valid ? '✎ Edit kickoff date' : '＋ Set kickoff date'}
        </button>
      )}
    </div>
  );
}
