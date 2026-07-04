import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import { useAdmin } from '../contexts/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NewsItem {
  title: string;
  url: string;
  tag: 'general' | 'injury' | 'transfer';
}

export default function Home() {
  const { isAdmin } = useAdmin();
  const [news, setNews] = useLocalStorage<NewsItem[]>('gc_news', []);
  const [newsTag, setNewsTag] = useState<'general' | 'injury' | 'transfer'>('general');
  const [newsHeadline, setNewsHeadline] = useState('');
  const [newsUrl, setNewsUrl] = useState('');

  function addNews() {
    if (!newsHeadline.trim()) { alert('Please enter a headline.'); return; }
    if (news.length >= 4) { alert('Maximum 4 headlines. Remove one first.'); return; }
    setNews([...news, { title: newsHeadline.trim(), url: newsUrl.trim(), tag: newsTag }]);
    setNewsHeadline('');
    setNewsUrl('');
  }

  function removeNews(i: number) {
    const updated = [...news];
    updated.splice(i, 1);
    setNews(updated);
  }

  return (
    <>
      <Stripe />
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-grid">
          <div>
            <Editable tag="div" eid="hero-eyebrow" className="eyebrow">Ghana Comps — Ghanaian Football Archive</Editable>
            <h1 className="d1" style={{ marginBottom: 'var(--space-4xl)' }}>
              <Editable tag="span" eid="hero-l1">Ghanaian</Editable><br />
              <Editable tag="span" eid="hero-l2" className="gold">Players</Editable><br />
              <Editable tag="span" eid="hero-l3" style={{ color: 'var(--green)' }}>Celebrated.</Editable>
            </h1>
            <Editable tag="p" eid="hero-para" className="lead" style={{ maxWidth: '480px', marginBottom: 'var(--space-5xl)' }}>
              Goals. Assists. Saves. The ones everybody saw and the ones nobody talked about. Every Ghanaian. Every weekend. And when the weekend is done we go back to the legends.
            </Editable>
            <div className="row-btns">
              <span className="hero-follow">
                Follow us on
                <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" className="hero-follow-x" aria-label="Follow us on X">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              </span>
              <Button asChild variant="outline"><Link to="/about">Our Story</Link></Button>
            </div>
          </div>

          {/* NEWS PANEL */}
          <div>
            <div className="news-panel">
              <div className="news-panel-header"><span className="news-dot" />Latest News</div>
              {news.length === 0 && (
                <p className="news-empty">No news yet. Add headlines via the admin panel.</p>
              )}
              {news.map((item, i) => {
                const inner = (
                  <>
                    <span className={`news-item-tag ${item.tag}`}>{item.tag}</span>
                    <span className="news-item-title">{item.title}</span>
                    {isAdmin && (
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); removeNews(i); }}
                        style={{ background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 'var(--radius-full)', minWidth: '20px', height: '20px', fontSize: 'var(--fs-2xs)', cursor: 'pointer', marginLeft: 'auto' }}
                      >×</button>
                    )}
                  </>
                );
                return item.url ? (
                  <a key={i} href={item.url} target="_blank" rel="noopener" className="news-item">{inner}</a>
                ) : (
                  <div key={i} className="news-item">{inner}</div>
                );
              })}
            </div>

            {isAdmin && (
              <div style={{ marginTop: 'var(--space-sm)', padding: 'var(--space-xl)', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
                <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>Add News Headline</div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <select
                    value={newsTag}
                    onChange={e => setNewsTag(e.target.value as 'general' | 'injury' | 'transfer')}
                    style={{ background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }}
                  >
                    <option value="general">General</option>
                    <option value="injury">Injury</option>
                    <option value="transfer">Transfer</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Headline..."
                    value={newsHeadline}
                    onChange={e => setNewsHeadline(e.target.value)}
                    style={{ flex: 1, minWidth: '140px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }}
                  />
                  <input
                    type="url"
                    placeholder="Link URL (optional)..."
                    value={newsUrl}
                    onChange={e => setNewsUrl(e.target.value)}
                    style={{ flex: 1, minWidth: '140px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }}
                  />
                  <Button size="sm" onClick={addNews}>Add</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GPA PREVIEW */}
      <section className="alt reveal">
        <Editable tag="div" eid="gpa-preview-eyebrow" className="eyebrow">This Week on Ghanaian Players Abroad (GPA)</Editable>
        <h2 className="d2" style={{ marginBottom: 'var(--space-xs)' }}>The Weekly <span className="gold">Breakdown.</span></h2>
        <p className="lead" style={{ marginBottom: 0, fontSize: 'var(--fs-base)' }}>Updated every Monday.</p>
        <div className="gpa-grid">
          <div className="gpa-card">
            <div className="gpa-lbl">Matchweek Review</div>
            <Editable tag="div" eid="h-mwr-n" className="gpa-name">Matchweek Review</Editable>
            <Editable tag="p" eid="h-mwr-b" className="gpa-body">Our weekly breakdown of everything that happened in Ghanaian football. Updated every Monday.</Editable>
          </div>
          <div className="gpa-card">
            <div className="gpa-lbl">Player of the Week</div>
            <Editable tag="div" eid="h-potw-n" className="gpa-name">Updated Monday</Editable>
            <Editable tag="p" eid="h-potw-b" className="gpa-body">We watch every match and pick the one Ghanaian who stood tallest that week.</Editable>
          </div>
          <div className="gpa-card">
            <div className="gpa-lbl">Goal and Assist of the Week</div>
            <Editable tag="div" eid="h-gatw-n" className="gpa-name">Coming Monday</Editable>
            <Editable tag="p" eid="h-gatw-b" className="gpa-body">Every week we pick the best Ghanaian goal and the most important assist.</Editable>
          </div>
        </div>
        <Button asChild variant="ghost"><Link to="/gpa">Read Full GPA Weekly</Link></Button>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          <span>Thomas Partey</span><span className="dot">◆</span><span>Mohammed Kudus</span><span className="dot">◆</span><span>Fatawu Issahaku</span><span className="dot">◆</span><span>Antoine Semenyo</span><span className="dot">◆</span><span>Jordan Ayew</span><span className="dot">◆</span><span>Ibrahim Sulemana</span><span className="dot">◆</span><span>Ibrahim Osman</span><span className="dot">◆</span><span>Ernest Nuamah</span><span className="dot">◆</span><span>Kamaldeen Sulemana</span><span className="dot">◆</span><span>Joseph Paintsil</span><span className="dot">◆</span><span>Inaki Williams</span><span className="dot">◆</span><span>Alexander Djiku</span><span className="dot">◆</span>
          <span>Thomas Partey</span><span className="dot">◆</span><span>Mohammed Kudus</span><span className="dot">◆</span><span>Fatawu Issahaku</span><span className="dot">◆</span><span className="dot">◆</span><span>Antoine Semenyo</span><span className="dot">◆</span><span>Jordan Ayew</span><span className="dot">◆</span><span>Ibrahim Sulemana</span><span className="dot">◆</span><span>Ibrahim Osman</span><span className="dot">◆</span><span>Ernest Nuamah</span><span className="dot">◆</span><span>Kamaldeen Sulemana</span><span className="dot">◆</span><span>Joseph Paintsil</span><span className="dot">◆</span><span>Inaki Williams</span><span className="dot">◆</span><span>Alexander Djiku</span><span className="dot">◆</span>
        </div>
      </div>

      {/* WHAT WE DO */}
      <section className="reveal">
        <div className="eyebrow">What We Do</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-xl)' }}>We Cover Every <span className="gold">Ghanaian.</span></h2>
        <p className="lead" style={{ marginBottom: 'var(--space-6xl)' }}>Every weekend we go through the matches and put together compilations of the Ghanaians who stood out. Goals, assists, saves and performances that deserved more attention. When the weekend is done we go back to the legends.</p>
        <div className="g-auto">
          <Card>
            <div style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-sm)' }}>⚽</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>Weekend Highlights</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>Goals, assists, saves and standout performances from Ghanaians playing abroad. Posted every weekend.</p>
            <div style={{ marginTop: 'var(--space-xl)' }}><Button asChild variant="ghost" size="sm"><Link to="/players">Current Players</Link></Button></div>
          </Card>
          <Card>
            <div style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-sm)' }}>📼</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>Legend Throwbacks</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>Ghana has had incredible players. We bring those moments back for a generation that never saw them.</p>
            <div style={{ marginTop: 'var(--space-xl)' }}><Button asChild variant="ghost" size="sm"><Link to="/legends">View Legends</Link></Button></div>
          </Card>
          <Card>
            <div style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-sm)' }}>🇬🇭</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>Black Stars</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>When Ghana play we cover everything. Lineups, live goals, individual player comps and a full breakdown.</p>
            <div style={{ marginTop: 'var(--space-xl)' }}><Button asChild variant="ghost" size="sm"><Link to="/blackstars">Black Stars Hub</Link></Button></div>
          </Card>
          <Card>
            <div style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-sm)' }}>💬</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>We Take Requests</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>Drop a player or game in our X comments. We work on every game we can access and we do it fast.</p>
            <div style={{ marginTop: 'var(--space-xl)' }}><Button asChild variant="ghost" size="sm"><a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">Find Us on X</a></Button></div>
          </Card>
        </div>
      </section>

      {/* OUR WORK SO FAR */}
      <section className="alt reveal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-2xl)', flexWrap: 'wrap', marginBottom: 'var(--space-5xl)' }}>
          <div><div className="eyebrow plain">Our Work So Far</div><h2 className="d2">Two Months. <span className="gold">Already Loud.</span></h2></div>
          <p className="lead" style={{ maxWidth: '280px', fontSize: 'var(--fs-base)', textAlign: 'right', marginTop: 'var(--space-2xs)' }}>There is a lot more where this came from.</p>
        </div>
        <div className="g-seam">
          <a href="https://x.com/Ghanacomps/status/2021318754206933129" target="_blank" rel="noopener" className="post-card">
            <div className="post-thumb"><img src="/assets/x_fatawu.jpg" alt="Fatawu vs Southampton" /><div className="post-badge">X</div><div className="post-overlay"><div className="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div></div>
            <div className="post-body"><div className="post-tag" style={{ color: 'var(--red)' }}>★ Biggest Post — 1.3M Views</div><div className="post-title">Fatawu Issahaku — Stunning Goal vs Southampton</div><p className="post-desc">The clip that put Ghana Comps on the map.</p><span className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2.5')}>Watch on X</span></div>
          </a>
          <a href="https://x.com/Ghanacomps/status/2028823927577817257" target="_blank" rel="noopener" className="post-card">
            <div className="post-thumb"><img src="/assets/x_essien.jpg" alt="Essien vs Italy 2006" /><div className="post-badge">X</div><div className="post-overlay"><div className="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div></div>
            <div className="post-body"><div className="post-tag">Legend</div><div className="post-title">Michael Essien vs Italy — 2006 World Cup</div><p className="post-desc">Essien saw this and reposted it on his TikTok and Facebook. Two months in and the legends were watching.</p><span className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2.5')}>Watch on X</span></div>
          </a>
          <a href="https://x.com/Ghanacomps/status/2029905846784655770" target="_blank" rel="noopener" className="post-card">
            <div className="post-thumb"><img src="/assets/x_abedi.jpg" alt="Abedi Pele vs Nigeria 1992" /><div className="post-badge">X</div><div className="post-overlay"><div className="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div></div>
            <div className="post-body"><div className="post-tag">Legend</div><div className="post-title">Abedi Pele vs Nigeria — 1992 AFCON</div><div className="post-stats">18K Views · 806 Likes</div><p className="post-desc">Ghana's greatest ever. The archive doing what it does.</p><span className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'mt-2.5')}>Watch on X</span></div>
          </a>
        </div>
        <div className="row-btns" style={{ marginTop: 'var(--space-4xl)' }}>
          <Button asChild variant="ghost"><Link to="/legends">Legends Archive</Link></Button>
          <Button asChild variant="ghost"><Link to="/players">Current Players</Link></Button>
        </div>
      </section>

      {/* FIND US */}
      <section className="reveal">
        <div className="eyebrow">Find Us Online</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-5xl)' }}>Follow the <span className="gold">Journey.</span></h2>
        <div className="g2">
          <div className="platform-card"><div className="plat-icon">𝕏</div><div className="plat-name">Twitter / X</div><div className="plat-handle">@Ghanacomps ✓ Verified</div><Button asChild><a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">Follow Now</a></Button></div>
          <div className="platform-card"><div className="plat-icon">🎵</div><div className="plat-name">TikTok</div><div className="plat-handle">@ghanacompss</div><Button asChild><a href="https://tiktok.com/@ghanacompss" target="_blank" rel="noopener">Follow Now</a></Button></div>
          <div className="platform-card"><div className="plat-icon">👥</div><div className="plat-name">Facebook</div><div className="plat-handle">Ghana Comps</div><Button asChild><a href="https://www.facebook.com/share/1GL7b1Qsuq/" target="_blank" rel="noopener">Follow Now</a></Button></div>
        </div>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
