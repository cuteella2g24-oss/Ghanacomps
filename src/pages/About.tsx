import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import ImageLightbox from '../components/ImageLightbox';
import UniversalEmbed from '../components/UniversalEmbed';
import SportyIcon from '../components/SportyIcon';
import { useAdmin } from '../contexts/AdminContext';
import { useContentList } from '../contexts/ContentContext';

/** Decorative expand affordance — a frosted disc + ⤢ glyph, bottom-right of a
 *  tap-to-expand tile. The host <button> carries the accessible label. */
const ExpandGlyph = () => (
  <span className="react-expand-glyph" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M9 4H4v5M15 4h5v5M15 20h5v-5M9 20H4v-5" />
    </svg>
  </span>
);

/** Full-size screenshot currently open in the lightbox (null = closed). */
interface LightboxState {
  src: string;
  label: string;
  triggerEl: HTMLElement | null;
}

/** A fan reaction is a live X post embedded on the site (added from /admin). */
interface FanReaction { url: string; caption?: string; }

export default function About() {
  const { isAdmin } = useAdmin();
  const [reactions] = useContentList<FanReaction[]>('gc_fan_reactions', []);
  const [lightbox, setLightbox] = useState<LightboxState | null>(null);

  function openLightbox(e: React.MouseEvent<HTMLButtonElement>, src: string, label: string) {
    setLightbox({ src, label, triggerEl: e.currentTarget });
  }

  return (
    <>
      <Stripe />
      <Nav />

      <div className="gc-pagehead gc-chevrons quiet reveal">
        <div className="gc-pagehead-inner">
          <div className="gc-scorebug">
            <span className="live">Our Story</span>
          </div>
          <h1 className="gc-ph-title">About <span className="gold">Ghana Comps.</span></h1>
          <p className="gc-ph-lead italic">We started this because we love Ghanaian football and felt it was not getting the attention it deserved. So we decided to change that.</p>
        </div>
      </div>

      {/* WHAT WE DO */}
      <section className="reveal">
        <div className="gc-rule">
          <h2 className="gc-rule-l">We Cover Every <span className="gold">Ghanaian.</span></h2>
          <span className="gc-rule-r">What We Do</span>
        </div>
        <div className="g2">
          <div className="gc-prose first">
            <p>Every weekend we go through the matches and put together compilations of the Ghanaians who stood out. Goals, assists, saves and performances worth talking about. We do not cover every single player every week. We focus on the ones who had something worth showing.</p>
            <p>We have to be honest about one thing. Not every game is available to us. Some footage is copyrighted and we simply cannot access it. We work with what we can get and we make the most of every clip we have.</p>
            <p>We also take requests. <strong>Drop a player or a game in our X comments and we will get to every game we can access.</strong> Find us at <strong>@Ghanacomps ✓</strong> on X and <strong>@ghanacompss</strong> on TikTok.</p>
          </div>
          <div className="gc-sportcards">
            <div className="gc-sportcard"><span className="gc-sportcard-chip"><SportyIcon name="ball" /></span><div className="gc-sportcard-body"><div className="gc-sportcard-t">Weekend Highlights</div><div className="gc-sportcard-b">Goals, assists, saves and standout performances from Ghanaians playing abroad. Every weekend.</div></div></div>
            <div className="gc-sportcard"><span className="gc-sportcard-chip"><SportyIcon name="trophy" /></span><div className="gc-sportcard-body"><div className="gc-sportcard-t">Legend Throwbacks</div><div className="gc-sportcard-b">Ghana has had incredible players. We bring those moments back for a new generation.</div></div></div>
            <div className="gc-sportcard"><span className="gc-sportcard-chip gr"><SportyIcon name="stadium" /></span><div className="gc-sportcard-body"><div className="gc-sportcard-t">Black Stars Coverage</div><div className="gc-sportcard-b">Full matchday coverage when Ghana play. Lineups, live goals, comps and post match breakdown.</div></div></div>
            <div className="gc-sportcard"><span className="gc-sportcard-chip"><SportyIcon name="whistle" /></span><div className="gc-sportcard-body"><div className="gc-sportcard-t">We Take Requests</div><div className="gc-sportcard-b">Drop them in our X comments. We work on every game we can access. Some footage is copyrighted and not always available.</div></div></div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="alt reveal">
        <div className="gc-rule">
          <h2 className="gc-rule-l">Started <span className="gold">January 2026.</span></h2>
          <span className="gc-rule-r">Our Story</span>
        </div>
        <div className="g2">
          <div className="gc-prose first">
            <p>Ghana Comps launched in January 2026 with one goal. Make sure Ghanaian football gets the attention it deserves. We post every weekend. We cover the players who stood out. And we bring back the legends.</p>
            <p><strong>Very early on Michael Essien saw our compilation and reposted it on both his personal TikTok and his Facebook page.</strong> That meant everything. Two months in and we were already reaching the legends themselves.</p>
            <p>Fans have been incredible too. People telling us they never knew certain players were that good. People saying we are keeping the legacy of Ghanaian legends alive. That is exactly why we do this.</p>
          </div>
          <div className="quote-stack">
            <div className="quote-block"><p className="quote-txt">"Keeping the Ghanaian midfielders legacy alive."</p><p className="quote-src">Fan reaction on X</p></div>
            <div className="quote-block r"><p className="quote-txt">"I didn't know this player was that good. Thank you for this."</p><p className="quote-src">Fan reaction on X</p></div>
            <div className="quote-block gr"><p className="quote-txt">"Love what you are doing for Ghanaian football. Keep it up."</p><p className="quote-src">Fan reaction on X</p></div>
            <div className="quote-block special">
              <p className="quote-src" style={{ marginBottom: 'var(--space-xs)', marginTop: 0 }}>★ Special Moment</p>
              <p className="quote-txt">Michael Essien acknowledged and reposted our compilation on both his Facebook and his TikTok. Two months in and the legends were already watching.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section className="reveal">
        <div className="gc-rule">
          <h2 className="gc-rule-l">This Is Just <span className="gold">the Start.</span></h2>
          <span className="gc-rule-r">Our Vision</span>
        </div>
        <div className="g2" style={{ alignItems: 'start' }}>
          <div className="gc-prose first">
            <p>We want Ghana Comps to be the place people come to when they want Ghanaian football. Not just highlights but the full story. Attribute compilations showing what made certain legends so special.</p>
            <p>Think something like Asamoah Gyan — The Goal Machine. Or Ghanaian legends at their biggest stages. Abedi Pele at Marseille. Essien at Chelsea. Appiah at Juventus. Moments that defined careers and carried the Ghana flag at the very highest level.</p>
            <p>As the platform grows we want to use it to shine a light on young Ghanaian talent. Players who deserve to be seen but have not had that chance yet.</p>
          </div>
          <div style={{ border: '1px dashed rgb(var(--gold-rgb) / .25)', padding: 'var(--space-6xl) var(--space-5xl)', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-10px', left: '18px', background: 'var(--bg)', padding: 'var(--space-3xs) var(--space-md)', fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--white)' }}>Coming Soon</span>
            <div style={{ fontSize: 'var(--fs-2xl)', marginBottom: 'var(--space-md)' }}>🌱</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-xl)', color: 'var(--white)', marginBottom: 'var(--space-md)' }}>Young Talent Showcase</div>
            <p className="lead" style={{ fontSize: 'var(--fs-base)' }}>When we build Ghana Comps to the right level we want to start featuring young footballers from across the country. Giving them visibility and putting them in front of scouts and clubs who might otherwise never have seen them.</p>
          </div>
        </div>
      </section>

      {/* FAN REACTIONS — live X embeds, added from /admin (About tab) */}
      {(reactions.length > 0 || isAdmin) && (
        <section className="alt reveal">
          <div className="gc-rule">
            <h2 className="gc-rule-l">What Ghana Football Fans Are <span className="gold">Saying.</span></h2>
            <span className="gc-rule-r">The People</span>
          </div>
          <p className="lead" style={{ marginBottom: 'var(--space-6xl)', fontSize: 'var(--fs-base)' }}>We post. They react. And the conversation never stops.</p>

          {reactions.length > 0 ? (
            <div className="gc-react-embeds">
              {reactions.map((r, i) => (
                <div key={`${r.url}-${i}`} className="gc-react-embed">
                  {r.caption && <div className="gc-embed-caption">{r.caption}</div>}
                  <UniversalEmbed url={r.url} caption={r.caption} />
                </div>
              ))}
            </div>
          ) : (
            <div className="post-placeholder"><p>No fan reactions yet — add X posts from the admin panel (About tab).</p></div>
          )}
        </section>
      )}

      {/* REQUESTS */}
      <section className="reveal">
        <div className="gc-rule">
          <h2 className="gc-rule-l">They Ask. <span className="gold">We Deliver.</span></h2>
          <span className="gc-rule-r">The Requests</span>
        </div>
        <p className="lead" style={{ marginBottom: 'var(--space-6xl)', fontSize: 'var(--fs-base)' }}>Every request goes into the list. Some footage is copyrighted and not always available but when we can do it we do it fast.</p>

        <div style={{ marginBottom: 'var(--space-7xl)' }}>
          <p style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 'var(--space-lg)' }}>★ Requested and Delivered in 24 Hours</p>
          <div className="req-pair">
            <div><div className="req-lbl">The Request</div><img src="/assets/reactions/req01.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }} /></div>
            <div className="req-arrow">→</div>
            <div><div className="req-lbl">Delivered Next Day</div><img src="/assets/reactions/req11.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--line)' }} /></div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-6xl)' }}>
          <p style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--sub)', marginBottom: 'var(--space-lg)' }}>More Requests</p>
          <div className="req-grid">
            <div className="req-single"><img src="/assets/reactions/req04.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req05.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req06.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req07.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req09.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req08.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} /></div>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-6xl)' }}>
          <p style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--sub)', marginBottom: 'var(--space-lg)' }}>Requests Granted</p>
          <div className="req-grid">
            <div className="req-single"><img src="/assets/reactions/req10.jpg" alt="" style={{ width: '100%', borderRadius: 'var(--radius-md)' }} /></div>
          </div>
        </div>
      </section>

      {/* ESSIEN SPECIAL MOMENT */}
      <section className="alt reveal">
        <div className="gc-rule">
          <h2 className="gc-rule-l">When <span className="gold">Essien Watched.</span></h2>
          <span className="gc-rule-r">Special Moment</span>
        </div>
        <p className="lead" style={{ marginBottom: 'var(--space-5xl)', fontSize: 'var(--fs-base)' }}>Two months in and we were already reaching the legends. Michael Essien saw our compilation and acknowledged it on both his TikTok and his Facebook.</p>
        <div className="special-box">
          <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--white)', marginBottom: 'var(--space-xl)' }}>★ Special Moment</div>
          <p className="italic" style={{ fontSize: 'var(--fs-lg)', color: 'var(--white)', maxWidth: '560px', lineHeight: 'var(--lh-body)' }}>"Incredible experience, Thanks #ghanacomps @fifaworldcup"</p>
          <p style={{ fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-3)', textTransform: 'uppercase', color: 'var(--sub)', marginTop: 'var(--space-sm)' }}>Michael Essien ✓ — on TikTok and Facebook</p>
          <div className="special-screens">
            <button
              type="button"
              className="special-screen"
              aria-label="View Essien TikTok repost"
              onClick={e => openLightbox(e, '/assets/essien_tiktok.jpg', 'Essien TikTok repost')}
            >
              <img src="/assets/essien_tiktok.jpg" alt="Essien TikTok repost" />
              <ExpandGlyph />
              <div className="screen-lbl">TikTok — 113.2K Likes</div>
            </button>
            <button
              type="button"
              className="special-screen"
              aria-label="View Essien Facebook repost"
              onClick={e => openLightbox(e, '/assets/essien_facebook.jpg', 'Essien Facebook repost')}
            >
              <img src="/assets/essien_facebook.jpg" alt="Essien Facebook repost" />
              <ExpandGlyph />
              <div className="screen-lbl">Facebook — 5K Likes · 54K Views</div>
            </button>
          </div>
        </div>
      </section>

      <Footer />
      <Stripe />

      {lightbox && (
        <ImageLightbox
          src={lightbox.src}
          label={lightbox.label}
          triggerEl={lightbox.triggerEl}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  );
}
