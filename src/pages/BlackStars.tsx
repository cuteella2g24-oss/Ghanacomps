import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import { useAdmin } from '../contexts/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface ArchiveItem { player: string; match: string; comp: string; url: string; }

export default function BlackStars() {
  const { isAdmin } = useAdmin();
  const [archive, setArchive] = useLocalStorage<ArchiveItem[]>('gc_archive', []);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [arcPlayer, setArcPlayer] = useState('');
  const [arcMatch, setArcMatch] = useState('');
  const [arcComp, setArcComp] = useState('');
  const [arcUrl, setArcUrl] = useState('');

  function addArchiveCard() {
    if (!arcPlayer.trim() || !arcMatch.trim() || !arcUrl.trim()) { alert('Please fill in player, match and URL at minimum.'); return; }
    setArchive([...archive, { player: arcPlayer.trim(), match: arcMatch.trim(), comp: arcComp.trim(), url: arcUrl.trim() }]);
    setArcPlayer(''); setArcMatch(''); setArcComp(''); setArcUrl('');
    setShowAddPanel(false);
  }

  function removeArchive(i: number) {
    if (!confirm('Remove this card?')) return;
    const updated = [...archive];
    updated.splice(i, 1);
    setArchive(updated);
  }

  function editArchiveCard(i: number) {
    const item = archive[i];
    const player = prompt('Player name:', item.player);
    if (player === null) return;
    const match = prompt('Match:', item.match);
    if (match === null) return;
    const comp = prompt('Competition / date / stats:', item.comp);
    const url = prompt('X or TikTok URL:', item.url);
    if (url === null) return;
    const updated = [...archive];
    updated[i] = { player: player || item.player, match: match || item.match, comp: comp || '', url: url || item.url };
    setArchive(updated);
  }

  const sq = searchQuery.toLowerCase().trim();

  return (
    <>
      <Stripe />
      <Nav />

      <div className="page-header">
        <div className="eyebrow">Black Stars Watch</div>
        <h1 className="d2">The <span className="gold">Black Stars.</span></h1>
        <p className="lead" style={{ marginTop: '10px' }}>When Ghana play this is where you come. Before the game we give you what to expect. During the game we post every goal on X as it happens. After the final whistle we break it all down.</p>
      </div>

      {/* EDITOR SECTION */}
      <section>
        <Editable tag="div" eid="bs-eyebrow" className="eyebrow">Latest Update</Editable>
        <h2 className="d2" style={{ marginBottom: '20px' }}><Editable tag="span" eid="bs-title" className="gold">Otto Addo Sacked. New Chapter Begins.</Editable></h2>
        <div className="editor-block" style={{ maxWidth: '760px' }}>
          <Editable tag="div" eid="bs-heading" className="editor-heading">72 Days to the World Cup — Ghana Without a Coach</Editable>
          <Editable tag="div" eid="bs-body" className="editor-body">
            {'<p>The GFA sacked Otto Addo on March 31 2026, hours after a 2-1 defeat to Germany in Stuttgart. That result came just four days after a humiliating 5-1 loss to Austria in Vienna — Ghana\'s heaviest defeat in nearly two decades. Five consecutive losses, no AFCON qualification, a fractured dressing room. The GFA pulled the trigger with 72 days to go before the World Cup.</p><p>Walid Regragui, who took Morocco to the 2022 World Cup semi-finals, has been reported as a target. The new coach will have weeks to prepare for a group that includes Panama, England and Croatia. Follow us on X for every update as it happens.</p>'}
          </Editable>
        </div>
      </section>

      {/* FIXTURES */}
      <section className="alt">
        <div className="eyebrow">Coming Up</div>
        <h2 className="d2" style={{ marginBottom: '24px' }}>Next <span className="gold">Fixtures.</span></h2>
        <div className="g2">
          <div className="fixture">
            <Editable tag="div" eid="f1l" className="fix-lbl">Next Fixture — Pre World Cup Friendly</Editable>
            <Editable tag="div" eid="f1t" className="fix-title">Ghana vs Mexico</Editable>
            <Editable tag="div" eid="f1d" className="fix-det">Friday May 22 2026 · Venue in Mexico TBC · 17:00 GMT</Editable>
            <Editable tag="p" eid="f1-stake" style={{ fontSize: '0.78rem', color: 'var(--body)', lineHeight: 1.7, margin: '12px 0' }}>The final major World Cup warm-up. Mexico are a co-host nation and one of CONCACAF's strongest sides. Ghana lost 2-0 to them in 2023. Whoever takes the Ghana job will use this game to assess the squad before naming the World Cup 26-man roster. A big test under a new technical direction.</Editable>
            <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" className="btn ghost">Follow for Updates</a>
          </div>
          <div className="fixture">
            <Editable tag="div" eid="f2l" className="fix-lbl">Final Warm-Up — Pre World Cup Friendly</Editable>
            <Editable tag="div" eid="f2t" className="fix-title">Wales vs Ghana</Editable>
            <Editable tag="div" eid="f2d" className="fix-det">Tuesday June 2 2026 · Cardiff City Stadium · KO Time TBC</Editable>
            <Editable tag="p" eid="f2-stake" style={{ fontSize: '0.78rem', color: 'var(--body)', lineHeight: 1.7, margin: '12px 0' }}>The last game before the World Cup. Wales did not qualify — they were knocked out on penalties by Bosnia and Herzegovina in the play-offs — but this historic first ever meeting between the two nations goes ahead. Ghana face Panama 15 days after this. The last chance for fringe players to make their case.</Editable>
            <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" className="btn ghost">Stay Updated</a>
          </div>
        </div>
      </section>

      {/* MATCHDAY COVERAGE */}
      <section>
        <div className="eyebrow">On Matchday</div>
        <h2 className="d2" style={{ marginBottom: '6px' }}>What We <span className="gold">Cover.</span></h2>
        <div className="matchday-grid">
          <div className="matchday-cell"><div className="md-icon">📋</div><Editable tag="div" eid="md1-t" className="md-title">Predicted Lineup</Editable><Editable tag="p" eid="md1-b" className="md-body">We post our predicted starting eleven and ask fans who they want to see.</Editable></div>
          <div className="matchday-cell"><div className="md-icon">⚽</div><Editable tag="div" eid="md2-t" className="md-title">Goals Live on X</Editable><Editable tag="p" eid="md2-b" className="md-body">Every Ghanaian goal goes up on X as it happens. Follow us there to stay with the game.</Editable></div>
          <div className="matchday-cell"><div className="md-icon">📊</div><Editable tag="div" eid="md3-t" className="md-title">Post Match Breakdown</Editable><Editable tag="p" eid="md3-b" className="md-body">Ball progression, defensive shape and attacking patterns broken down clearly.</Editable></div>
          <div className="matchday-cell"><div className="md-icon">🎞️</div><Editable tag="div" eid="md4-t" className="md-title">Player Comps</Editable><Editable tag="p" eid="md4-b" className="md-body">Every player who stood out gets their own compilation after the game.</Editable></div>
          <div className="matchday-cell"><div className="md-icon">⭐</div><Editable tag="div" eid="md5-t" className="md-title">Player Ratings</Editable><Editable tag="p" eid="md5-b" className="md-body">Honest ratings for every Black Stars player. Short, punchy and always something to argue about.</Editable></div>
          <div className="matchday-cell"><div className="md-icon">🔔</div><Editable tag="div" eid="md6-t" className="md-title">Injury Updates</Editable><Editable tag="p" eid="md6-b" className="md-body">Any Ghanaian picking up a knock gets flagged immediately on X.</Editable></div>
        </div>
      </section>

      {/* ARCHIVE */}
      <section className="alt">
        <div className="eyebrow">Black Stars Standouts Archive</div>
        <h2 className="d2" style={{ marginBottom: '8px' }}>Player <span className="gold">Archive.</span></h2>
        <p className="lead" style={{ marginBottom: '20px', fontSize: '0.82rem' }}>Every current Black Stars player we have covered. Updated every time Ghana plays or a new comp drops. When players retire they move to the Legends section.</p>

        <input type="text" className="search archive-search" placeholder="Search by player name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />

        <div className="archive-library">
          {/* Thomas Partey */}
          <div className="archive-card" data-player="thomas partey" style={{ display: !sq || 'thomas partey'.includes(sq) ? '' : 'none' }}>
            <Editable tag="div" eid="a-partey-name" className="archive-player">Thomas Partey</Editable>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
              <div style={{ borderLeft: '2px solid rgb(var(--gold-rgb) / .3)', paddingLeft: '8px' }}>
                <Editable tag="div" eid="a-partey-m1" className="archive-match">vs Nigeria — 2022 World Cup Playoff</Editable>
                <Editable tag="div" eid="a-partey-c1" className="archive-comp">Home and Away · March 2022</Editable>
                <a href="https://x.com/Ghanacomps/status/2029157648499966060" target="_blank" rel="noopener" className="archive-watch" style={{ marginTop: '4px', display: 'inline-flex' }}>▶ Watch on X</a>
              </div>
            </div>
            {isAdmin && <div className="card-actions"><button className="btn-edit-card" onClick={() => alert('Click directly on any text in this card to edit it.')}>✏ Edit</button></div>}
          </div>

          {/* Mohammed Kudus */}
          <div className="archive-card" data-player="mohammed kudus" style={{ display: !sq || 'mohammed kudus'.includes(sq) ? '' : 'none' }}>
            <Editable tag="div" eid="a-kudus-name" className="archive-player">Mohammed Kudus</Editable>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              <div style={{ borderLeft: '2px solid rgb(var(--gold-rgb) / .3)', paddingLeft: '8px' }}>
                <Editable tag="div" eid="a-kudus-m1" className="archive-match">vs South Korea — 2022 FIFA World Cup</Editable>
                <Editable tag="div" eid="a-kudus-c1" className="archive-comp">Group Stage · November 2022</Editable>
                <a href="https://x.com/Ghanacomps/status/2027431816550879268" target="_blank" rel="noopener" className="archive-watch" style={{ marginTop: '4px', display: 'inline-flex' }}>▶ Watch on X</a>
              </div>
              <div style={{ borderLeft: '2px solid rgb(var(--gold-rgb) / .3)', paddingLeft: '8px' }}>
                <Editable tag="div" eid="a-kudus-m2" className="archive-match">vs Portugal — 2022 FIFA World Cup</Editable>
                <Editable tag="div" eid="a-kudus-c2" className="archive-comp">Group Stage · November 2022 · 9.6K Views · 457 Likes</Editable>
                <a href="https://x.com/Ghanacomps/status/2023876020798173561" target="_blank" rel="noopener" className="archive-watch" style={{ marginTop: '4px', display: 'inline-flex' }}>▶ Watch on X</a>
              </div>
              <div style={{ borderLeft: '2px solid rgb(var(--gold-rgb) / .3)', paddingLeft: '8px' }}>
                <Editable tag="div" eid="a-kudus-m3" className="archive-match">vs Brazil — 2022 Friendly</Editable>
                <Editable tag="div" eid="a-kudus-c3" className="archive-comp">Pre World Cup · September 2022 · 13K Views · 398 Likes</Editable>
                <a href="https://x.com/Ghanacomps/status/2034949768678424742" target="_blank" rel="noopener" className="archive-watch" style={{ marginTop: '4px', display: 'inline-flex' }}>▶ Watch on X</a>
              </div>
            </div>
            {isAdmin && <div className="card-actions"><button className="btn-edit-card" onClick={() => alert('Edit Kudus comps — click directly on the text above to edit it in admin mode.')}>✏ Edit</button></div>}
          </div>

          {/* Daniel Kofi Kyereh */}
          <div className="archive-card" data-player="daniel kofi kyereh" style={{ display: !sq || 'daniel kofi kyereh'.includes(sq) ? '' : 'none' }}>
            <Editable tag="div" eid="a-kyereh-name" className="archive-player">Daniel Kofi Kyereh</Editable>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
              <div style={{ borderLeft: '2px solid rgb(var(--gold-rgb) / .3)', paddingLeft: '8px' }}>
                <Editable tag="div" eid="a-kyereh-m1" className="archive-match">vs Comoros — 2021 AFCON</Editable>
                <Editable tag="div" eid="a-kyereh-c1" className="archive-comp">Group Stage · January 2022 · 38K Views · 521 Likes</Editable>
                <a href="https://x.com/Ghanacomps/status/2030726896866992425" target="_blank" rel="noopener" className="archive-watch" style={{ marginTop: '4px', display: 'inline-flex' }}>▶ Watch on X</a>
              </div>
            </div>
            {isAdmin && <div className="card-actions"><button className="btn-edit-card" onClick={() => alert('Click directly on the text above to edit it in admin mode.')}>✏ Edit</button></div>}
          </div>

          {/* Dynamic archive cards */}
          {archive.filter(item => !sq || item.player.toLowerCase().includes(sq)).map((item, i) => (
            <div key={i} className="archive-card" data-player={item.player.toLowerCase()}>
              <div className="archive-player">{item.player}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '10px' }}>
                <div style={{ borderLeft: '2px solid rgb(var(--gold-rgb) / .3)', paddingLeft: '8px' }}>
                  <div className="archive-match">{item.match}</div>
                  <div className="archive-comp">{item.comp}</div>
                  <a href={item.url} target="_blank" rel="noopener" className="archive-watch" style={{ marginTop: '4px', display: 'inline-flex' }}>▶ Watch on X</a>
                </div>
              </div>
              {isAdmin && (
                <div className="card-actions">
                  <button className="btn-edit-card" onClick={() => editArchiveCard(i)}>✏ Edit</button>
                  <button className="btn-remove-card" onClick={() => removeArchive(i)}>✕ Remove</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="add-archive-btn" onClick={() => setShowAddPanel(s => !s)}>+ Add to Archive</button>
        </div>

        {isAdmin && showAddPanel && (
          <div style={{ marginTop: '14px', padding: '18px', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
            <div style={{ fontSize: '0.56rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>Add New Archive Card</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Player name..." value={arcPlayer} onChange={e => setArcPlayer(e.target.value)} style={{ flex: 1, minWidth: '140px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: '8px 10px', fontSize: '0.8rem', borderRadius: '2px', fontFamily: 'var(--font-b)' }} />
              <input type="text" placeholder="Match (e.g. vs Nigeria — 2022 WC Playoff)..." value={arcMatch} onChange={e => setArcMatch(e.target.value)} style={{ flex: 2, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: '8px 10px', fontSize: '0.8rem', borderRadius: '2px', fontFamily: 'var(--font-b)' }} />
              <input type="text" placeholder="Competition, date, stats..." value={arcComp} onChange={e => setArcComp(e.target.value)} style={{ flex: 2, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: '8px 10px', fontSize: '0.8rem', borderRadius: '2px', fontFamily: 'var(--font-b)' }} />
              <input type="url" placeholder="X or TikTok URL..." value={arcUrl} onChange={e => setArcUrl(e.target.value)} style={{ flex: 2, minWidth: '200px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: '8px 10px', fontSize: '0.8rem', borderRadius: '2px', fontFamily: 'var(--font-b)' }} />
              <button onClick={addArchiveCard} className="btn primary" style={{ fontSize: '0.62rem', padding: '8px 16px' }}>Add</button>
              <button onClick={() => setShowAddPanel(false)} className="btn outline" style={{ fontSize: '0.62rem', padding: '8px 16px' }}>Cancel</button>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--sub)', marginTop: '8px', fontStyle: 'italic' }}>To add multiple comps to one player — add the card first, then use the Edit button to update it.</p>
          </div>
        )}
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
