import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import { useAdmin } from '../contexts/AdminContext';

const reactionGroups = [
  { label: '⚽ Michael Essien', images: [{ id: 'rimg-1', src: 'r16' }, { id: 'rimg-2', src: 'r06' }, { id: 'rimg-3', src: 'r20' }] },
  { label: '⚽ Anthony Annan', images: [{ id: 'rimg-4', src: 'r23' }, { id: 'rimg-5', src: 'r37' }, { id: 'rimg-6', src: 'r15' }] },
  { label: '⚽ Asamoah Gyan', images: [{ id: 'rimg-12', src: 'r22' }, { id: 'rimg-13', src: 'r37' }, { id: 'rimg-15', src: 'r35' }] },
  { label: '⚽ Kwadwo Asamoah', images: [{ id: 'rimg-10', src: 'r30' }, { id: 'rimg-11', src: 'r09' }] },
  { label: '⚽ Stephen Appiah', images: [{ id: 'rimg-14', src: 'r28' }, { id: 'rimg-17', src: 'r32' }] },
  { label: '⚽ Abedi Pele', images: [{ id: 'rimg-16', src: 'r41' }, { id: 'rimg-8', src: 'r42' }] },
  { label: '🧤 Richard Kingson', images: [{ id: 'rimg-7', src: 'r21' }] },
  { label: '🇬🇭 Current Players and General', images: [{ id: 'rimg-20', src: 'r11' }, { id: 'rimg-21', src: 'r24' }, { id: 'rimg-22', src: 'r25' }, { id: 'rimg-18', src: 'r19' }] },
  { label: '💛 Praise for Ghana Comps', images: [{ id: 'rimg-23', src: 'r04' }, { id: 'rimg-24', src: 'r02' }, { id: 'rimg-25', src: 'r03' }, { id: 'rimg-26', src: 'r01' }, { id: 'rimg-27', src: 'r07' }, { id: 'rimg-28', src: 'r10' }] },
];

function getRemovedImgs(): string[] {
  try { return JSON.parse(localStorage.getItem('gc_removed_imgs') || '[]'); } catch { return []; }
}

