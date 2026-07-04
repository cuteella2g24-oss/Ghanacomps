import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import Editable from '../components/Editable';
import { useAdmin } from '../contexts/AdminContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GpaLinks {
  mwr?: { caption: string; url: string };
  potw?: { caption: string; url: string };
  goal?: { caption: string; url: string };
  assist?: { caption: string; url: string };
  up?: { caption: string; url: string };
}

function GpaBlock({
  id,
  sectionClass,
  labelClass,
  label,
  nameEid,
  nameDef,
  bodyEid,
  bodyDef,
  linkDefault,
  links,
  onSaveLink,
  onClearLink,
  isAdmin,
}: {
  id: keyof GpaLinks;
  sectionClass?: string;
  labelClass?: string;
  label: string;
  nameEid: string;
  nameDef: string;
  bodyEid: string;
  bodyDef: string;
  linkDefault: string;
  links: GpaLinks;
  onSaveLink: (id: keyof GpaLinks, caption: string, url: string) => void;
  onClearLink: (id: keyof GpaLinks) => void;
  isAdmin: boolean;
}) {
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');
  const linkData = links[id];

  return (
    <div className={`gpa-write-block${sectionClass ? ' ' + sectionClass : ''}`}>
      <div className={`gpa-write-label${labelClass ? ' ' + labelClass : ''}`}>{label}</div>
      <Editable tag="div" eid={nameEid} className="gpa-write-heading">{nameDef}</Editable>
      <Editable tag="div" eid={bodyEid} className="gpa-write-body">{bodyDef}</Editable>
      <div className="gpa-link-wrap">
        {linkData?.url ? (
          <a href={linkData.url} target="_blank" rel="noopener" className="gpa-link-btn">{linkData.caption}</a>
        ) : null}
      </div>
      {isAdmin && (
        <div className="gpa-admin-link admin-only" style={{ display: 'flex' }}>
          <input type="text" placeholder={`Link caption e.g. ${linkDefault}`} value={caption} onChange={e => setCaption(e.target.value)} />
          <input type="url" placeholder="Paste X or TikTok URL..." value={url} onChange={e => setUrl(e.target.value)} />
          <button onClick={() => { if (!caption || !url) { alert('Please fill in both the caption and URL.'); return; } onSaveLink(id, caption, url); setCaption(''); setUrl(''); }} className="btn primary" style={{ fontSize: 'var(--fs-2xs)', padding: 'var(--space-sm) var(--space-xl)' }}>Set Link</button>
          <button onClick={() => onClearLink(id)} className="btn outline" style={{ fontSize: 'var(--fs-2xs)', padding: 'var(--space-sm) var(--space-xl)' }}>Remove</button>
        </div>
      )}
    </div>
  );
}

export default function GPA() {
  const { isAdmin } = useAdmin();
  const [links, setLinks] = useLocalStorage<GpaLinks>('gc_gpa_links', {});

  function saveLink(id: keyof GpaLinks, caption: string, url: string) {
    setLinks({ ...links, [id]: { caption, url } });
  }

  function clearLink(id: keyof GpaLinks) {
    const updated = { ...links };
    delete updated[id];
    setLinks(updated);
  }

  return (
    <>
      <Stripe />
      <Nav />

      <div className="page-header">
        <div className="eyebrow">Updated Every Week</div>
        <h1 className="d2"><span className="gold">GPA</span> Weekly.</h1>
        <p style={{ fontSize: 'var(--fs-2xs)', letterSpacing: 'var(--ls-4)', textTransform: 'uppercase', color: 'var(--sub)', marginTop: 'var(--space-2xs)' }}>Ghanaian Players Abroad</p>
        <p className="lead" style={{ marginTop: 'var(--space-md)' }}>Every week we break down what happened, what stood out and what deserved more attention.</p>
      </div>

      {/* 1. MATCHWEEK REVIEW */}
      <section>
        <div className="eyebrow">Matchweek Review</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-4xl)' }}><Editable tag="span" eid="mwr-heading" className="gold">Matchweek 34 Review.</Editable></h2>
        <div style={{ maxWidth: '760px' }}>
          <GpaBlock
            id="mwr"
            label="This Week's Breakdown"
            nameEid=""
            nameDef=""
            bodyEid="mwr-body"
            bodyDef="Write your matchweek review here. Talk about the week in Ghanaian football — what impressed you, what disappointed, the conversation that needs to happen. This is your column, written in your voice."
            linkDefault="Watch: Kudus vs Man City — Matchday 38"
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
        </div>
      </section>

      {/* 2. PLAYER OF THE WEEK */}
      <section className="alt">
        <div className="eyebrow">Player of the Week</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-4xl)' }}>Who <span className="gold">Stood Out.</span></h2>
        <div style={{ maxWidth: '760px' }}>
          <GpaBlock
            id="potw"
            sectionClass="red"
            labelClass="red"
            label="Player of the Week"
            nameEid="potw-name"
            nameDef="Updated Every Monday"
            bodyEid="potw-body"
            bodyDef="Write about the player of the week here. What did he do, which game, what made the performance stand out. Talk about the details — the numbers, the moments, the context. This is a written breakdown, not just a caption."
            linkDefault="Watch: Kudus vs Man City — Matchday 38"
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
        </div>
      </section>

      {/* 3. GOAL AND ASSIST */}
      <section>
        <div className="eyebrow">Goal and Assist of the Week</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-4xl)' }}>The Moments <span className="gold">Worth Watching.</span></h2>
        <div style={{ maxWidth: '760px' }}>
          <GpaBlock
            id="goal"
            label="Goal of the Week"
            nameEid="goal-name"
            nameDef="Coming Monday"
            bodyEid="goal-body"
            bodyDef="Write about the goal here. Which player, which game, what made it special. Not every goal is equal — explain why this one deserved to be picked."
            linkDefault="Link caption..."
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
          <GpaBlock
            id="assist"
            label="Assist of the Week"
            nameEid="assist-name"
            nameDef="Coming Monday"
            bodyEid="assist-body"
            bodyDef="Write about the assist here. The pass that made everything possible. The one nobody talked about."
            linkDefault="Link caption..."
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
        </div>
      </section>

      {/* 4. UNDERRATED */}
      <section className="alt">
        <div className="eyebrow">Underrated Performance of the Week</div>
        <h2 className="d2" style={{ marginBottom: 'var(--space-xl)' }}>The One <span className="gold">Everybody Missed.</span></h2>
        <div style={{ maxWidth: '760px' }}>
          <GpaBlock
            id="up"
            sectionClass="grn"
            label="Underrated Performance"
            nameEid="up-name"
            nameDef="Updated Every Week"
            bodyEid="up-body"
            bodyDef="Write about the performance that deserved more noise. The player who did their job brilliantly and got no credit. Every week someone has a brilliant game and the world moves on without noticing. Find them. Write about them. Make sure they are seen."
            linkDefault="Link caption..."
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
        </div>
      </section>

      <Footer />
      <Stripe />
    </>
  );
}
