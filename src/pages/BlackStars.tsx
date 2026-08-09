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
import TweetEmbed from '../components/TweetEmbed';
import { Countdown } from '../components/Countdown';
import { type Clip, DEFAULT_BS_HIGHLIGHTS } from '../data/clips';

interface PostEmbed { url: string; caption: string; }

export const FIXTURE_DEFAULTS = {
  f1: {
    label: 'Next Fixture — Pre World Cup Friendly',
    title: 'Ghana vs Mexico',
    det: 'Friday May 22 2026 · Venue in Mexico TBC · 17:00 GMT',
    iso: '2026-05-22T17:00:00Z',
    stake: 'The final major World Cup warm-up. Mexico are a co-host nation and one of CONCACAF\'s strongest sides. Ghana lost 2-0 to them in 2023. Whoever takes the Ghana job will use this game to assess the squad before naming the World Cup 26-man roster. A big test under a new technical direction.',
  },
  f2: {
    label: 'Final Warm-Up — Pre World Cup Friendly',
    title: 'Wales vs Ghana',
    det: 'Tuesday June 2 2026 · Cardiff City Stadium · KO Time TBC',
    iso: '',
    stake: 'The last game before the World Cup. Wales did not qualify — they were knocked out on penalties by Bosnia and Herzegovina in the play-offs — but this historic first ever meeting between the two nations goes ahead. Ghana face Panama 15 days after this. The last chance for fringe players to make their case.',
  },
};

export const BS_UPDATE_DEFAULTS = {
  'bs:eyebrow': 'Latest Update',
  'bs:title': 'Otto Addo Sacked. New Chapter Begins.',
  'bs:heading': '72 Days to the World Cup — Ghana Without a Coach',
  'bs:body':
    'The GFA sacked Otto Addo on March 31 2026, hours after a 2-1 defeat to Germany in Stuttgart. That result came just four days after a humiliating 5-1 loss to Austria in Vienna — Ghana\'s heaviest defeat in nearly two decades. Five consecutive losses, no AFCON qualification, a fractured dressing room. The GFA pulled the trigger with 72 days to go before the World Cup.\n\nWalid Regragui, who took Morocco to the 2022 World Cup semi-finals, has been reported as a target. The new coach will have weeks to prepare for a group that includes Panama, England and Croatia. Follow us on X for every update as it happens.',
};