export default function About() {
  const { isAdmin } = useAdmin();
  const [removedImgs, setRemovedImgs] = useState<string[]>(getRemovedImgs);

  useEffect(() => {
    setRemovedImgs(getRemovedImgs());
  }, [isAdmin]);

  function removeReactImg(id: string) {
    if (!isAdmin) return;
    if (!confirm('Remove this screenshot?')) return;
    const updated = [...removedImgs, id];
    localStorage.setItem('gc_removed_imgs', JSON.stringify(updated));
    setRemovedImgs(updated);
  }

  return (
    <>
      <Stripe />
      <Nav />

      <div className="page-header reveal">
        <div className="eyebrow">Our Story</div>
        <h1 className="d2">About <span className="gold">Ghana Comps.</span></h1>
        <p className="lead italic" style={{ marginTop: '10px' }}>We started this because we love Ghanaian football and felt it was not getting the attention it deserved. So we decided to change that.</p>
      </div>

      {/* WHAT WE DO */}
      <section className="reveal">
        <div className="g2">
          <div>
            <div className="eyebrow">What We Do</div>
            <h2 className="d2" style={{ marginBottom: '14px' }}>We Cover Every <span className="gold">Ghanaian.</span></h2>
            <p className="lead" style={{ marginBottom: '12px' }}>Every weekend we go through the matches and put together compilations of the Ghanaians who stood out. Goals, assists, saves and performances worth talking about. We do not cover every single player every week. We focus on the ones who had something worth showing.</p>
            <p className="lead" style={{ marginBottom: '12px' }}>We have to be honest about one thing. Not every game is available to us. Some footage is copyrighted and we simply cannot access it. We work with what we can get and we make the most of every clip we have.</p>
            <p className="lead">We also take requests. <strong>Drop a player or a game in our X comments and we will get to every game we can access.</strong> Find us at <strong>@Ghanacomps ✓</strong> on X and <strong>@ghanacompss</strong> on TikTok.</p>
          </div>
          <div className="stack">
            <div className="stack-item"><div className="stack-icon">⚽</div><div><div className="stack-t">Weekend Highlights</div><div className="stack-b">Goals, assists, saves and standout performances from Ghanaians playing abroad. Every weekend.</div></div></div>
            <div className="stack-item"><div className="stack-icon">📼</div><div><div className="stack-t">Legend Throwbacks</div><div className="stack-b">Ghana has had incredible players. We bring those moments back for a new generation.</div></div></div>
            <div className="stack-item"><div className="stack-icon">🇬🇭</div><div><div className="stack-t">Black Stars Coverage</div><div className="stack-b">Full matchday coverage when Ghana play. Lineups, live goals, comps and post match breakdown.</div></div></div>
            <div className="stack-item"><div className="stack-icon">💬</div><div><div className="stack-t">We Take Requests</div><div className="stack-b">Drop them in our X comments. We work on every game we can access. Some footage is copyrighted and not always available.</div></div></div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="alt reveal">
        <div className="g2">
          <div>
            <div className="eyebrow">Our Story</div>
            <h2 className="d2" style={{ marginBottom: '14px' }}>Started <span className="gold">January 2026.</span></h2>
            <p className="lead" style={{ marginBottom: '12px' }}>Ghana Comps launched in January 2026 with one goal. Make sure Ghanaian football gets the attention it deserves. We post every weekend. We cover the players who stood out. And we bring back the legends.</p>
            <p className="lead" style={{ marginBottom: '12px' }}><strong>Very early on Michael Essien saw our compilation and reposted it on both his personal TikTok and his Facebook page.</strong> That meant everything. Two months in and we were already reaching the legends themselves.</p>
            <p className="lead">Fans have been incredible too. People telling us they never knew certain players were that good. People saying we are keeping the legacy of Ghanaian legends alive. That is exactly why we do this.</p>
          </div>
          <div className="quote-stack">
            <div className="quote-block"><p className="quote-txt">"Keeping the Ghanaian midfielders legacy alive."</p><p className="quote-src">Fan reaction on X</p></div>
            <div className="quote-block r"><p className="quote-txt">"I didn't know this player was that good. Thank you for this."</p><p className="quote-src">Fan reaction on X</p></div>
            <div className="quote-block gr"><p className="quote-txt">"Love what you are doing for Ghanaian football. Keep it up."</p><p className="quote-src">Fan reaction on X</p></div>
            <div className="quote-block special">
              <p className="quote-src" style={{ marginBottom: '6px', marginTop: 0 }}>★ Special Moment</p>
              <p className="quote-txt">Michael Essien acknowledged and reposted our compilation on both his Facebook and his TikTok. Two months in and the legends were already watching.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OUR VISION */}
      <section className="reveal">
        <div className="g2" style={{ alignItems: 'start' }}>
          <div>
            <div className="eyebrow">Our Vision</div>
            <h2 className="d2" style={{ marginBottom: '14px' }}>This Is Just <span className="gold">the Start.</span></h2>
            <p className="lead" style={{ marginBottom: '12px' }}>We want Ghana Comps to be the place people come to when they want Ghanaian football. Not just highlights but the full story. Attribute compilations showing what made certain legends so special.</p>
            <p className="lead" style={{ marginBottom: '12px' }}>Think something like Asamoah Gyan — The Goal Machine. Or Ghanaian legends at their biggest stages. Abedi Pele at Marseille. Essien at Chelsea. Appiah at Juventus. Moments that defined careers and carried the Ghana flag at the very highest level.</p>
            <p className="lead">As the platform grows we want to use it to shine a light on young Ghanaian talent. Players who deserve to be seen but have not had that chance yet.</p>
          </div>
          <div style={{ border: '1px dashed rgb(var(--gold-rgb) / .25)', padding: '28px 24px', position: 'relative' }}>
            <span style={{ position: 'absolute', top: '-10px', left: '18px', background: 'var(--bg)', padding: '2px 10px', fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)' }}>Coming Soon</span>
            <div style={{ fontSize: 'var(--fs-2xl)', marginBottom: '10px' }}>🌱</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: 'var(--fs-xl)', color: 'var(--white)', marginBottom: '10px' }}>Young Talent Showcase</div>
            <p className="lead" style={{ fontSize: 'var(--fs-base)' }}>When we build Ghana Comps to the right level we want to start featuring young footballers from across the country. Giving them visibility and putting them in front of scouts and clubs who might otherwise never have seen them.</p>
          </div>
        </div>
      </section>

      {/* FAN REACTIONS GALLERY */}
      <section className="alt reveal">
        <div className="eyebrow">The People</div>
        <h2 className="d2" style={{ marginBottom: '8px' }}>What Ghana Football Fans Are <span className="gold">Saying.</span></h2>
        <p className="lead" style={{ marginBottom: '32px', fontSize: 'var(--fs-base)' }}>We post. They react. And the conversation never stops.</p>

        {reactionGroups.map(group => (
          <div key={group.label} className="player-group">
            <div className="group-label">{group.label}</div>
            <div className="react-grid">
              {group.images.filter(img => !removedImgs.includes(img.id)).map(img => (
                <div key={img.id} className="react-img-wrap" id={img.id}>
                  <img src={`/assets/reactions/${img.src}.jpg`} alt="" className="react-img" />
                  {isAdmin && (
                    <button className="react-remove-btn" onClick={() => removeReactImg(img.id)}>✕</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* REQUESTS */}
      <section className="reveal">
        <div className="eyebrow">The Requests</div>
        <h2 className="d2" style={{ marginBottom: '8px' }}>They Ask. <span className="gold">We Deliver.</span></h2>
        <p className="lead" style={{ marginBottom: '28px', fontSize: 'var(--fs-base)' }}>Every request goes into the list. Some footage is copyrighted and not always available but when we can do it we do it fast.</p>

        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '12px' }}>★ Requested and Delivered in 24 Hours</p>
          <div className="req-pair">
            <div><div className="req-lbl">The Request</div><img src="/assets/reactions/req01.jpg" alt="" style={{ width: '100%', borderRadius: '3px', border: '1px solid var(--line)' }} /></div>
            <div className="req-arrow">→</div>
            <div><div className="req-lbl">Delivered Next Day</div><img src="/assets/reactions/req11.jpg" alt="" style={{ width: '100%', borderRadius: '3px', border: '1px solid var(--line)' }} /></div>
          </div>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--sub)', marginBottom: '12px' }}>More Requests</p>
          <div className="req-grid">
            <div className="req-single"><img src="/assets/reactions/req04.jpg" alt="" style={{ width: '100%', borderRadius: '3px' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req05.jpg" alt="" style={{ width: '100%', borderRadius: '3px' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req06.jpg" alt="" style={{ width: '100%', borderRadius: '3px' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req07.jpg" alt="" style={{ width: '100%', borderRadius: '3px' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req09.jpg" alt="" style={{ width: '100%', borderRadius: '3px' }} /></div>
            <div className="req-single"><img src="/assets/reactions/req08.jpg" alt="" style={{ width: '100%', borderRadius: '3px' }} /></div>
          </div>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--sub)', marginBottom: '12px' }}>Requests Granted</p>
          <div className="req-grid">
            <div className="req-single"><img src="/assets/reactions/req10.jpg" alt="" style={{ width: '100%', borderRadius: '3px' }} /></div>
          </div>
        </div>
      </section>

      {/* ESSIEN SPECIAL MOMENT */}
      <section className="alt reveal">
        <div className="eyebrow">Special Moment</div>
        <h2 className="d2" style={{ marginBottom: '8px' }}>When <span className="gold">Essien Watched.</span></h2>
        <p className="lead" style={{ marginBottom: '24px', fontSize: 'var(--fs-base)' }}>Two months in and we were already reaching the legends. Michael Essien saw our compilation and acknowledged it on both his TikTok and his Facebook.</p>
        <div className="special-box">
          <div style={{ fontSize: 'var(--fs-micro)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '14px' }}>★ Special Moment</div>
          <p className="italic" style={{ fontSize: 'var(--fs-lg)', color: 'var(--white)', maxWidth: '560px', lineHeight: 'var(--lh-body)' }}>"Incredible experience, Thanks #ghanacomps @fifaworldcup"</p>
          <p style={{ fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-3)', textTransform: 'uppercase', color: 'var(--sub)', marginTop: '8px' }}>Michael Essien ✓ — on TikTok and Facebook</p>
          <div className="special-screens">
            <div className="special-screen">
              <img src="/assets/essien_tiktok.jpg" alt="Essien TikTok repost" />
              <div className="screen-lbl">TikTok — 113.2K Likes</div>
            </div>
            <div className="special-screen">
              <img src="/assets/essien_facebook.jpg" alt="Essien Facebook repost" />
              <div className="screen-lbl">Facebook — 5K Likes · 54K Views</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
