import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

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

  return (
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
      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`}>
        <div className="nav-drawer-row">
          <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" className="btn primary">Follow on X</a>
          <a href="https://tiktok.com/@ghanacompss" target="_blank" rel="noopener" className="btn outline">TikTok</a>
        </div>
      </div>
      <div className="nav-strip">
        <div className="nav-strip-inner">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={pathname === l.to ? 'on' : ''} onClick={() => setDrawerOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
