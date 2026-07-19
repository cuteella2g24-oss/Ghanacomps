import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import { useAdmin } from '../contexts/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import VideoCard from '../components/VideoCard';
import { ESSIEN_CLIP } from '../data/clips';

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

      <div className="gc-pagehead gc-chevrons quiet reveal">
        <div className="gc-pagehead-inner">
          <Editable tag="div" eid="leg-eyebrow" className="gc-eyebrow">Growing Every Week</Editable>
          <h1 className="gc-ph-title">Legends We Have <span className="gold">Honoured.</span></h1>
          <Editable tag="p" eid="leg-intro" className="gc-ph-kicker">Every legend we have covered so far. Click any comp to watch it on X.</Editable>
          <div className="gc-controls" style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', alignItems: 'center', marginTop: 'var(--space-6xl)' }}>
            <input type="text" className="search" placeholder="Search legends..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
            <div className="filters" style={{ margin: 0 }}>
              {[['all','All'],['midfielder','Midfielders'],['striker','Strikers'],['goalkeeper','Goalkeepers']].map(([pos, label]) => (
                <button key={pos} className={`f-btn${filterPos === pos ? ' on' : ''}`} onClick={() => setFilterPos(pos)}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* LEGENDS SECTION — A index led by one C reverence plate */}
      <section className="reveal">
        {/* C-reverence marquee legend: Michael Essien (l2-* eids preserved) */}
        <div className="gc-marquee-legend legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'michael essien') ? '' : 'none' }}>
          <span className="gc-corner tl" aria-hidden="true" />
          <span className="gc-corner tr" aria-hidden="true" />
          <span className="gc-corner bl" aria-hidden="true" />
          <span className="gc-corner br" aria-hidden="true" />
          <Editable tag="span" eid="l2-era" className="gc-ml-era">2000s to 2010s</Editable>
          <Editable tag="h2" eid="l2-name" className="gc-ml-name">Michael Essien</Editable>
          <Editable tag="div" eid="l2-pos" className="gc-ml-pos">Midfielder · Chelsea, Real Madrid</Editable>
          <div className="gc-ml-divider" aria-hidden="true" />
          <div className="lc-badge">★ Acknowledged on TikTok and Facebook</div>
          <Editable tag="p" eid="l2-bio" className="gc-ml-bio">The Bison. One of the most complete midfielders in the world at his peak. Box to box, physical, technical and always in the right place.</Editable>
          {/* One moving-footage moment inside the gallery frame (§3 Legends).
              Reverence register: no autoplay, poster + glyph, tap → lightbox. */}
          <div className="gc-ml-clip" style={{ maxWidth: '230px', margin: '0 auto var(--space-6xl)' }}>
            <VideoCard clip={ESSIEN_CLIP} size="sm" showCaption={false} />
          </div>
          <div className="lc-comps gc-ml-comps">
            <a href="https://x.com/Ghanacomps/status/2028823927577817257" target="_blank" rel="noopener" className="comp-row-link">
              <div><Editable tag="div" eid="l2-c1" className="comp-row-t">vs Italy — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l2-c1s" className="comp-row-s">265K Views · 3.7K Likes</Editable></div>
              <span className="watch-tag">▶ Watch on X</span>
            </a>
          </div>
          <Editable tag="p" eid="l2-quote" className="gc-ml-quote">"Keeping the Ghanaian midfielders legacy alive" — fan on X</Editable>
        </div>

        {/* A-index: the ruled ledger of the remaining legends */}
        <div className="gc-legger">

          {/* Abedi Pele */}
          <div className="gc-lentry legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'abedi pele') ? '' : 'none' }}>
            <span className="gc-lidx">01</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l1-name" className="gc-lname">Abedi Pelé</Editable>
              <Editable tag="div" eid="l1-pos" className="gc-lmeta">Attacking Midfielder · Marseille, Lyon</Editable>
              <Editable tag="p" eid="l1-bio" className="gc-lbio">Three time African Footballer of the Year. Ghana has never produced a player quite like him. A wizard in every sense of the word.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2029905846784655770" target="_blank" rel="noopener" className="comp-row-link">
                  <div><Editable tag="div" eid="l1-c1" className="comp-row-t">vs Nigeria — 1992 AFCON Semi Final</Editable><Editable tag="div" eid="l1-c1s" className="comp-row-s">18K Views · 806 Likes</Editable></div>
                  <span className="watch-tag">▶ Watch on X</span>
                </a>
              </div>
              <Editable tag="p" eid="l1-quote" className="gc-lquote">"Ghana's greatest football player of all time?" — 18K views</Editable>
            </div>
            <Editable tag="span" eid="l1-era" className="gc-lera g">1980s to 1990s</Editable>
          </div>

          {/* Asamoah Gyan */}
          <div className="gc-lentry legend-card" data-pos="striker" style={{ display: cardVisible('striker', 'asamoah gyan') ? '' : 'none' }}>
            <span className="gc-lidx">02</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l3-name" className="gc-lname">Asamoah Gyan</Editable>
              <Editable tag="div" eid="l3-pos" className="gc-lmeta">Striker · Sunderland, Al Ain</Editable>
              <Editable tag="p" eid="l3-bio" className="gc-lbio">Ghana's all time top scorer. The goal machine. Powerful, direct and clinical. He carried Ghana on his back for years.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2031388723254886504" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l3-c1" className="comp-row-t">vs Germany — 2014 FIFA World Cup</Editable><Editable tag="div" eid="l3-c1s" className="comp-row-s">19K Views · 385 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
                <a href="https://x.com/Ghanacomps/status/2029631065623527881" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l3-c2" className="comp-row-t">vs Czech Republic — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l3-c2s" className="comp-row-s">15K Views · 711 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
                <a href="https://x.com/Ghanacomps/status/2024453540370931908" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l3-c3" className="comp-row-t">vs Egypt — 2014 WC Qualifiers at Baba Yara</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="l3-quote" className="gc-lquote">"He had it all. What would prime Gyan be worth today?"</Editable>
            </div>
            <Editable tag="span" eid="l3-era" className="gc-lera gr">2000s to 2010s</Editable>
          </div>

          {/* Stephen Appiah */}
          <div className="gc-lentry legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'stephen appiah') ? '' : 'none' }}>
            <span className="gc-lidx">03</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l4-name" className="gc-lname">Stephen Appiah</Editable>
              <Editable tag="div" eid="l4-pos" className="gc-lmeta">Midfielder · Juventus, Fenerbahce</Editable>
              <Editable tag="p" eid="l4-bio" className="gc-lbio">Captain Fantastic. The man who led Ghana to their first ever World Cup in 2006. Elegant, intelligent and everything you want in a leader.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2033504111916707972" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l4-c1" className="comp-row-t">vs Italy — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l4-c1s" className="comp-row-s">29K Views · 1.1K Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="l4-quote" className="gc-lquote">"Captain's performance" — 29K views</Editable>
            </div>
            <Editable tag="span" eid="l4-era" className="gc-lera g">1990s to 2000s</Editable>
          </div>

          {/* Kwadwo Asamoah */}
          <div className="gc-lentry legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'kwadwo asamoah') ? '' : 'none' }}>
            <span className="gc-lidx">04</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l5-name" className="gc-lname">Kwadwo Asamoah</Editable>
              <Editable tag="div" eid="l5-pos" className="gc-lmeta">Midfielder · Juventus, Inter Milan</Editable>
              <Editable tag="p" eid="l5-bio" className="gc-lbio">One of the most versatile players Ghana has ever produced. His display against Uruguay at the 2010 World Cup is still talked about.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2027132060452683814" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l5-c1" className="comp-row-t">vs Uruguay — 2010 World Cup Quarter Final</Editable><Editable tag="div" eid="l5-c1s" className="comp-row-s">30K Views · 878 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
                <a href="https://x.com/Ghanacomps/status/2024796549763527166" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l5-c2" className="comp-row-t">vs USA — 2010 World Cup Round of 16</Editable><Editable tag="div" eid="l5-c2s" className="comp-row-s">32K Views · 751 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="l5-quote" className="gc-lquote">"Which current Black Stars player reflects this profile?"</Editable>
            </div>
            <Editable tag="span" eid="l5-era" className="gc-lera r">2000s to 2010s</Editable>
          </div>

          {/* Anthony Annan */}
          <div className="gc-lentry legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'anthony annan') ? '' : 'none' }}>
            <span className="gc-lidx">05</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l6-name" className="gc-lname">Anthony Annan</Editable>
              <Editable tag="div" eid="l6-pos" className="gc-lmeta">Defensive Midfielder · Schalke, Rosenborg</Editable>
              <Editable tag="p" eid="l6-bio" className="gc-lbio">Our biggest legend comp. 76K views. The football world went back and remembered just how good he was against Uruguay at the 2010 World Cup.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2026357491534045582" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l6-c1" className="comp-row-t">vs Uruguay — 2010 FIFA World Cup Quarter Finals</Editable><Editable tag="div" eid="l6-c1s" className="comp-row-s">76K Views · 1.1K Likes · 263 Reposts</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="l6-quote" className="gc-lquote">76K views · 263 reposts · Our biggest legend comp</Editable>
            </div>
            <Editable tag="span" eid="l6-era" className="gc-lera gr">2000s to 2010s</Editable>
          </div>

          {/* Richard Kingson */}
          <div className="gc-lentry legend-card" data-pos="goalkeeper" style={{ display: cardVisible('goalkeeper', 'richard kingson') ? '' : 'none' }}>
            <span className="gc-lidx">06</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l7-name" className="gc-lname">Richard Kingson</Editable>
              <Editable tag="div" eid="l7-pos" className="gc-lmeta">Goalkeeper · Blackpool, Birmingham City</Editable>
              <Editable tag="p" eid="l7-bio" className="gc-lbio">Olele. One of the most loved goalkeepers in Ghana's history. His performance against Italy at the 2006 World Cup showed exactly what he was capable of.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2031072162723897579" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l7-c1" className="comp-row-t">vs Italy — 2006 FIFA World Cup</Editable><Editable tag="div" eid="l7-c1s" className="comp-row-s">35K Views · 1K Likes · 155 Reposts</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="l7-quote" className="gc-lquote">35K views · 155 reposts · 1K likes</Editable>
            </div>
            <Editable tag="span" eid="l7-era" className="gc-lera g">2000s</Editable>
          </div>

          {/* Fatau Dauda */}
          <div className="gc-lentry legend-card" data-pos="goalkeeper" style={{ display: cardVisible('goalkeeper', 'fatau dauda') ? '' : 'none' }}>
            <span className="gc-lidx">07</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l8-name" className="gc-lname">Fatau Dauda</Editable>
              <Editable tag="div" eid="l8-pos" className="gc-lmeta">Goalkeeper</Editable>
              <Editable tag="p" eid="l8-bio" className="gc-lbio">Denied prime Cristiano Ronaldo 8 times. One of the most underrated goalkeeper performances in Ghana's World Cup history.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2037923262466826395" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l8-c1" className="comp-row-t">vs Portugal — 2014 FIFA World Cup Group Stage</Editable><Editable tag="div" eid="l8-c1s" className="comp-row-s">20K Views · 752 Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="l8-quote" className="gc-lquote">Denied Ronaldo 8 times. The world finally took notice.</Editable>
            </div>
            <Editable tag="span" eid="l8-era" className="gc-lera g">2000s to 2010s</Editable>
          </div>

          {/* Kevin Prince Boateng */}
          <div className="gc-lentry legend-card" data-pos="midfielder" style={{ display: cardVisible('midfielder', 'kevin prince boateng') ? '' : 'none' }}>
            <span className="gc-lidx">08</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="l9-name" className="gc-lname">Kevin Prince Boateng</Editable>
              <Editable tag="div" eid="l9-pos" className="gc-lmeta">Midfielder · AC Milan, Schalke</Editable>
              <Editable tag="p" eid="l9-bio" className="gc-lbio">One of the most technically gifted players to ever pull on the Black Stars shirt. His performances at the 2010 World Cup were something special.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2037159684314960081" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l9-c1" className="comp-row-t">vs Uruguay — 2010 FIFA World Cup</Editable><Editable tag="div" eid="l9-c1s" className="comp-row-s">140K Views · 2.8K Likes</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
                <a href="https://x.com/Ghanacomps/status/2029998390428275159" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="l9-c2" className="comp-row-t">vs Australia — 2010 FIFA World Cup</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="l9-quote" className="gc-lquote">With Essien out, KPB stepped in and delivered beyond all expectation.</Editable>
            </div>
            <Editable tag="span" eid="l9-era" className="gc-lera r">2000s to 2010s</Editable>
          </div>

          {/* Dynamic extra legends */}
          {extraLegends.map((d, i) => {
            const era = ERA_COLORS[i % 3];
            return (
              <div key={i} className="gc-lentry legend-card" data-pos={d.pos} style={{ display: cardVisible(d.pos, d.name) ? '' : 'none' }}>
                <span className="gc-lidx">{String(9 + i).padStart(2, '0')}</span>
                <div className="gc-lmain">
                  <div className="gc-lname">{d.name}</div>
                  <div className="gc-lmeta">{d.pos_display}</div>
                  <p className="gc-lbio">{d.bio}</p>
                  <div className="lc-comps gc-lcomps">
                    <div className="lc-comps-lbl">Our Comps</div>
                    {d.comps.map((c, ci) => (
                      <a key={ci} href={c.url || '#'} target="_blank" rel="noopener" className="comp-row-link">
                        <div><div className="comp-row-t">{c.title}</div>{c.stats && <div className="comp-row-s">{c.stats}</div>}</div>
                        <span className="watch-tag">▶ Watch on X</span>
                      </a>
                    ))}
                  </div>
                  <div className="gc-lquote">{d.quote}</div>
                  {isAdmin && (
                    <div className="card-actions">
                      <button className="btn-remove-card" onClick={() => removeLegend(i)}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <span className={`gc-lera ${era}`}>{d.era}</span>
              </div>
            );
          })}
        </div>

        <button className="add-legend-btn" onClick={addLegend}>+ Add New Legend</button>
      </section>

      {/* CULT HEROES */}
      <section className="alt reveal">
        <div className="gc-rule">
          <h2 className="gc-rule-l">Not Every Player <span className="gold">Became a Legend.</span></h2>
          <span className="gc-rule-r">Cult Heroes</span>
        </div>
        <Editable tag="p" eid="cult-intro" className="lead" style={{ marginTop: 'calc(var(--space-7xl) * -1 + var(--space-2xl))', marginBottom: 'var(--space-6xl)', fontSize: 'var(--fs-lg)', fontFamily: 'var(--font-a)', fontStyle: 'italic', color: 'var(--body)' }}>But some of them became something else entirely.</Editable>
        <div className="gc-legger">
          {/* Quincy */}
          <div className="gc-lentry legend-card" data-pos="striker" style={{ display: cardVisible('striker', 'quincy owusu abeyie') ? '' : 'none' }}>
            <span className="gc-lidx">01</span>
            <div className="gc-lmain">
              <Editable tag="div" eid="ch1-name" className="gc-lname">Quincy Owusu Abeyie</Editable>
              <Editable tag="div" eid="ch1-pos" className="gc-lmeta">Forward · Arsenal, Spartak Moscow</Editable>
              <Editable tag="p" eid="ch1-bio" className="gc-lbio">One of the most naturally gifted Ghanaians of his generation. The cult hero Ghana never forgot.</Editable>
              <div className="lc-comps gc-lcomps">
                <div className="lc-comps-lbl">Our Comps</div>
                <a href="https://x.com/Ghanacomps/status/2026997762345021923" target="_blank" rel="noopener" className="comp-row-link"><div><Editable tag="div" eid="ch1-c1" className="comp-row-t">vs Australia — 2010 World Cup Group Stages</Editable></div><span className="watch-tag">▶ Watch on X</span></a>
              </div>
              <Editable tag="p" eid="ch1-quote" className="gc-lquote">KALYJAY requested this. We dropped it the next day.</Editable>
            </div>
            <Editable tag="span" eid="ch1-era" className="gc-lera g">2000s to 2010s</Editable>
          </div>

          {extraCult.map((d, i) => {
            const era = ERA_COLORS[i % 3];
            return (
              <div key={i} className="gc-lentry legend-card" data-pos={d.pos} style={{ display: cardVisible(d.pos, d.name) ? '' : 'none' }}>
                <span className="gc-lidx">{String(1 + i + 1).padStart(2, '0')}</span>
                <div className="gc-lmain">
                  <div className="gc-lname">{d.name}</div>
                  <div className="gc-lmeta">{d.pos_display}</div>
                  <p className="gc-lbio">{d.bio}</p>
                  <div className="lc-comps gc-lcomps">
                    <div className="lc-comps-lbl">Our Comps</div>
                    {d.comps.map((c, ci) => (
                      <a key={ci} href={c.url || '#'} target="_blank" rel="noopener" className="comp-row-link">
                        <div><div className="comp-row-t">{c.title}</div>{c.stats && <div className="comp-row-s">{c.stats}</div>}</div>
                        <span className="watch-tag">▶ Watch on X</span>
                      </a>
                    ))}
                  </div>
                  <div className="gc-lquote">{d.quote}</div>
                  {isAdmin && (
                    <div className="card-actions">
                      <button className="btn-remove-card" onClick={() => removeCult(i)}>✕ Remove</button>
                    </div>
                  )}
                </div>
                <span className={`gc-lera ${era}`}>{d.era}</span>
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
