import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import SportyIcon from '../components/SportyIcon';
import { Button } from '@/components/ui/button';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('Player or Game Request');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) { alert('Please fill in all required fields.'); return; }
    const subject = encodeURIComponent(`Ghana Comps — ${reason}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nReason: ${reason}\n\n${message}`);
    window.location.href = `mailto:compsghana@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <>
      <Stripe />
      <Nav />

      <div className="gc-pagehead gc-chevrons quiet reveal">
        <div className="gc-pagehead-inner">
          <div className="gc-scorebug">
            <span className="live">Get In Touch</span>
          </div>
          <h1 className="gc-ph-title">Talk to <span className="gold">Ghana Comps.</span></h1>
          <p className="gc-ph-lead">Want to suggest a player or a game? Have feedback? Or just want to connect? We read everything.</p>
        </div>
      </div>

      <section className="reveal">
        <div className="g2">
          <div>
            <div className="gc-rule" style={{ marginBottom: 'var(--space-5xl)' }}>
              <h2 className="gc-rule-l">Send a Message</h2>
            </div>
            <p className="lead" style={{ marginBottom: 'var(--space-4xl)', fontSize: 'var(--fs-base)' }}>Fill in the form and click Send Message. Your email app will open with everything pre-filled. Just hit send.</p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label className="form-lbl" htmlFor="fn">Your Name</label>
                <input className="form-inp" type="text" id="fn" placeholder="Enter your name" required value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="form-row">
                <label className="form-lbl" htmlFor="fe">Your Email</label>
                <input className="form-inp" type="email" id="fe" placeholder="Enter your email" required value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="form-row">
                <label className="form-lbl" htmlFor="fr">Reason</label>
                <select className="form-inp" id="fr" value={reason} onChange={e => setReason(e.target.value)}>
                  <option>Player or Game Request</option>
                  <option>General Feedback</option>
                  <option>Content Suggestion</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-row">
                <label className="form-lbl" htmlFor="fm">Your Message</label>
                <textarea className="form-inp" id="fm" rows={5} placeholder="Tell us what you need..." required value={message} onChange={e => setMessage(e.target.value)} />
              </div>
              <Button type="submit">Send Message</Button>
              {sent && (
                <div className="form-ok" style={{ display: 'block' }}>Your message is ready. Just hit send in your email app and we will get back to you.</div>
              )}
            </form>
          </div>

          <div className="gc-sportcards">
            <div className="gc-sportcard">
              <span className="gc-sportcard-chip"><SportyIcon name="mail" /></span>
              <div className="gc-sportcard-body">
                <div className="gc-sportcard-t">Email Us</div>
                <a href="mailto:compsghana@gmail.com" style={{ color: 'var(--gold)', fontSize: 'var(--fs-base)' }}>compsghana@gmail.com</a>
                <div className="gc-sportcard-b" style={{ marginTop: 'var(--space-2xs)' }}>For general enquiries, feedback and content requests.</div>
              </div>
            </div>
            <div className="gc-sportcard">
              <span className="gc-sportcard-chip"><SportyIcon name="broadcast" /></span>
              <div className="gc-sportcard-body">
                <div className="gc-sportcard-t">Find Us on X</div>
                <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" style={{ color: 'var(--gold)', fontSize: 'var(--fs-base)' }}>@Ghanacomps ✓</a>
                <div className="gc-sportcard-b" style={{ marginTop: 'var(--space-2xs)' }}>Drop your comp requests in our quotes or comments. We go through all of them.</div>
              </div>
            </div>
            <div className="gc-sportcard">
              <span className="gc-sportcard-chip"><SportyIcon name="ball" /></span>
              <div className="gc-sportcard-body">
                <div className="gc-sportcard-t">Find Us on TikTok</div>
                <a href="https://tiktok.com/@ghanacompss" target="_blank" rel="noopener" style={{ color: 'var(--gold)', fontSize: 'var(--fs-base)' }}>@ghanacompss</a>
                <div className="gc-sportcard-b" style={{ marginTop: 'var(--space-2xs)' }}>Goals, assists and skills every weekend on TikTok.</div>
              </div>
            </div>
            <div className="gc-sportcard">
              <span className="gc-sportcard-chip"><SportyIcon name="broadcast" /></span>
              <div className="gc-sportcard-body">
                <div className="gc-sportcard-t">Find Us on Facebook</div>
                <a href="https://www.facebook.com/share/1GL7b1Qsuq/" target="_blank" rel="noopener" style={{ color: 'var(--gold)', fontSize: 'var(--fs-base)' }}>Ghana Comps on Facebook</a>
                <div className="gc-sportcard-b" style={{ marginTop: 'var(--space-2xs)' }}>Follow us on Facebook for highlights, throwbacks and updates.</div>
              </div>
            </div>
            <div className="gc-sportcard gc-sportcard--accent">
              <span className="gc-sportcard-chip"><SportyIcon name="whistle" /></span>
              <div className="gc-sportcard-body">
                <div className="gc-sportcard-t">A Note on Requests</div>
                <div className="gc-sportcard-b">We work on every game we can access. Some footage is copyrighted and not always available. The best place to drop requests is in the quotes and comments on our X posts.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="alt reveal" style={{ textAlign: 'center' }}>
        <p className="italic" style={{ fontSize: 'var(--fs-lg)', color: 'var(--body)', lineHeight: 'var(--lh-relaxed)', maxWidth: '580px', margin: '0 auto' }}>
          Ghana Comps has big plans ahead. Brand partnerships, deeper coverage and a platform that helps young Ghanaian talent get discovered. <strong style={{ color: 'var(--white)' }}>Watch this space.</strong>
        </p>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
