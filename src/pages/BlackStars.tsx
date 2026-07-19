import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import SportyIcon from '../components/SportyIcon';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Button } from '@/components/ui/button';
import HighlightsSection from '../components/HighlightsSection';
import { type Clip, DEFAULT_BS_HIGHLIGHTS } from '../data/clips';


export default function BlackStars() {
  const [bsHighlights, setBsHighlights] = useLocalStorage<Clip[]>('gc_bs_highlights', DEFAULT_BS_HIGHLIGHTS);



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

      {/* EDITOR SECTION */}
      <section className="reveal">
        <Editable tag="div" eid="bs-eyebrow" className="gc-eyebrow">Latest Update</Editable>
        <h2 className="gc-h2" style={{ marginBottom: 'var(--space-4xl)' }}><Editable tag="span" eid="bs-title" className="gold">Otto Addo Sacked. New Chapter Begins.</Editable></h2>
        <div className="gc-editor">
          <Editable tag="div" eid="bs-heading" className="editor-heading">72 Days to the World Cup — Ghana Without a Coach</Editable>
          <Editable tag="div" eid="bs-body" className="editor-body">
            {'<p>The GFA sacked Otto Addo on March 31 2026, hours after a 2-1 defeat to Germany in Stuttgart. That result came just four days after a humiliating 5-1 loss to Austria in Vienna — Ghana\'s heaviest defeat in nearly two decades. Five consecutive losses, no AFCON qualification, a fractured dressing room. The GFA pulled the trigger with 72 days to go before the World Cup.</p><p>Walid Regragui, who took Morocco to the 2022 World Cup semi-finals, has been reported as a target. The new coach will have weeks to prepare for a group that includes Panama, England and Croatia. Follow us on X for every update as it happens.</p>'}
          </Editable>
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

      {/* FIXTURES */}
      <section className="alt reveal">
        <div className="gc-eyebrow">Coming Up</div>
        <h2 className="gc-h2" style={{ marginBottom: 'var(--space-5xl)' }}>Next <span className="gold">Fixtures.</span></h2>
        <div className="g2">
          <div className="gc-fixture">
            <Editable tag="div" eid="f1l" className="gc-fix-lbl">Next Fixture — Pre World Cup Friendly</Editable>
            <Editable tag="div" eid="f1t" className="gc-fix-title">Ghana vs Mexico</Editable>
            <Editable tag="div" eid="f1d" className="gc-fix-det">Friday May 22 2026 · Venue in Mexico TBC · 17:00 GMT</Editable>
            <Editable tag="p" eid="f1-stake" className="gc-fix-stake">The final major World Cup warm-up. Mexico are a co-host nation and one of CONCACAF's strongest sides. Ghana lost 2-0 to them in 2023. Whoever takes the Ghana job will use this game to assess the squad before naming the World Cup 26-man roster. A big test under a new technical direction.</Editable>
            <Button asChild variant="ghost"><a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">Follow for Updates</a></Button>
          </div>
          <div className="gc-fixture">
            <Editable tag="div" eid="f2l" className="gc-fix-lbl">Final Warm-Up — Pre World Cup Friendly</Editable>
            <Editable tag="div" eid="f2t" className="gc-fix-title">Wales vs Ghana</Editable>
            <Editable tag="div" eid="f2d" className="gc-fix-det">Tuesday June 2 2026 · Cardiff City Stadium · KO Time TBC</Editable>
            <Editable tag="p" eid="f2-stake" className="gc-fix-stake">The last game before the World Cup. Wales did not qualify — they were knocked out on penalties by Bosnia and Herzegovina in the play-offs — but this historic first ever meeting between the two nations goes ahead. Ghana face Panama 15 days after this. The last chance for fringe players to make their case.</Editable>
            <Button asChild variant="ghost"><a href="https://x.com/Ghanacomps" target="_blank" rel="noopener">Stay Updated</a></Button>
          </div>
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