export default function BlackStars() {
  const { isAdmin } = useAdmin();
  const { getField } = useContent();
  const [bsHighlights, setBsHighlights] = useContentList<Clip[]>('gc_bs_highlights', DEFAULT_BS_HIGHLIGHTS);
  const [bsEmbeds, setBsEmbeds] = useContentList<PostEmbed[]>('gc_bs_embeds', []);
  const [embUrl, setEmbUrl] = useState('');
  const [embCaption, setEmbCaption] = useState('');

  function addEmbed() {
    if (!embUrl.trim()) { alert('Paste an X post URL.'); return; }
    setBsEmbeds([{ url: embUrl.trim(), caption: embCaption.trim() }, ...bsEmbeds]);
    setEmbUrl('');
    setEmbCaption('');
  }

  function removeEmbed(i: number) {
    const updated = [...bsEmbeds];
    updated.splice(i, 1);
    setBsEmbeds(updated);
  }

  return (
    <>
      <Stripe />
      <Nav />

      <div className="gc-pagehead gc-chevrons loud reveal">
        <div className="gc-pagehead-inner">
          <div className="gc-scorebug">
            <span className="live">Black Stars Watch</span>
          </div>
          <h1 className="gc-ph-title">The <span className="gold">Black Stars.</span></h1>
          <p className="gc-ph-lead">When Ghana play this is where you come. Before the game we give you what to expect. During the game we post every goal on X as it happens. After the final whistle we break it all down.</p>
        </div>
      </div>

      {/* LATEST UPDATE — editorial news, edited from /admin */}
      <section className="reveal">
        <div className="gc-eyebrow">{getField('bs:eyebrow', BS_UPDATE_DEFAULTS['bs:eyebrow'])}</div>
        <h2 className="gc-h2" style={{ marginBottom: 'var(--space-4xl)' }}><span className="gold">{getField('bs:title', BS_UPDATE_DEFAULTS['bs:title'])}</span></h2>
        <div className="gc-editor">
          <div className="editor-heading">{getField('bs:heading', BS_UPDATE_DEFAULTS['bs:heading'])}</div>
          <div className="editor-body">
            {getField('bs:body', BS_UPDATE_DEFAULTS['bs:body']).split(/\n\n+/).map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </section>

      {/* MATCHDAY HIGHLIGHTS — self-hosted video (VIDEO_DESIGN_SPEC §3 Black Stars) */}
      <HighlightsSection
        eyebrow="Matchday"
        headingLead="Matchday"
        headingGold="Highlights."
        clips={bsHighlights}
        onChange={setBsHighlights}
      />

      {/* GOALS & MOMENTS ON X — embedded posts play inline on the site */}
      {(bsEmbeds.length > 0 || isAdmin) && (
        <section className="reveal">
          <div className="gc-eyebrow">Watch on Site</div>
          <h2 className="gc-h2" style={{ marginBottom: 'var(--space-2xl)' }}>Goals &amp; <span className="gold">Moments.</span></h2>
          <p className="lead" style={{ marginBottom: 'var(--space-4xl)', fontSize: 'var(--fs-base)' }}>Every Ghanaian goal, embedded straight from X so you can watch it right here.</p>

          {bsEmbeds.length > 0 ? (
            <div className="gc-embed-grid">
              {bsEmbeds.map((e, i) => (
                <div key={`${e.url}-${i}`} className="gc-embed-item">
                  {e.caption && <div className="gc-embed-caption">{e.caption}</div>}
                  <TweetEmbed url={e.url} />
                  {isAdmin && <button className="btn-remove-card" onClick={() => removeEmbed(i)}>✕ Remove</button>}
                </div>
              ))}
            </div>
          ) : (
            <div className="post-placeholder"><p>No posts embedded yet — add a goal from X.</p></div>
          )}

          {isAdmin && (
            <div style={{ marginTop: 'var(--space-xl)', padding: 'var(--space-3xl)', background: 'rgb(var(--gold-rgb) / .04)', border: '1px dashed rgb(var(--gold-rgb) / .25)' }}>
              <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 'var(--space-md)' }}>Embed an X Post</div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap', alignItems: 'center' }}>
                <input type="url" placeholder="X post URL (e.g. https://x.com/Ghanacomps/status/…)" value={embUrl} onChange={e => setEmbUrl(e.target.value)} style={{ flex: 2, minWidth: '220px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
                <input type="text" placeholder="Caption (optional)..." value={embCaption} onChange={e => setEmbCaption(e.target.value)} style={{ flex: 1, minWidth: '160px', background: 'var(--raised)', border: '1px solid var(--line)', color: 'var(--white)', padding: 'var(--space-sm) var(--space-md)', fontSize: 'var(--fs-sm)', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-b)' }} />
                <Button size="sm" onClick={addEmbed}>Add Post</Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* FIXTURES */}
      <section className="alt reveal">
        <div className="gc-eyebrow">Coming Up</div>
        <h2 className="gc-h2" style={{ marginBottom: 'var(--space-5xl)' }}>Next <span className="gold">Fixtures.</span></h2>
        <div className="g2">
          {(['f1', 'f2'] as const).map(fx => {
            const d = FIXTURE_DEFAULTS[fx];
            const title = getField(`bs:${fx}-title`, d.title);
            if (!title.trim()) return null; // cleared title = hide the fixture card
            return (
              <div key={fx} className="gc-fixture">
                <div className="gc-fix-lbl">{getField(`bs:${fx}-label`, d.label)}</div>
                <div className="gc-fix-title">{title}</div>
                <div className="gc-fix-det">{getField(`bs:${fx}-det`, d.det)}</div>
                <Countdown target={getField(`fixture:${fx}`, d.iso)} />
                <p className="gc-fix-stake">{getField(`bs:${fx}-stake`, d.stake)}</p>
                <Button asChild variant="ghost"><a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">Follow for Updates</a></Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* MATCHDAY COVERAGE */}
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
