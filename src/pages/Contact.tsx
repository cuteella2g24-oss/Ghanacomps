import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';

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

      <div className="page-header reveal">
        <div className="eyebrow">Get In Touch</div>
        <h1 className="d2">Talk to <span className="gold">Ghana Comps.</span></h1>
        <p className="lead" style={{ marginTop: '10px' }}>Want to suggest a player or a game? Have feedback? Or just want to connect? We read everything.</p>
      </div>

      <section className="reveal">
        <div className="g2">
          <div>
            <div className="eyebrow plain">Send a Message</div>
            <p className="lead" style={{ marginBottom: '20px', fontSize: '0.82rem' }}>Fill in the form and click Send Message. Your email app will open with everything pre-filled. Just hit send.</p>
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
              <button type="submit" className="btn primary">Send Message</button>
              {sent && (
                <div className="form-ok" style={{ display: 'block' }}>Your message is ready. Just hit send in your email app and we will get back to you.</div>
              )}
            </form>
          </div>

          <div className="stack">
            <div className="stack-item">
              <div className="stack-icon">📧</div>
              <div>
                <div className="stack-t">Email Us</div>
                <a href="mailto:compsghana@gmail.com" style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>compsghana@gmail.com</a>
                <div className="stack-b" style={{ marginTop: '3px' }}>For general enquiries, feedback and content requests.</div>
              </div>
            </div>
            <div className="stack-item">
              <div className="stack-icon">𝕏</div>
              <div>
                <div className="stack-t">Find Us on X</div>
                <a href="https://x.com/Ghanacomps" target="_blank" rel="noopener" style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>@Ghanacomps ✓</a>
                <div className="stack-b" style={{ marginTop: '3px' }}>Drop your comp requests in our quotes or comments. We go through all of them.</div>
              </div>
            </div>
            <div className="stack-item">
              <div className="stack-icon">🎵</div>
              <div>
                <div className="stack-t">Find Us on TikTok</div>
                <a href="https://tiktok.com/@ghanacompss" target="_blank" rel="noopener" style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>@ghanacompss</a>
                <div className="stack-b" style={{ marginTop: '3px' }}>Goals, assists and skills every weekend on TikTok.</div>
              </div>
            </div>
            <div className="stack-item">
              <div className="stack-icon">👥</div>
              <div>
                <div className="stack-t">Find Us on Facebook</div>
                <a href="https://www.facebook.com/share/1GL7b1Qsuq/" target="_blank" rel="noopener" style={{ color: 'var(--gold)', fontSize: '0.82rem' }}>Ghana Comps on Facebook</a>
                <div className="stack-b" style={{ marginTop: '3px' }}>Follow us on Facebook for highlights, throwbacks and updates.</div>
              </div>
            </div>
            <div className="stack-item" style={{ borderLeft: '2px solid var(--gold)' }}>
              <div className="stack-icon">📌</div>
              <div>
                <div className="stack-t">A Note on Requests</div>
                <div className="stack-b">We work on every game we can access. Some footage is copyrighted and not always available. The best place to drop requests is in the quotes and comments on our X posts.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="alt" style={{ textAlign: 'center' }}>
        <p className="italic reveal" style={{ fontSize: '0.95rem', color: 'var(--body)', lineHeight: 1.85, maxWidth: '580px', margin: '0 auto' }}>
          Ghana Comps has big plans ahead. Brand partnerships, deeper coverage and a platform that helps young Ghanaian talent get discovered. <strong style={{ color: 'var(--white)' }}>Watch this space.</strong>
        </p>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
