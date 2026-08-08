import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import { useAdmin } from '../contexts/AdminContext';
import { useContentList } from '../contexts/ContentContext';
import { Button } from '@/components/ui/button';
import VideoCard from '../components/VideoCard';
import { type Clip, DEFAULT_PERFORMER_CLIPS } from '../data/clips';

interface Performer { caption: string; url: string; }
interface ExtraPlayer { id: string; name: string; club: string; league: string; label: string; }
interface PlayerNews { title: string; detail: string; tag: 'transfer' | 'injury' | 'callup' | 'general'; }

const leagueLabels: Record<string, string> = {
  pl: 'Premier League', l1: 'Ligue 1', ll: 'La Liga', sa: 'Serie A',
  bl: 'Bundesliga', ch: 'Championship', ot: 'Other Leagues'
};

// Single source of truth for the six named-league crests. Reused by both the
// filter-bar chips and the per-row ledger tags so the path strings live once.
// 'ot' has no crest and is intentionally absent.
const leagueBadges: Record<string, string> = {
  pl: '/assets/leagues/pl.svg',
  l1: '/assets/leagues/l1.svg',
  ll: '/assets/leagues/ll.svg',
  sa: '/assets/leagues/sa.svg',
  bl: '/assets/leagues/bl.svg',
  ch: '/assets/leagues/ch.svg',
};

// Filter bar: [code, label]. Named leagues show an official crest on a neutral
// chip above the title (looked up in leagueBadges); All/Other stay text-only.
const leagueFilters: [string, string][] = [
  ['all', 'All'],
  ['pl', 'Premier League'],
  ['l1', 'Ligue 1'],
  ['ll', 'La Liga'],
  ['sa', 'Serie A'],
  ['bl', 'Bundesliga'],
  ['ch', 'Championship'],
  ['ot', 'Other'],
];

