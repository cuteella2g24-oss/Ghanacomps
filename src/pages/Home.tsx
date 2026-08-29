import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import SportyIcon from '../components/SportyIcon';
import { useAdmin } from '../contexts/AdminContext';
import { useContentList } from '../contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import HighlightsSection from '../components/HighlightsSection';
import SocialStrip from '../components/SocialStrip';
import { type Clip, DEFAULT_HOME_HIGHLIGHTS } from '../data/clips';

type NewsTag = 'general' | 'injury' | 'transfer' | 'callup';

interface NewsItem {
  title: string;
  url: string;
  tag: NewsTag;
  image?: string;
  /** Attribution shown above the headline, B/R-style (e.g. "Fabrizio Romano"). */
  source?: string;
  /** Relative-time label the admin types by hand (e.g. "2d", "3h"). */
  time?: string;
  /** Optional leading emoji/icon before the headline (e.g. "🚨"). */
  emoji?: string;
  /** Sub-headline / dek that sits under the bold headline. */
  summary?: string;
}

export default function Home() {
  const { isAdmin } = useAdmin();
  const [news, setNews] = useContentList<NewsItem[]>('gc_news', []);
  const [highlights, setHighlights] = useContentList<Clip[]>('gc_highlights', DEFAULT_HOME_HIGHLIGHTS);
  const [newsTag, setNewsTag] = useState<NewsTag>('general');
  const [newsHeadline, setNewsHeadline] = useState('');
  const [newsUrl, setNewsUrl] = useState('');
  const [newsImage, setNewsImage] = useState('');
  const [newsSource, setNewsSource] = useState('');
  const [newsTime, setNewsTime] = useState('');
  const [newsEmoji, setNewsEmoji] = useState('');
  const [newsSummary, setNewsSummary] = useState('');

  function addNews() {
    if (!newsHeadline.trim()) { alert('Please enter a headline.'); return; }
    if (news.length >= 12) { alert('Maximum 12 headlines. Remove one first.'); return; }
    const item: NewsItem = { title: newsHeadline.trim(), url: newsUrl.trim(), tag: newsTag };
    if (newsImage.trim()) item.image = newsImage.trim();
    if (newsSource.trim()) item.source = newsSource.trim();
    if (newsTime.trim()) item.time = newsTime.trim();
    if (newsEmoji.trim()) item.emoji = newsEmoji.trim();
    if (newsSummary.trim()) item.summary = newsSummary.trim();
    setNews([...news, item]);
    setNewsHeadline('');
    setNewsUrl('');
    setNewsImage('');
    setNewsSource('');
    setNewsTime('');
    setNewsEmoji('');
    setNewsSummary('');
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

      {/* HERO — broadcast title card (static: chevron field kept, ambient video removed) */}
      <section className="gc-hero gc-chevrons loud">
        <div className="gc-hero-glow" />
        <div className="gc-hero-grid">
          <div className="reveal">
            <div className="gc-scorebug">
              <span className="live">Live</span>
              <Editable tag="span" eid="hero-eyebrow" className="meta">Ghana Comps — Ghanaian Football Archive</Editable>
            </div>
            <h1 className="gc-hero-title">
              <Editable tag="span" eid="hero-l1">Ghanaian</Editable><br />
              <Editable tag="span" eid="hero-l2" className="gold">Players</Editable><br />
              <Editable tag="span" eid="hero-l3" style={{ color: 'var(--green)' }}>Celebrated.</Editable>
            </h1>
            <Editable tag="p" eid="hero-para" className="gc-hero-lead">
              Goals. Assists. Saves. The ones everybody saw and the ones nobody talked about. Every Ghanaian. Every weekend. And when the weekend is done we go back to the legends.
            </Editable>
            <div className="gc-hero-actions">
              <span className="hero-follow">
                Follow us on
                <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" className="hero-follow-x" aria-label="Follow us on X">
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
              </span>
              <Button asChild variant="outline"><Link to="/about">Our Story</Link></Button>
            </div>
          </div>

          {/* NEWS PANEL — broadcast feed teaser (top 3 only; full grid lives below) */}
          <div className="reveal delay">
            <div className="gc-feed">
              <div className="gc-feed-h"><span className="gc-feed-dot" />Latest News</div>
              {news.length === 0 && (
                <p className="gc-feed-empty">No news yet. Add headlines via the admin panel.</p>
              )}
              {news.slice(0, 3).map((item, i) => {
                // Compact B/R-style rows: small thumbnail (when present) + text.
                const inner = (
                  <>
                    {item.image && (
                      <span className="gc-feed-thumb">
                        <img src={item.image} alt="" loading="lazy" decoding="async" />
                      </span>
                    )}
                    <span className="gc-feed-main">
                      <span className="gc-feed-top">
                        <span className={`gc-feed-tag ${item.tag}`}>{item.tag}</span>
                        {(item.source || item.time) && (
                          <span className="gc-feed-src">
                            {item.source}{item.source && item.time ? ' · ' : ''}{item.time}
                          </span>
                        )}
                      </span>
                      <span className="gc-feed-t">
                        {item.emoji && <span className="gc-feed-emoji">{item.emoji} </span>}
                        {item.title}
                      </span>
                    </span>
                  </>
                );
                return item.url ? (
                  <a key={i} href={item.url} target="_blank" rel="noopener" className="gc-feed-item">{inner}</a>
                ) : (
                  <div key={i} className="gc-feed-item">{inner}</div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* THE FEED — full-width B/R-style headlines grid (leads after the hero) */}
      <section className="reveal">
        <div className="gc-eyebrow">The Feed</div>
        <h2 className="gc-h2 tight">Latest <span className="gold">Headlines.</span></h2>
        {news.length === 0 ? (
          <p className="gc-feed-empty">No headlines yet. Add one via the admin panel.</p>
        ) : (
          <div className="gc-news-grid">
            {news.map((item, i) => (
              <div key={i} className={`gc-news-card${item.image ? '' : ' no-img'}`}>
                {item.image && (
                  <div className="gc-news-thumb">
                    <img src={item.image} alt="" loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="gc-news-body">
                  <div className="gc-news-meta">
                    <span className="gc-news-source">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                      </svg>
                      {item.source || 'Ghana Comps'}
                    </span>
                    {item.time && <span className="gc-news-time">{item.time}</span>}
                    <span className={`gc-feed-tag ${item.tag}`}>{item.tag}</span>
                    {isAdmin && (
                      <button
                        className="gc-news-remove"
                        aria-label="Remove headline"
                        onClick={e => { e.preventDefault(); e.stopPropagation(); removeNews(i); }}
                      >×</button>
                    )}
                  </div>
                  <div className="gc-news-headline">
                    {item.emoji && <span className="gc-news-emoji">{item.emoji}</span>}
                    {item.title}
                  </div>
                  {item.summary && <p className="gc-news-summary">{item.summary}</p>}
                </div>
                {item.url && (
                  <a
                    className="gc-news-hit"
                    href={item.url}
                    target="_blank"
                    rel="noopener"
                    aria-label={item.title}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {isAdmin && (
          <div className="gc-news-admin">
            <div className="gc-news-admin-h">Add News Headline</div>
            <p className="gc-news-admin-hint">
              Styled like a Bleacher Report card. Only the headline is required — everything
              else is optional. Leave the image out for a text-only row.
            </p>
            <div className="gc-news-admin-grid">
              <label className="gc-field">
                <span>Source</span>
                <input
                  type="text"
                  placeholder="e.g. Fabrizio Romano"
                  value={newsSource}
                  onChange={e => setNewsSource(e.target.value)}
                />
              </label>
              <label className="gc-field">
                <span>Time label</span>
                <input
                  type="text"
                  placeholder="e.g. 2d, 3h, Just now"
                  value={newsTime}
                  onChange={e => setNewsTime(e.target.value)}
                />
              </label>
              <label className="gc-field">
                <span>Category</span>
                <select
                  value={newsTag}
                  onChange={e => setNewsTag(e.target.value as NewsTag)}
                >
                  <option value="general">General</option>
                  <option value="injury">Injury</option>
                  <option value="transfer">Transfer</option>
                  <option value="callup">Call-up</option>
                </select>
              </label>
              <label className="gc-field">
                <span>Emoji / icon</span>
                <input
                  type="text"
                  placeholder="e.g. 🚨 ⚽ 🔴"
                  value={newsEmoji}
                  onChange={e => setNewsEmoji(e.target.value)}
                />
              </label>
              <label className="gc-field gc-field--full">
                <span>Headline <em>(required)</em></span>
                <input
                  type="text"
                  placeholder="e.g. KUDUS TO STAY AT SPURS"
                  value={newsHeadline}
                  onChange={e => setNewsHeadline(e.target.value)}
                />
              </label>
              <label className="gc-field gc-field--full">
                <span>Summary</span>
                <textarea
                  rows={2}
                  placeholder="One or two lines of detail shown under the headline…"
                  value={newsSummary}
                  onChange={e => setNewsSummary(e.target.value)}
                />
              </label>
              <label className="gc-field">
                <span>Link URL</span>
                <input
                  type="url"
                  placeholder="https://x.com/…"
                  value={newsUrl}
                  onChange={e => setNewsUrl(e.target.value)}
                />
              </label>
              <label className="gc-field">
                <span>Image URL</span>
                <input
                  type="url"
                  placeholder="https://…/photo.jpg"
                  value={newsImage}
                  onChange={e => setNewsImage(e.target.value)}
                />
              </label>
            </div>
            <div className="gc-news-admin-foot">
              <Button size="sm" onClick={addNews}>Add Headline</Button>
              <span className="gc-news-admin-count">{news.length} / 12 headlines</span>
            </div>
          </div>
        )}
      </section>

      {/* GPA PREVIEW — broadcast segment cards */}
      <section className="alt reveal">
        <Editable tag="div" eid="gpa-preview-eyebrow" className="gc-eyebrow">This Week on Ghanaian Players Abroad (GPA)</Editable>
        <h2 className="gc-h2 tight">The Weekly <span className="gold">Breakdown.</span></h2>
        <p className="lead" style={{ marginBottom: 0, fontSize: 'var(--fs-base)' }}>Updated every Monday.</p>
        <div className="gc-segcards">
          <div className="gc-segcard">
            <span className="gc-segcard-n">01</span>
            <span className="gc-sportcard-chip gc-sportcard-chip--sm"><SportyIcon name="tactics" /></span>
            <div className="gc-seglbl">Matchweek Review</div>
            <Editable tag="div" eid="h-mwr-n" className="gc-segname">Matchweek Review</Editable>
            <Editable tag="p" eid="h-mwr-b" className="gc-segbody">Our weekly breakdown of everything that happened in Ghanaian football. Updated every Monday.</Editable>
          </div>
          <div className="gc-segcard r">
            <span className="gc-segcard-n">02</span>
            <span className="gc-sportcard-chip gc-sportcard-chip--sm r"><SportyIcon name="boot" /></span>
            <div className="gc-seglbl r">Player of the Week</div>
            <Editable tag="div" eid="h-potw-n" className="gc-segname">Updated Monday</Editable>
            <Editable tag="p" eid="h-potw-b" className="gc-segbody">We watch every match and pick the one Ghanaian who stood tallest that week.</Editable>
          </div>
          <div className="gc-segcard gr">
            <span className="gc-segcard-n">03</span>
            <span className="gc-sportcard-chip gc-sportcard-chip--sm gr"><SportyIcon name="goal" /></span>
            <div className="gc-seglbl gr">Goal and Assist of the Week</div>
            <Editable tag="div" eid="h-gatw-n" className="gc-segname">Coming Monday</Editable>
            <Editable tag="p" eid="h-gatw-b" className="gc-segbody">Every week we pick the best Ghanaian goal and the most important assist.</Editable>
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
      <section className="reveal gc-wwd">
        <div className="eyebrow">What We Do</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-xl)' }}>We Cover Every <span className="gold">Ghanaian.</span></h2>
        <p className="lead" style={{ marginBottom: 'var(--space-6xl)' }}>Every weekend we go through the matches and put together compilations of the Ghanaians who stood out. Goals, assists, saves and performances that deserved more attention. When the weekend is done we go back to the legends.</p>
        <div className="gc-wwd-grid">
          <Card className="gc-glasscard">
            <span className="gc-sportcard-chip" style={{ marginBottom: 'var(--space-lg)' }}><SportyIcon name="ball" /></span>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>Weekend Highlights</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>Goals, assists, saves and standout performances from Ghanaians playing abroad. Posted every weekend.</p>
            <div className="mt-auto pt-[var(--space-xl)]"><Button asChild variant="ghost" size="sm"><Link to="/players">Current Players</Link></Button></div>
          </Card>
          <Card className="gc-glasscard">
            <span className="gc-sportcard-chip" style={{ marginBottom: 'var(--space-lg)' }}><SportyIcon name="trophy" /></span>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>Legend Throwbacks</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>Ghana has had incredible players. We bring those moments back for a generation that never saw them.</p>
            <div className="mt-auto pt-[var(--space-xl)]"><Button asChild variant="ghost" size="sm"><Link to="/legends">View Legends</Link></Button></div>
          </Card>
          <Card className="gc-glasscard">
            <span className="gc-sportcard-chip gr" style={{ marginBottom: 'var(--space-lg)' }}><SportyIcon name="stadium" /></span>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>Black Stars</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>When Ghana play we cover everything. Lineups, live goals, individual player comps and a full breakdown.</p>
            <div className="mt-auto pt-[var(--space-xl)]"><Button asChild variant="ghost" size="sm"><Link to="/blackstars">Black Stars Hub</Link></Button></div>
          </Card>
          <Card className="gc-glasscard">
            <span className="gc-sportcard-chip" style={{ marginBottom: 'var(--space-lg)' }}><SportyIcon name="whistle" /></span>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-semibold)', color: 'var(--white)', marginBottom: 'var(--space-xs)' }}>We Take Requests</div>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--body)', lineHeight: 'var(--lh-body)' }}>Drop a player or game in our X comments. We work on every game we can access and we do it fast.</p>
            <div className="mt-auto pt-[var(--space-xl)]"><Button asChild variant="ghost" size="sm"><a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">Find Us on X</a></Button></div>
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
            <div className="post-body"><div className="post-tag" style={{ color: 'var(--red)' }}>★ Biggest Post — 1.3M Views</div><div className="post-title">Fatawu Issahaku — Stunning Goal vs Southampton</div><p className="post-desc">The clip that put Ghana Comps on the map.</p><span className="post-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span></div>
          </a>
          <a href="https://x.com/Ghanacomps/status/2028823927577817257" target="_blank" rel="noopener" className="post-card">
            <div className="post-thumb"><img src="/assets/x_essien.jpg" alt="Essien vs Italy 2006" /><div className="post-badge">X</div><div className="post-overlay"><div className="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div></div>
            <div className="post-body"><div className="post-tag">Legend</div><div className="post-title">Michael Essien vs Italy — 2006 World Cup</div><p className="post-desc">Essien saw this and reposted it on his TikTok and Facebook. Two months in and the legends were watching.</p><span className="post-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span></div>
          </a>
          <a href="https://x.com/Ghanacomps/status/2029905846784655770" target="_blank" rel="noopener" className="post-card">
            <div className="post-thumb"><img src="/assets/x_abedi.jpg" alt="Abedi Pele vs Nigeria 1992" /><div className="post-badge">X</div><div className="post-overlay"><div className="play-btn"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></div></div></div>
            <div className="post-body"><div className="post-tag">Legend</div><div className="post-title">Abedi Pele vs Nigeria — 1992 AFCON</div><div className="post-stats">18K Views · 806 Likes</div><p className="post-desc">Ghana's greatest ever. The archive doing what it does.</p><span className="post-play" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span></div>
          </a>
        </div>
        <div className="row-btns" style={{ marginTop: 'var(--space-4xl)' }}>
          <Button asChild variant="ghost"><Link to="/legends">Legends Archive</Link></Button>
          <Button asChild variant="ghost"><Link to="/players">Current Players</Link></Button>
        </div>
      </section>

      {/* HIGHLIGHTS — self-hosted video tiles (VIDEO_DESIGN_SPEC §3 Home 2).
          Hidden entirely until the admin adds clips; admins still see it (with
          the empty state + add panel) so they can populate it. */}
      {(highlights.length > 0 || isAdmin) && (
        <HighlightsSection
          eyebrow="Highlights"
          headingLead="The Best of the"
          headingGold="Weekend."
          clips={highlights}
          onChange={setHighlights}
        />
      )}

      {/* SOCIAL — the only place raw X/TikTok embeds live (§3 Home 3) */}
      <SocialStrip />

      <Footer />
      <Stripe />
    </>
  );
}
