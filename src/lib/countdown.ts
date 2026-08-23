/**
 * Pure helpers for the kickoff datetime-local picker (admin dashboard →
 * FieldDateTime). Kept out of the component file so importing them doesn't
 * break Fast Refresh (react-refresh/only-export-components).
 */

/** ISO string → a `YYYY-MM-DDTHH:mm` value in the browser's local time for a
 * datetime-local input. Returns '' when the ISO is missing/invalid. */
export function isoToLocalInput(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

/** datetime-local value (local time) → stored ISO string. '' / invalid stays ''. */
export function localInputToIso(v: string): string {
  if (!v) return '';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '' : d.toISOString();
}

/** A live "X days, Y hrs to kickoff" hint. Empty when there's no valid date. */
export function kickoffHint(iso: string): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const ms = t - Date.now();
  if (ms <= 0) return 'Kicked off';
  const days = Math.floor(ms / 86_400_000);
  const hrs = Math.floor((ms % 86_400_000) / 3_600_000);
  return `⏳ ${days} days, ${hrs} hrs to kickoff`;
}