const staticPlayers = [
  { eid: 'p1', lg: 'pl', league: 'Premier League', name: 'Mohammed Kudus', meta: 'Tottenham<s>·</s>MF' },
  { eid: 'p2', lg: 'pl', league: 'Premier League', name: 'Antoine Semenyo', meta: 'Manchester City<s>·</s>FW' },
  { eid: 'p3', lg: 'l1', league: 'Ligue 1', name: 'Ernest Nuamah', meta: 'Olympique Lyon<s>·</s>FW' },
  { eid: 'p4', lg: 'l1', league: 'Ligue 1', name: 'Alidu Seidu', meta: 'Stade Rennes<s>·</s>DF' },
  { eid: 'p5', lg: 'l1', league: 'Ligue 1', name: 'Salis Abdul Samed', meta: 'OGC Nice<s>·</s>MF' },
  { eid: 'p6', lg: 'l1', league: 'Ligue 1', name: 'Kojo Peprah Oppong', meta: 'OGC Nice<s>·</s>DF' },
  { eid: 'p7', lg: 'l1', league: 'Ligue 1', name: 'Gideon Mensah', meta: 'AJ Auxerre<s>·</s>DF' },
  { eid: 'p8', lg: 'l1', league: 'Ligue 1', name: 'Elisha Owusu', meta: 'AJ Auxerre<s>·</s>MF' },
  { eid: 'p9', lg: 'l1', league: 'Ligue 1', name: 'Marvin Senaya', meta: 'AJ Auxerre<s>·</s>DF' },
  { eid: 'p10', lg: 'l1', league: 'Ligue 1', name: 'Abu Francis', meta: 'Toulouse<s>·</s>MF' },
  { eid: 'p11', lg: 'l1', league: 'Ligue 1', name: 'Mohammed Salisu', meta: 'AS Monaco<s>·</s>DF' },
  { eid: 'p12', lg: 'll', league: 'La Liga', name: 'Thomas Partey', meta: 'Villarreal CF<s>·</s>MF' },
  { eid: 'p13', lg: 'll', league: 'La Liga', name: 'Inaki Williams', meta: 'Athletic Bilbao<s>·</s>FW' },
  { eid: 'p14', lg: 'll', league: 'La Liga', name: 'Abdul Mumin', meta: 'Rayo Vallecano<s>·</s>DF' },
  { eid: 'p15', lg: 'll', league: 'La Liga', name: 'Kwasi Sibo', meta: 'Real Oviedo<s>·</s>MF' },
  { eid: 'p16', lg: 'sa', league: 'Serie A', name: 'Kamaldeen Sulemana', meta: 'Atalanta<s>·</s>FW' },
  { eid: 'p17', lg: 'sa', league: 'Serie A', name: 'Ibrahim Sulemana', meta: 'Cagliari<s>·</s>MF' },
  { eid: 'p18', lg: 'sa', league: 'Serie A', name: 'Caleb Ekuban', meta: 'Genoa<s>·</s>FW' },
  { eid: 'p19', lg: 'sa', league: 'Serie A', name: 'Alfred Duncan', meta: 'Venezia<s>·</s>MF' },
  { eid: 'p20', lg: 'bl', league: 'Bundesliga', name: 'Jonas Adjetey', meta: 'VfL Wolfsburg<s>·</s>DF' },
  { eid: 'p21', lg: 'bl', league: 'Bundesliga', name: 'Ransford Yeboah', meta: 'Hamburger SV<s>·</s>FW' },
  { eid: 'p22', lg: 'bl', league: 'Bundesliga', name: 'Derrick Kohn', meta: 'Union Berlin<s>·</s>DF' },
  { eid: 'p23', lg: 'ch', league: 'Championship', name: 'Jordan Ayew', meta: 'Leicester City<s>·</s>FW' },
  { eid: 'p24', lg: 'ch', league: 'Championship', name: 'Abdul Fatawu Issahaku', meta: 'Leicester City<s>·</s>FW' },
  { eid: 'p25', lg: 'ch', league: 'Championship', name: 'Ibrahim Osman', meta: 'Birmingham City<s>·</s>FW' },
  { eid: 'p26', lg: 'ch', league: 'Championship', name: 'Brandon Thomas Asante', meta: 'Coventry City<s>·</s>FW' },
  { eid: 'p27', lg: 'ch', league: 'Championship', name: 'Forson Amankwah', meta: 'Norwich City<s>·</s>MF' },
  { eid: 'p28', lg: 'ot', league: 'Other Leagues', name: 'Alexander Djiku', meta: 'Fenerbahce<s>·</s>DF' },
  { eid: 'p29', lg: 'ot', league: 'Other Leagues', name: 'Jerome Opoku', meta: 'Basaksehir<s>·</s>DF' },
  { eid: 'p30', lg: 'ot', league: 'Other Leagues', name: 'Caleb Yirenkyi', meta: 'Nordsjaelland<s>·</s>MF' },
  { eid: 'p31', lg: 'ot', league: 'Other Leagues', name: 'Christopher Bonsu Baah', meta: 'Al Qadsiah<s>·</s>FW' },
  { eid: 'p32', lg: 'ot', league: 'Other Leagues', name: 'Joseph Paintsil', meta: 'LA Galaxy<s>·</s>FW' },
  { eid: 'p33', lg: 'ot', league: 'Other Leagues', name: 'Lawrence Ati-Zigi', meta: 'FC St. Gallen<s>·</s>GK' },
  { eid: 'p34', lg: 'ot', league: 'Other Leagues', name: 'Majeed Ashimeru', meta: 'RAAL La Louviere<s>·</s>MF' },
  { eid: 'p35', lg: 'ot', league: 'Other Leagues', name: 'Abdul Rahman Baba', meta: 'PAOK<s>·</s>DF' },
  { eid: 'p36', lg: 'ot', league: 'Other Leagues', name: 'Andrew Ayew', meta: 'NAC Breda<s>·</s>FW' },
  { eid: 'p37', lg: 'ot', league: 'Other Leagues', name: 'Kamal Sowah', meta: 'NAC Breda<s>·</s>MF' },
  { eid: 'p38', lg: 'ot', league: 'Other Leagues', name: 'Patric Pfeiffer', meta: 'Darmstadt<s>·</s>DF' },
  { eid: 'p39', lg: 'ot', league: 'Other Leagues', name: 'Ibrahim Sadiq', meta: 'AZ Alkmaar<s>·</s>FW' },
  { eid: 'p40', lg: 'ot', league: 'Other Leagues', name: 'Jerry Afriyie', meta: 'RAAL La Louviere<s>·</s>FW' },
  { eid: 'p41', lg: 'ot', league: 'Other Leagues', name: 'Mohammed Fuseini', meta: 'Royale Union SG<s>·</s>FW' },
  { eid: 'p42', lg: 'ot', league: 'Other Leagues', name: 'Prince Amoako Jnr', meta: 'Nordsjaelland<s>·</s>FW' },
  { eid: 'p43', lg: 'ot', league: 'Other Leagues', name: 'Prince Kwabena Adu', meta: 'Viktoria Plzen<s>·</s>FW' },
  { eid: 'p44', lg: 'ot', league: 'Other Leagues', name: 'Felix Afena Gyan', meta: 'Amed Sportif<s>·</s>FW' },
  { eid: 'p45', lg: 'ot', league: 'Other Leagues', name: 'Joseph Anang', meta: 'St. Patricks Athletic<s>·</s>GK' },
  { eid: 'p46', lg: 'ot', league: 'Other Leagues', name: 'Derrick Luckassen', meta: 'Pafos FC<s>·</s>DF' },
  { eid: 'p47', lg: 'ot', league: 'Other Leagues', name: 'Daniel Agyei', meta: 'Kocaelispor<s>·</s>FW' },
  { eid: 'p48', lg: 'ot', league: 'Other Leagues', name: 'Augustine Boakye', meta: 'Saint Etienne<s>·</s>FW' },
  { eid: 'p49', lg: 'ot', league: 'Other Leagues', name: 'Lawrence Agyekum', meta: 'Cercle Brugge<s>·</s>MF' },
];

