import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import SportyIcon from '../components/SportyIcon';
import { useAdmin } from '../contexts/AdminContext';
import { useContentList, useContent } from '../contexts/ContentContext';
import { Button } from '@/components/ui/button';
import HighlightsSection from '../components/HighlightsSection';
import UniversalEmbed from '../components/UniversalEmbed';
import { Countdown } from '../components/Countdown';
import { type Clip } from '../data/clips';
import { TEAMS, teamKeys, type TeamId } from '../lib/nationalTeams';

interface PostEmbed { url: string; caption: string; }

export default function BlackStars() {
  const { isAdmin } = useAdmin();
  const { getField } = useContent();
  const [team, setTeam] = useState<TeamId>('men');

  const keys = teamKeys(team);
  const active = TEAMS.find(t => t.id === team)!;

  // Lists are read via the resolved keys. The keys change with the active tab;
  // the hooks are still called unconditionally each render, so this is safe.
  const [highlights, setHighlights] = useContentList<Clip[]>(keys.highlightsList, keys.highlightsDefault);
  const [embeds, setEmbeds] = useContentList<PostEmbed[]>(keys.embedsList, []);
  const [embUrl, setEmbUrl] = useState('');
  const [embCaption, setEmbCaption] = useState('');

  function addEmbed() {
    if (!embUrl.trim()) { alert('Paste a video link.'); return; }
    setEmbeds([{ url: embUrl.trim(), caption: embCaption.trim() }, ...embeds]);
    setEmbUrl('');
    setEmbCaption('');
  }

  function removeEmbed(i: number) {
    const updated = [...embeds];
    updated.splice(i, 1);
    setEmbeds(updated);
  }

  // Editorial only renders if it has real content (title or body) — or for admins.
  const edTitle = getField(keys.editorial.title.key, keys.editorial.title.def);
  const edHeading = getField(keys.editorial.heading.key, keys.editorial.heading.def);
  const edBody = getField(keys.editorial.body.key, keys.editorial.body.def);
  const showEditorial = isAdmin || edTitle.trim() !== '' || edBody.trim() !== '';

  return (
    <>
      <Stripe />
      <Nav />

      <div className="gc-pagehead gc-chevrons loud reveal">
        <div className="gc-pagehead-inner">
          <div className="gc-scorebug">
            <span className="live">{active.scorebug}</span>
          </div>
          <h1 className="gc-ph-title">Ghana <span className="gold">National Teams.</span></h1>
          <p className="gc-ph-lead">When Ghana play this is where you come. Before the game we give you what to expect. During the game we post every goal on X as it happens. After the final whistle we break it all down.</p>
        </div>
      </div>

      {/* TEAM TABS — switch every section below between national teams */}
      <section className="reveal" style={{ paddingTop: 'var(--space-6xl)', paddingBottom: 0 }}>
        <div className="filters" style={{ margin: 0, justifyContent: 'center' }}>
          {TEAMS.map(t => (
            <button
              key={t.id}
              type="button"
              className={`f-btn${team === t.id ? ' on' : ''}`}
              aria-pressed={team === t.id}
              onClick={() => setTeam(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </section>

      {/* LATEST UPDATE — editorial news, edited from /admin */}
      {showEditorial && (
        <section className="reveal">
          <div className="gc-eyebrow">{getField(keys.editorial.eyebrow.key, keys.editorial.eyebrow.def)}</div>
          <h2 className="gc-h2" style={{ marginBottom: 'var(--space-4xl)' }}><span className="gold">{edTitle}</span></h2>
          <div className="gc-editor">
            <div className="editor-heading">{edHeading}</div>
            <div className="editor-body">
              {edBody.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* MATCHDAY HIGHLIGHTS — self-hosted video (VIDEO_DESIGN_SPEC §3) */}
      {(highlights.length > 0 || isAdmin) && (
        <HighlightsSection
          eyebrow="Matchday"
          headingLead="Matchday"
          headingGold="Highlights."
          clips={highlights}
          onChange={setHighlights}
        />
      )}

      {/* GOALS & MOMENTS — embedded video posts play inline on the site */}
      {(embeds.length > 0 || isAdmin) && (
        <section className="reveal">
          <div className="gc-eyebrow">Watch on Site</div>
          <h2 className="gc-h2" style={{ marginBottom: 'var(--space-2xl)' }}>Goals &amp; <span className="gold">Moments.</span></h2>
          <p className="lead" style={{ marginBottom: 'var(--space-4xl)', fontSize: 'var(--fs-base)' }}>Every Ghanaian goal, embedded straight from the source so you can watch it right here.</p>

          {embeds.length > 0 ? (
            <div className="gc-embed-grid">
              {embeds.map((e, i) => (
                <div key={`${e.url}-${i}`} className="gc-embed-item">
                  {e.caption && <div className="gc-embed-caption">{e.caption}</div>}
                  <UniversalEmbed url={e.url} caption={e.caption} />
                  {isAdmin && <button className="btn-remove-card" onClick={() => removeEmbed(i)}>✕ Remove</button>}
                </div>
              ))}
            </div>
          ) : (
            <div className="post-placeholder"><p>No posts embedded yet — add a goal video.</p></div>
          )}

          {isAdmin && (
            <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-3xl)', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
              <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 'var(--space-md)' }}>Embed a Video</div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="url" placeholder="video link (YouTube, TikTok, Instagram, X, Vimeo, MP4)" value={embUrl} onChange={e => setEmbUrl(e.target.value)} style={{ flex: 2, minWidth: '220px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
                <input type="text" placeholder="Caption (optional)..." value={embCaption} onChange={e => setEmbCaption(e.target.value)} style={{ flex: 1, minWidth: '160px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
                <Button size="sm" onClick={addEmbed}>Add Post</Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* FIXTURES */}
      {(() => {
        const cards = (['f1', 'f2'] as const)
          .map(fx => ({ fx, fk: keys.fixtures[fx] }))
          .filter(({ fk }) => getField(fk.title.key, fk.title.def).trim() !== '');
        if (cards.length === 0 && !isAdmin) return null;
        return (
          <section className="alt reveal">
            <div className="gc-eyebrow">Coming Up</div>
            <h2 className="gc-h2" style={{ marginBottom: 'var(--space-5xl)' }}>Next <span className="gold">Fixtures.</span></h2>
            <div className="g2">
              {cards.map(({ fx, fk }) => (
                <div key={fx} className="gc-fixture">
                  <div className="gc-fix-lbl">{getField(fk.label.key, fk.label.def)}</div>
                  <div className="gc-fix-title">{getField(fk.title.key, fk.title.def)}</div>
                  <div className="gc-fix-det">{getField(fk.det.key, fk.det.def)}</div>
                  <Countdown target={getField(fk.iso.key, fk.iso.def)} />
                  <p className="gc-fix-stake">{getField(fk.stake.key, fk.stake.def)}</p>
                  <Button asChild variant="ghost"><a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">Follow for Updates</a></Button>
                </div>
              ))}
            </div>
          </section>
        );
      })()}

      {/* MATCHDAY COVERAGE — shared across every team (generic coverage info) */}
      <section className="reveal">
        <div className="gc-eyebrow">On Matchday</div>
        <h2 className="gc-h2 tight">What We <span className="gold">Cover.</span></h2>
        <div className="gc-board">
          <div className="gc-md-cell"><span className="gc-md-num" aria-hidden="true">01</span><span className="gc-sportcard-chip gc-sportcard-chip--sm"><SportyIcon name="tactics" /></span><Editable tag="div" eid="md1-t" className="md-title">Predicted Lineup</Editable><Editable tag="p" eid="md1-b" className="md-body">We post our predicted starting eleven and ask fans who they want to see.</Editable></div>
          <div className="gc-md-cell"><span className="gc-md-num" aria-hidden="true">02</span><span className="gc-sportcard-chip gc-sportcard-chip--sm r"><SportyIcon name="goal" /></span><Editable tag="div" eid="md2-t" className="md-title">Goals Live on X</Editable><Editable tag="p" eid="md2-b" className="md-body">Every Ghanaian goal goes up on X as it happens. Follow us there to stay with the game.</Editable></div>
          <div className="gc-md-cell"><span className="gc-md-num" aria-hidden="true">03</span><span className="gc-sportcard-chip gc-sportcard-chip--sm"><SportyIcon name="tactics" /></span><Editable tag="div" eid="md3-t" className="md-title">Post Match Breakdown</Editable><Editable tag="p" eid="md3-b" className="md-body">Ball progression, defensive shape and attacking patterns broken down clearly.</Editable></div>
          <div className="gc-md-cell"><span className="gc-md-num" aria-hidden="true">04</span><span className="gc-sportcard-chip gc-sportcard-chip--sm"><SportyIcon name="jersey" /></span><Editable tag="div" eid="md4-t" className="md-title">Player Comps</Editable><Editable tag="p" eid="md4-b" className="md-body">Every player who stood out gets their own compilation after the game.</Editable></div>
          <div className="gc-md-cell"><span className="gc-md-num" aria-hidden="true">05</span><span className="gc-sportcard-chip gc-sportcard-chip--sm"><SportyIcon name="whistle" /></span><Editable tag="div" eid="md5-t" className="md-title">Player Ratings</Editable><Editable tag="p" eid="md5-b" className="md-body">Honest ratings for every Black Stars player. Short, punchy and always something to argue about.</Editable></div>
          <div className="gc-md-cell"><span className="gc-md-num" aria-hidden="true">06</span><span className="gc-sportcard-chip gc-sportcard-chip--sm r"><SportyIcon name="broadcast" /></span><Editable tag="div" eid="md6-t" className="md-title">Injury Updates</Editable><Editable tag="p" eid="md6-b" className="md-body">Any Ghanaian picking up a knock gets flagged immediately on X.</Editable></div>
        </div>
      </section>


      <Footer />
      <Stripe />
    </>
  );
}
