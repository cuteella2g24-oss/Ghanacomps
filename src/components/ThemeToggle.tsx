import { useState, useEffect, useRef } from 'react';

type Theme = 'light' | 'dark';

function systemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function savedChoice(): Theme | null {
  try {
    const s = localStorage.getItem('gc_theme');
    return s === 'light' || s === 'dark' ? s : null;
  } catch {
    return null;
  }
}

/**
 * Theme toggle. `choice === null` means "follow the OS"; once the user taps,
 * an explicit choice is stored and applied via the data-theme attribute
 * (see the light-theme block in style.css and the no-flash script in index.html).
 */
export default function ThemeToggle() {
  const [choice, setChoice] = useState<Theme | null>(savedChoice);
  const effective: Theme = choice ?? systemTheme();
  const firstRun = useRef(true);

  useEffect(() => {
    const root = document.documentElement;
    if (choice) {
      root.setAttribute('data-theme', choice);
      try { localStorage.setItem('gc_theme', choice); } catch { /* ignore */ }
    } else {
      root.removeAttribute('data-theme');
      try { localStorage.removeItem('gc_theme'); } catch { /* ignore */ }
    }

    // Crossfade only on a real user switch, not on initial mount
    if (firstRun.current) { firstRun.current = false; return; }
    root.classList.add('theme-transition');
    const id = setTimeout(() => root.classList.remove('theme-transition'), 400);
    return () => clearTimeout(id);
  }, [choice]);

  const isDark = effective === 'dark';

  return (
    <button
      className="theme-toggle"
      onClick={() => setChoice(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