export default function Players() {
  const { isAdmin } = useAdmin();
  const [activeLeague, setActiveLeague] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [performers, setPerformers] = useContentList<Performer[]>('gc_performers', []);
  const [extraPlayers, setExtraPlayers] = useContentList<ExtraPlayer[]>('gc_extra_players', []);
  const [playerNews, setPlayerNews] = useContentList<PlayerNews[]>('gc_player_news', []);
  const [showAddPerformer, setShowAddPerformer] = useState(false);
  const [perfCaption, setPerfCaption] = useState('');
  const [perfUrl, setPerfUrl] = useState('');
  const [pnTitle, setPnTitle] = useState('');
  const [pnDetail, setPnDetail] = useState('');
  const [pnTag, setPnTag] = useState<PlayerNews['tag']>('transfer');

  function addPlayerNews() {
    if (!pnTitle.trim()) { alert('Please enter a headline.'); return; }
    setPlayerNews([{ title: pnTitle.trim(), detail: pnDetail.trim(), tag: pnTag }, ...playerNews]);
    setPnTitle('');
    setPnDetail('');
  }

  function removePlayerNews(i: number) {
    const updated = [...playerNews];
    updated.splice(i, 1);
    setPlayerNews(updated);
  }

  function addPerformer() {
    if (!perfCaption.trim() || !perfUrl.trim()) { alert('Please fill in both the caption and the URL.'); return; }
    if (performers.length >= 8) { alert('Maximum 8 performers. Clear some first.'); return; }
    setPerformers([...performers, { caption: perfCaption.trim(), url: perfUrl.trim() }]);
    setPerfCaption('');
    setPerfUrl('');
    setShowAddPerformer(false);
  }

  function removePerformer(i: number) {
    const updated = [...performers];
    updated.splice(i, 1);
    setPerformers(updated);
  }

  function clearPerformers() {
    if (confirm('Clear all performer cards for this week?')) setPerformers([]);
  }

  function addPlayer() {
    const name = prompt('Player name:');
    if (!name) return;
    const club = prompt('Club and position (e.g. Tottenham · MF):') || '';
    const league = prompt('League code (pl/l1/ll/sa/bl/ch/ot):') || 'ot';
    const id = 'extra' + Date.now();
    setExtraPlayers([...extraPlayers, { id, name, club, league, label: leagueLabels[league] || 'Other Leagues' }]);
  }

  function removeExtra(i: number) {
    const updated = [...extraPlayers];
    updated.splice(i, 1);
    setExtraPlayers(updated);
  }

  const sq = searchQuery.toLowerCase().trim();

  return (
    <>
      <Stripe />
      <Nav />

      <div className="gc-pagehead gc-chevrons medium reveal">
        <div className="gc-pagehead-inner">
          <div className="gc-scorebug">
            <span className="live">Updated Every Weekend</span>
          </div>
          <h1 className="gc-ph-title">Current <span className="gold">Players.</span></h1>
          <p className="gc-ph-lead">Click any weekend performer card to watch the comp on X or TikTok.</p>
          <div className="filters" style={{ marginTop: 'var(--space-4xl)', marginBottom: 0 }}>
            {leagueFilters.map(([lg, label]) => {
              const badge = leagueBadges[lg];
              return (
                <button
                  key={lg}
                  className={`f-btn${badge ? ' f-btn-badge' : ''}${activeLeague === lg ? ' on' : ''}`}
                  onClick={() => setActiveLeague(lg)}
                >
                  {badge && (
                    <span className="f-btn-crest">
                      <img src={badge} alt="" aria-hidden="true" />
                    </span>
                  )}
                  <span className="f-btn-label">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* TRANSFERS & UPDATES — admin-managed player news, persisted server-side */}
      {(playerNews.length > 0 || isAdmin) && (
        <section className="reveal">
          <div className="gc-eyebrow">Latest</div>
          <h2 className="gc-h2" style={{ marginBottom: 'var(--space-2xl)' }}>Transfers &amp; <span className="gold">Updates.</span></h2>

          {playerNews.length > 0 ? (
            <div className="gc-updates">
              {playerNews.map((n, i) => (
                <div key={i} className="gc-update-row">
                  <span className={`gc-feed-tag ${n.tag}`}>{n.tag}</span>
                  <div className="gc-update-main">
                    <div className="gc-update-t">{n.title}</div>
                    {n.detail && <p className="gc-update-b">{n.detail}</p>}
                  </div>
                  {isAdmin && <button className="gc-entry-remove" onClick={() => removePlayerNews(i)}>Remove</button>}
                </div>
              ))}
            </div>
          ) : (
            <p className="lead" style={{ fontSize: 'var(--fs-base)' }}>No updates yet this week.</p>
          )}

          {isAdmin && (
            <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-3xl)', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
              <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>Add Update</div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={pnTag} onChange={e => setPnTag(e.target.value as PlayerNews['tag'])} style={{ background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }}>
                  <option value="transfer">Transfer</option>
                  <option value="injury">Injury</option>
                  <option value="callup">Call-up</option>
                  <option value="general">General</option>
                </select>
                <input type="text" placeholder="Headline e.g. Kudus joins new club" value={pnTitle} onChange={e => setPnTitle(e.target.value)} style={{ flex: 1, minWidth: '180px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
                <input type="text" placeholder="Detail (optional)..." value={pnDetail} onChange={e => setPnDetail(e.target.value)} style={{ flex: 2, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
                <Button size="sm" onClick={addPlayerNews}>Add</Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* WEEKEND PERFORMERS */}
      <section className="reveal">
        <div className="gc-eyebrow">This Weekend</div>
        <h2 className="gc-h2" style={{ marginBottom: 'var(--space-2xl)' }}>Weekend <span className="gold">Performers.</span></h2>

        {performers.length > 0 ? (
          <div className="performers-grid">
            {performers.map((item, i) => {
              // Phone-shot vertical clip per card (§3 Players). Placeholder clips
              // cycle the default pool; the lightbox caption + attribution use
              // the performer's own caption/url. Drop a real MP4 at the clip's
              // slug path to swap it in (see the video README).
              const base = DEFAULT_PERFORMER_CLIPS[i % DEFAULT_PERFORMER_CLIPS.length];
              const clip: Clip = { ...base, title: item.caption, originalUrl: item.url };
              return (
                <div key={i} className="performer-card">
                  <VideoCard clip={clip} size="sm" showCaption={false} />
                  <div className="performer-caption" style={{ marginTop: 'var(--space-md)' }}>{item.caption}</div>
                  <a href={item.url} target="_blank" rel="noopener" className="performer-link">▶ Watch Now</a>
                  {isAdmin && <button className="performer-remove" onClick={() => removePerformer(i)}>×</button>}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ border: '1px dashed rgb(var(--gold-rgb) / .2)', padding: 'var(--space-6xl) var(--space-4xl)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--sub)', fontStyle: 'italic' }}>No performers added yet this week. Follow <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>@Ghanacomps on X</a> to see all the comps live.</p>
          </div>
        )}

        <div style={{ marginTop: 'var(--space-lg)', display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="add-performer-btn" onClick={() => setShowAddPerformer(s => !s)}>+ Add Performer</button>
          <button className="clear-performers-btn" onClick={clearPerformers}>Clear All</button>
        </div>

        {isAdmin && showAddPerformer && (
          <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-3xl)', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
            <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 'var(--space-md)' }}>Add Performer Card</div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
              <input type="text" placeholder='Caption e.g. "Kudus vs Man City — Matchday 38"' value={perfCaption} onChange={e => setPerfCaption(e.target.value)} style={{ flex: 1, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-base)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
              <input type="url" placeholder="X or TikTok post URL..." value={perfUrl} onChange={e => setPerfUrl(e.target.value)} style={{ flex: 1, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-base)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
              <Button size="sm" onClick={addPerformer}>Add Card</Button>
              <Button variant="outline" size="sm" onClick={() => setShowAddPerformer(false)}>Cancel</Button>
            </div>
          </div>
        )}
      </section>

      {/* FULL SQUAD DIRECTORY — A ruled two-column ledger index */}
      <section className="alt reveal">
        <div className="gc-rule">
          <h2 className="gc-rule-l">Ghanaians <span className="gold">Playing Abroad.</span></h2>
          <span className="gc-rule-r">Full Squad Directory</span>
        </div>
        <p className="lead" style={{ marginBottom: 'var(--space-2xl)', fontSize: 'var(--fs-base)' }}>We track as many Ghanaians playing abroad as we can. If we are missing someone or a club is wrong, <Link to="/contact" style={{ color: 'var(--gold)' }}>contact us</Link> and we will update it.</p>

        <input type="text" className="search player-search" placeholder="Search player by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: 'var(--space-4xl)' }} />

        <div className="gc-ledger">
          {staticPlayers.map((p, i) => {
            const matchesLeague = activeLeague === 'all' || p.lg === activeLeague;
            const matchesSearch = !sq || p.name.toLowerCase().includes(sq);
            return (
              <div key={p.eid} className="gc-entry" data-lg={p.lg} style={{ display: matchesLeague && matchesSearch ? '' : 'none' }}>
                <span className="gc-idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="gc-entry-main">
                  <Editable tag="span" eid={`${p.eid}n`} className="gc-entry-name">{p.name}</Editable>
                  <Editable tag="div" eid={`${p.eid}m`} className="gc-entry-meta">{p.meta}</Editable>
                </span>
                <span className={`gc-entry-lg ${p.lg}`}>
                  {leagueBadges[p.lg] ? (
                    <span className="gc-entry-crest">
                      <img src={leagueBadges[p.lg]} alt={p.league} title={p.league} />
                    </span>
                  ) : (
                    p.league
                  )}
                </span>
              </div>
            );
          })}
          {extraPlayers.map((p, i) => {
            const matchesLeague = activeLeague === 'all' || p.league === activeLeague;
            const matchesSearch = !sq || p.name.toLowerCase().includes(sq);
            return (
              <div key={p.id} className="gc-entry" data-lg={p.league} style={{ display: matchesLeague && matchesSearch ? '' : 'none' }}>
                <span className="gc-idx">{String(staticPlayers.length + i + 1).padStart(2, '0')}</span>
                <span className="gc-entry-main">
                  <span className="gc-entry-name">{p.name}</span>
                  <div className="gc-entry-meta">{p.club}</div>
                  {isAdmin && <button className="gc-entry-remove" onClick={() => removeExtra(i)}>Remove</button>}
                </span>
                <span className={`gc-entry-lg ${p.league}`}>
                  {leagueBadges[p.league] ? (
                    <span className="gc-entry-crest">
                      <img src={leagueBadges[p.league]} alt={p.label} title={p.label} />
                    </span>
                  ) : (
                    p.label
                  )}
                </span>
              </div>
            );
          })}
        </div>

        <button className="add-player-btn" onClick={addPlayer}>+ Add New Player</button>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--sub)', fontStyle: 'italic', marginTop: 'var(--space-xl)', padding: 'var(--space-md) var(--space-xl)', border: '1px solid var(--line)' }}>Missing a player or wrong club? <Link to="/contact" style={{ color: 'var(--gold)' }}>Contact us</Link> and we will update it.</p>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
