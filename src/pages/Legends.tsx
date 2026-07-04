import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import { useAdmin } from '../contexts/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ExtraComp { title: string; url: string; stats: string; }
interface ExtraLegend { name: string; era: string; pos: string; pos_display: string; bio: string; comps: ExtraComp[]; quote: string; }

const ERA_COLORS = ['g', 'r', 'gr'];

export default function Legends() {
  const { isAdmin } = useAdmin();
  const [filterPos, setFilterPos] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [extraLegends, setExtraLegends] = useLocalStorage<ExtraLegend[]>('gc_extra_legends', []);
  const [extraCult, setExtraCult] = useLocalStorage<ExtraLegend[]>('gc_extra_cult', []);

  function addLegend() {
    const name = prompt('Legend name:'); if (!name) return;
    const era = prompt('Era label (e.g. 2000s to 2010s):') || 'Legend';
    const pos_display = prompt('Position · Club (e.g. Midfielder · Chelsea):') || '';
    const pos = prompt('Filter type (midfielder / striker / goalkeeper):') || 'midfielder';
    const bio = prompt('Bio (short paragraph):') || '';
    const comp_title = prompt('First comp title (e.g. vs Italy — 2006 World Cup):') || '';
    const comp_url = prompt('X or TikTok URL for that comp:') || '#';
    const comp_stats = prompt('Comp stats (e.g. 265K Views · 3.7K Likes) — leave blank if none:') || '';
    const quote = prompt('Quote (bottom of card):') || '';
    setExtraLegends([...extraLegends, { name, era, pos, pos_display, bio, comps: [{ title: comp_title, url: comp_url, stats: comp_stats }], quote }]);
  }

  function removeLegend(i: number) {
    if (!confirm('Remove this legend?')) return;
    const updated = [...extraLegends];
    updated.splice(i, 1);
    setExtraLegends(updated);
  }

  function addCultHero() {
    const name = prompt('Cult hero name:'); if (!name) return;
    const era = prompt('Era label:') || 'Cult Hero';
    const pos_display = prompt('Position · Club:') || '';
    const pos = prompt('Filter type (midfielder/striker/goalkeeper):') || 'striker';
    const bio = prompt('Bio:') || '';
    const comp_title = prompt('Comp title:') || '';
    const comp_url = prompt('X or TikTok URL:') || '#';
    const quote = prompt('Quote:') || '';
    setExtraCult([...extraCult, { name, era, pos, pos_display, bio, comps: [{ title: comp_title, url: comp_url, stats: '' }], quote }]);
  }

  function removeCult(i: number) {
    if (!confirm('Remove this cult hero?')) return;
    const updated = [...extraCult];
    updated.splice(i, 1);
    setExtraCult(updated);
  }

  const sq = searchQuery.toLowerCase().trim();

  function cardVisible(pos: string, name: string) {
    const posOk = filterPos === 'all' || pos === filterPos;
    const nameOk = !sq || name.toLowerCase().includes(sq);
    return posOk && nameOk;
  }

  return (
    <>
      <Stripe />
      <Nav />

      <div className="page-header">
        <Editable tag="div" eid="leg-eyebrow" className="eyebrow">Growing Every Week</Editable>
        <h1 className="d2">Legends We Have <span className="gold">Honoured.</span></h1>
        <Editable tag="p" eid="leg-intro" className="lead" style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-4xl)' }}>Every legend we have covered so far. Click any comp to watch it on X.</Editable>
        <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" className="search" placeholder="Search legends..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <div className="filters" style={{ marginBottom: 0 }}>
          {[['all','All'],['midfielder','Midfielders'],['striker','Strikers'],['goalkeeper','Goalkeepers']].map(([pos, label]) => (
            <button key={pos} className={`f-btn${filterPos === pos ? ' on' : ''}`} onClick={() => setFilterPos(pos)}>{label}</button>
          ))}
        </div>
      </div>

      <section>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 'var(--space-3xs)', background: 'var(--line)' }}>

          {/* Abedi Pele */}
          <div className="legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'abedi pele') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l1-era" className="era-pill g">1980s to 1990s</Editable>
              <Editable tag="div" eid="l1-name" className="lc-name">Abedi Pelé</Editable>
              <Editable tag="div" eid="l1-pos" className="lc-pos">Attacking Midfielder · Marseille, Lyon</Editable>
              <Editable tag="p" eid="l1-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>Three time African Footballer of the Year. Ghana has never produced a player quite like him. A wizard in every sense of the word.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2029905846784655770" target="_blank" rel="noopener" className="comp-row-link">
                <div><Editable tag="div" eid="l1-c1" className="comp-row-t">vs Nigeria — 1992 AFCON Semi Final</Editable><Editable tag="div" eid="l1-c1s" className="comp-row-s">18K Views · 806 Likes</Editable></div>
                <span className="watch-tag">▶ Watch on X</span>
              </a>
            </div>
            <Editable tag="div" eid="l1-quote" className="lc-quote">"Ghana's greatest football player of all time?" — 18K views</Editable>
          </div>

          {/* Michael Essien */}
          <div className="legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'michael essien') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l2-era" className="era-pill r">2000s to 2010s</Editable>
              <Editable tag="div" eid="l2-name" className="lc-name">Michael Essien</Editable>
              <Editable tag="div" eid="l2-pos" className="lc-pos">Midfielder · Chelsea, Real Madrid</Editable>
              <div className="lc-badge">★ Acknowledged on TikTok and Facebook</div>
              <Editable tag="p" eid="l2-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>The Bison. One of the most complete midfielders in the world at his peak. Box to box, physical, technical and always in the right place.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2028823927577817257" target="_blank" rel="noopener" className="comp-row-link">
                <div><Editable tag="div" eid="l2-c1" className="comp-row-t">vs Italy — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l2-c1s" className="comp-row-s">265K Views · 3.7K Likes</Editable></div>
                <span className="watch-tag">▶ Watch on X</span>
              </a>
            </div>
            <Editable tag="div" eid="l2-quote" className="lc-quote">"Keeping the Ghanaian midfielders legacy alive" — fan on X</Editable>
          </div>

          {/* Asamoah Gyan */}
          <div className="legend-card" data-pos="striker" style={{ display: cardVisible('striker', 'asamoah gyan') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l3-era" className="era-pill gr">2000s to 2010s</Editable>
              <Editable tag="div" eid="l3-name" className="lc-name">Asamoah Gyan</Editable>
              <Editable tag="div" eid="l3-pos" className="lc-pos">Striker · Sunderland, Al Ain</Editable>
              <Editable tag="p" eid="l3-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>Ghana's all time top scorer. The goal machine. Powerful, direct and clinical. He carried Ghana on his back for years.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2031388723254886504" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l3-c1" className="comp-row-t">vs Germany — 2014 FIFA World Cup</Editable><Editable tag="div" eid="l3-c1s" className="comp-row-s">19K Views · 385 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              <a href="https://x.com/Ghanacomps/status/2029631065623527881" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l3-c2" className="comp-row-t">vs Czech Republic — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l3-c2s" className="comp-row-s">15K Views · 711 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              <a href="https://x.com/Ghanacomps/status/2024453540370931908" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l3-c3" className="comp-row-t">vs Egypt — 2014 WC Qualifiers at Baba Yara</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="l3-quote" className="lc-quote">"He had it all. What would prime Gyan be worth today?"</Editable>
          </div>

          {/* Stephen Appiah */}
          <div className="legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'stephen appiah') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l4-era" className="era-pill g">1990s to 2000s</Editable>
              <Editable tag="div" eid="l4-name" className="lc-name">Stephen Appiah</Editable>
              <Editable tag="div" eid="l4-pos" className="lc-pos">Midfielder · Juventus, Fenerbahce</Editable>
              <Editable tag="p" eid="l4-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>Captain Fantastic. The man who led Ghana to their first ever World Cup in 2006. Elegant, intelligent and everything you want in a leader.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2033504111916707972" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l4-c1" className="comp-row-t">vs Italy — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l4-c1s" className="comp-row-s">29K Views · 1.1K Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="l4-quote" className="lc-quote">"Captain's performance" — 29K views</Editable>
          </div>

          {/* Kwadwo Asamoah */}
          <div className="legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'kwadwo asamoah') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l5-era" className="era-pill r">2000s to 2010s</Editable>
              <Editable tag="div" eid="l5-name" className="lc-name">Kwadwo Asamoah</Editable>
              <Editable tag="div" eid="l5-pos" className="lc-pos">Midfielder · Juventus, Inter Milan</Editable>
              <Editable tag="p" eid="l5-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>One of the most versatile players Ghana has ever produced. His display against Uruguay at the 2010 World Cup is still talked about.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2027132060452683814" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l5-c1" className="comp-row-t">vs Uruguay — 2010 World Cup Quarter Final</Editable><Editable tag="div" eid="l5-c1s" className="comp-row-s">30K Views · 878 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              <a href="https://x.com/Ghanacomps/status/2024796549763527166" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l5-c2" className="comp-row-t">vs USA — 2010 World Cup Round of 16</Editable><Editable tag="div" eid="l5-c2s" className="comp-row-s">32K Views · 751 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="l5-quote" className="lc-quote">"Which current Black Stars player reflects this profile?"</Editable>
          </div>

          {/* Anthony Annan */}
          <div className="legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'anthony annan') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l6-era" className="era-pill gr">2000s to 2010s</Editable>
              <Editable tag="div" eid="l6-name" className="lc-name">Anthony Annan</Editable>
              <Editable tag="div" eid="l6-pos" className="lc-pos">Defensive Midfielder · Schalke, Rosenborg</Editable>
              <Editable tag="p" eid="l6-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>Our biggest legend comp. 76K views. The football world went back and remembered just how good he was against Uruguay at the 2010 World Cup.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2026357491534045582" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l6-c1" className="comp-row-t">vs Uruguay — 2010 FIFA World Cup Quarter Finals</Editable><Editable tag="div" eid="l6-c1s" className="comp-row-s">76K Views · 1.1K Likes · 263 Reposts</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="l6-quote" className="lc-quote">76K views · 263 reposts · Our biggest legend comp</Editable>
          </div>

          {/* Richard Kingson */}
          <div className="legend-card" data-pos="goalkeeper" style={{ display: cardVisible('goalkeeper', 'richard kingson') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l7-era" className="era-pill g">2000s</Editable>
              <Editable tag="div" eid="l7-name" className="lc-name">Richard Kingson</Editable>
              <Editable tag="div" eid="l7-pos" className="lc-pos">Goalkeeper · Blackpool, Birmingham City</Editable>
              <Editable tag="p" eid="l7-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>Olele. One of the most loved goalkeepers in Ghana's history. His performance against Italy at the 2006 World Cup showed exactly what he was capable of.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2031072162723897579" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l7-c1" className="comp-row-t">vs Italy — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l7-c1s" className="comp-row-s">35K Views · 1K Likes · 155 Reposts</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="l7-quote" className="lc-quote">35K views · 155 reposts · 1K likes</Editable>
          </div>

          {/* Fatau Dauda */}
          <div className="legend-card" data-pos="goalkeeper" style={{ display: cardVisible('goalkeeper', 'fatau dauda') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l8-era" className="era-pill g">2000s to 2010s</Editable>
              <Editable tag="div" eid="l8-name" className="lc-name">Fatau Dauda</Editable>
              <Editable tag="div" eid="l8-pos" className="lc-pos">Goalkeeper</Editable>
              <Editable tag="p" eid="l8-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>Denied prime Cristiano Ronaldo 8 times. One of the most underrated goalkeeper performances in Ghana's World Cup history.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2037923262466826395" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l8-c1" className="comp-row-t">vs Portugal — 2014 FIFA World Cup Group Stage</Editable><Editable tag="div" eid="l8-c1s" className="comp-row-s">20K Views · 752 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="l8-quote" className="lc-quote">Denied Ronaldo 8 times. The world finally took notice.</Editable>
          </div>

          {/* Kevin Prince Boateng */}
          <div className="legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'kevin prince boateng') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="l9-era" className="era-pill r">2000s to 2010s</Editable>
              <Editable tag="div" eid="l9-name" className="lc-name">Kevin Prince Boateng</Editable>
              <Editable tag="div" eid="l9-pos" className="lc-pos">Midfielder · AC Milan, Schalke</Editable>
              <Editable tag="p" eid="l9-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>One of the most technically gifted players to ever pull on the Black Stars shirt. His performances at the 2010 World Cup were something special.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2037159684314960081" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l9-c1" className="comp-row-t">vs Uruguay — 2010 FIFA World Cup</Editable><Editable tag="div" eid="l9-c1s" className="comp-row-s">140K Views · 2.8K Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              <a href="https://x.com/Ghanacomps/status/2029998390428275159" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l9-c2" className="comp-row-t">vs Australia — 2010 FIFA World Cup</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="l9-quote" className="lc-quote">With Essien out, KPB stepped in and delivered beyond all expectation.</Editable>
          </div>

          {/* Dynamic extra legends */}
          {extraLegends.map((d, i) => {
            const era = ERA_COLORS[i % 3];
            return (
              <div key={i} className="legend-card" data-pos={d.pos} style={{ display: cardVisible(d.pos, d.name) ? '' : 'none' }}>
                <div className="lc-head">
                  <span className={`era-pill ${era}`}>{d.era}</span>
                  <div className="lc-name">{d.name}</div>
                  <div className="lc-pos">{d.pos_display}</div>
                  <p style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>{d.bio}</p>
                </div>
                <div className="lc-comps">
                  <div className="lc-comps-lbl">Our Comps</div>
                  {d.comps.map((c, ci) => (
                    <a key={ci} href={c.url || '#'} target="_blank" rel="noopener" className="comp-row-link">
                      <div><div className="comp-row-t">{c.title}</div>{c.stats && <div className="comp-row-s">{c.stats}</div>}</div>
                      <span className="watch-tag">▶ Watch on X</span>
                    </a>
                  ))}
                </div>
                <div className="lc-quote">{d.quote}</div>
                {isAdmin && (
                  <div className="card-actions">
                    <button className="btn-remove-card" onClick={() => removeLegend(i)}>✕ Remove</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button className="add-legend-btn" onClick={addLegend}>+ Add New Legend</button>
      </section>

      {/* CULT HEROES */}
      <section className="alt">
        <div className="eyebrow">Cult Heroes</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-sm)' }}>Not Every Player <span className="gold">Became a Legend.</span></h2>
        <Editable tag="p" eid="cult-intro" className="lead" style={{ marginBottom: 'var(--space-5xl)', fontSize: 'var(--fs-base)' }}>But some of them became something else entirely.</Editable>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 'var(--space-3xs)', background: 'var(--line)' }}>
          {/* Quincy */}
          <div className="legend-card" data-pos="striker" style={{ display: cardVisible('striker', 'quincy owusu abeyie') ? '' : 'none' }}>
            <div className="lc-head">
              <Editable tag="span" eid="ch1-era" className="era-pill g">2000s to 2010s</Editable>
              <Editable tag="div" eid="ch1-name" className="lc-name">Quincy Owusu Abeyie</Editable>
              <Editable tag="div" eid="ch1-pos" className="lc-pos">Forward · Arsenal, Spartak Moscow</Editable>
              <Editable tag="p" eid="ch1-bio" style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>One of the most naturally gifted Ghanaians of his generation. The cult hero Ghana never forgot.</Editable>
            </div>
            <div className="lc-comps">
              <div className="lc-comps-lbl">Our Comps</div>
              <a href="https://x.com/Ghanacomps/status/2026997762345021923" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="ch1-c1" className="comp-row-t">vs Australia — 2010 World Cup Group Stages</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
            </div>
            <Editable tag="div" eid="ch1-quote" className="lc-quote">KALYJAY requested this. We dropped it the next day.</Editable>
          </div>

          {extraCult.map((d, i) => {
            const era = ERA_COLORS[i % 3];
            return (
              <div key={i} className="legend-card" data-pos={d.pos} style={{ display: cardVisible(d.pos, d.name) ? '' : 'none' }}>
                <div className="lc-head">
                  <span className={`era-pill ${era}`}>{d.era}</span>
                  <div className="lc-name">{d.name}</div>
                  <div className="lc-pos">{d.pos_display}</div>
                  <p style={{ padding: 0, marginBottom: 'var(--space-lg)', fontSize: 'var(--fs-base)', lineHeight: 'var(--lh-body)', color: 'var(--body)' }}>{d.bio}</p>
                </div>
                <div className="lc-comps">
                  <div className="lc-comps-lbl">Our Comps</div>
                  {d.comps.map((c, ci) => (
                    <a key={ci} href={c.url || '#'} target="_blank" rel="noopener" className="comp-row-link">
                      <div><div className="comp-row-t">{c.title}</div>{c.stats && <div className="comp-row-s">{c.stats}</div>}</div>
                      <span className="watch-tag">▶ Watch on X</span>
                    </a>
                  ))}
                </div>
                <div className="lc-quote">{d.quote}</div>
                {isAdmin && (
                  <div className="card-actions">
                    <button className="btn-remove-card" onClick={() => removeCult(i)}>✕ Remove</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button className="add-legend-btn" onClick={addCultHero}>+ Add New Cult Hero</button>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
