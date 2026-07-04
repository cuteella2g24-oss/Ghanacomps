import { useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import { useAdmin } from '../contexts/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface Performer { caption: string; url: string; }
interface ExtraPlayer { id: string; name: string; club: string; league: string; label: string; }

const leagueLabels: Record<string, string> = {
  pl: 'Premier League', l1: 'Ligue 1', ll: 'La Liga', sa: 'Serie A',
  bl: 'Bundesliga', ch: 'Championship', ot: 'Other Leagues'
};

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
  const [performers, setPerformers] = useLocalStorage<Performer[]>('gc_performers', []);
  const [extraPlayers, setExtraPlayers] = useLocalStorage<ExtraPlayer[]>('gc_extra_players', []);
  const [showAddPerformer, setShowAddPerformer] = useState(false);
  const [perfCaption, setPerfCaption] = useState('');
  const [perfUrl, setPerfUrl] = useState('');

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

      <div className="page-header">
        <div className="eyebrow">Updated Every Weekend</div>
        <h1 className="d2">Current <span className="gold">Players.</span></h1>
        <p className="lead" style={{ marginTop: '10px' }}>Click any weekend performer card to watch the comp on X or TikTok.</p>
        <div className="filters" style={{ marginTop: '20px', marginBottom: 0 }}>
          {[['all','All'],['pl','Premier League'],['l1','Ligue 1'],['ll','La Liga'],['sa','Serie A'],['bl','Bundesliga'],['ch','Championship'],['ot','Other']].map(([lg, label]) => (
            <button key={lg} className={`f-btn${activeLeague === lg ? ' on' : ''}`} onClick={() => setActiveLeague(lg)}>{label}</button>
          ))}
        </div>
      </div>

      {/* WEEKEND PERFORMERS */}
      <section>
        <div className="eyebrow">This Weekend</div>
        <h2 className="d2" style={{ marginBottom: '16px' }}>Weekend <span className="gold">Performers.</span></h2>

        {performers.length > 0 ? (
          <div className="performers-grid">
            {performers.map((item, i) => (
              <div key={i} className="performer-card">
                <div className="performer-caption">{item.caption}</div>
                <a href={item.url} target="_blank" rel="noopener" className="performer-link">▶ Watch Now</a>
                {isAdmin && <button className="performer-remove" onClick={() => removePerformer(i)}>×</button>}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: '1px dashed rgb(var(--gold-rgb) / .2)', padding: '28px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--sub)', fontStyle: 'italic' }}>No performers added yet this week. Follow <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" style={{ color: 'var(--gold)' }}>@Ghanacomps on X</a> to see all the comps live.</p>
          </div>
        )}

        <div style={{ marginTop: '12px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="add-performer-btn" onClick={() => setShowAddPerformer(s => !s)}>+ Add Performer</button>
          <button className="clear-performers-btn" onClick={clearPerformers}>Clear All</button>
        </div>

        {isAdmin && showAddPerformer && (
          <div style={{ marginTop: '14px', padding: '18px', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
            <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>Add Performer Card</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input type="text" placeholder='Caption e.g. "Kudus vs Man City — Matchday 38"' value={perfCaption} onChange={e => setPerfCaption(e.target.value)} style={{ flex: 1, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: '8px 10px', fontSize: 'var(--fs-base)', borderRadius: '2px', fontFamily: 'var(--font-b)' }} />
              <input type="url" placeholder="X or TikTok post URL..." value={perfUrl} onChange={e => setPerfUrl(e.target.value)} style={{ flex: 1, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: '8px 10px', fontSize: 'var(--fs-base)', borderRadius: '2px', fontFamily: 'var(--font-b)' }} />
              <button onClick={addPerformer} className="btn primary" style={{ fontSize: 'var(--fs-2xs)', padding: '8px 16px' }}>Add Card</button>
              <button onClick={() => setShowAddPerformer(false)} className="btn outline" style={{ fontSize: 'var(--fs-2xs)', padding: '8px 16px' }}>Cancel</button>
            </div>
          </div>
        )}
      </section>

      {/* FULL SQUAD DIRECTORY */}
      <section className="alt">
        <div className="eyebrow">Full Squad Directory</div>
        <h2 className="d2" style={{ marginBottom: '8px' }}>Ghanaians <span className="gold">Playing Abroad.</span></h2>
        <p className="lead" style={{ marginBottom: '16px', fontSize: 'var(--fs-base)' }}>We track as many Ghanaians playing abroad as we can. If we are missing someone or a club is wrong, <Link to="/contact" style={{ color: 'var(--gold)' }}>contact us</Link> and we will update it.</p>

        <input type="text" className="search player-search" placeholder="Search player by name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ marginBottom: '20px' }} />

        <div className="g-auto">
          {staticPlayers.map(p => {
            const matchesLeague = activeLeague === 'all' || p.lg === activeLeague;
            const matchesSearch = !sq || p.name.toLowerCase().includes(sq);
            return (
              <div key={p.eid} className="player-card" data-lg={p.lg} style={{ display: matchesLeague && matchesSearch ? '' : 'none' }}>
                <div className="player-lg">{p.league}</div>
                <Editable tag="div" eid={`${p.eid}n`} className="player-name">{p.name}</Editable>
                <div className="player-meta" dangerouslySetInnerHTML={{ __html: p.meta }} />
              </div>
            );
          })}
          {extraPlayers.map((p, i) => {
            const matchesLeague = activeLeague === 'all' || p.league === activeLeague;
            const matchesSearch = !sq || p.name.toLowerCase().includes(sq);
            return (
              <div key={p.id} className="player-card" data-lg={p.league} style={{ display: matchesLeague && matchesSearch ? '' : 'none' }}>
                <div className="player-lg">{p.label}</div>
                <div className="player-name">{p.name}</div>
                <div className="player-meta">{p.club}</div>
                {isAdmin && <button onClick={() => removeExtra(i)} style={{ marginTop: '6px', background: 'var(--red)', color: '#fff', border: 'none', fontSize: 'var(--fs-2xs)', padding: '3px 8px', cursor: 'pointer', borderRadius: '2px' }}>Remove</button>}
              </div>
            );
          })}
        </div>

        <button className="add-player-btn" onClick={addPlayer}>+ Add New Player</button>
        <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--sub)', fontStyle: 'italic', marginTop: '14px', padding: '10px 14px', border: '1px solid var(--line)' }}>Missing a player or wrong club? <Link to="/contact" style={{ color: 'var(--gold)' }}>Contact us</Link> and we will update it.</p>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
