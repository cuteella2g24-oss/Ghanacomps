import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const links = [
  { to: '/', label: 'Home' },
  { to: '/gpa', label: 'GPA Weekly' },
  { to: '/players', label: 'Current Players' },
  { to: '/legends', label: 'Legends' },
  { to: '/blackstars', label: 'Black Stars' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock background scroll while the full-screen menu is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  return (
    <>
      <nav className="nav">
        <div className="nav-inner">
          <Link to="/" className="nav-brand">
            <img src="/assets/logo.jpg" alt="Ghana Comps" className="nav-logo" />
            <div>
              <div className="nav-name">Ghana <em>Comps</em></div>
              <div className="nav-tag">+233</div>
            </div>
          </Link>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.to}><Link to={l.to} className={pathname === l.to ? 'on' : ''}>{l.label}</Link></li>
            ))}
          </ul>
          <div className="nav-actions">
            <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" className="btn-xs solid">Follow on X</a>
            <a href="https://tiktok.com/@ghanacompss" target="_blank" rel="noopener" className="btn-xs ghost">TikTok</a>
          </div>
          <button className={`nav-ham${drawerOpen ? ' open' : ''}`} onClick={() => setDrawerOpen(o => !o)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Sibling of <nav> (not a child) so the fixed overlay is positioned
          against the viewport — the nav's backdrop-filter would otherwise
          trap it inside the 56px bar. */}
      <div className={`nav-menu${drawerOpen ? ' open' : ''}`}>
        <div className="nav-menu-inner">
          <div className="eyebrow">Ghanaian Football Archive</div>
          <div className="nav-menu-links">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={pathname === l.to ? 'on' : ''} onClick={() => setDrawerOpen(false)}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="nav-menu-actions">
            <ThemeToggle />
            <div className="nav-menu-socials">
              <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" className="social-btn primary" aria-label="Follow on X">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </a>
              <a href="https://tiktok.com/@ghanacompss" target="_blank" rel="noopener" className="social-btn" aria-label="TikTok">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.08-.14 1.62.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
              </a>
              <a href="https://www.facebook.com/share/1GL7b1Qsuq/" target="_blank" rel="noopener" className="social-btn" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8v8.44C19.61 23.08 24 18.09 24 12.07z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
