import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stripe from '../components/Stripe';
import { useAdmin } from '../contexts/AdminContext';
import { useContent, useContentList } from '../contexts/ContentContext';
import { Button } from '@/components/ui/button';

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
  nameKey,
  nameDef,
  bodyKey,
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
  /** Content field key for the block heading (player/status). Omit for none. */
  nameKey?: string;
  nameDef?: string;
  /** Content field key for the written breakdown (blank line = new paragraph). */
  bodyKey: string;
  linkDefault: string;
  links: GpaLinks;
  onSaveLink: (id: keyof GpaLinks, caption: string, url: string) => void;
  onClearLink: (id: keyof GpaLinks) => void;
  isAdmin: boolean;
}) {
  const { getField } = useContent();
  const [caption, setCaption] = useState('');
  const [url, setUrl] = useState('');
  const linkData = links[id];
  const name = nameKey ? getField(nameKey, nameDef ?? '') : '';
  const body = getField(bodyKey, '').trim();

  return (
    <div className={`gpa-write-block${sectionClass ? ' ' + sectionClass : ''}`}>
      <div className={`gpa-write-label${labelClass ? ' ' + labelClass : ''}`}>{label}</div>
      {name && <div className="gpa-write-heading">{name}</div>}
      {body ? (
        <div className="gpa-write-body">
          {body.split(/\n\n+/).map((para, i) => <p key={i}>{para}</p>)}
        </div>
      ) : isAdmin ? (
        <p className="gpa-write-hint">No write-up yet — add it from the admin panel (GPA tab).</p>
      ) : null}
      {linkData?.url && (
        <div className="gpa-link-wrap">
          <a href={linkData.url} target="_blank" rel="noopener" className="gpa-link-btn">{linkData.caption}</a>
        </div>
      )}
      {isAdmin && (
        <div className="gpa-admin-link admin-only" style={{ display: 'flex' }}>
          <input type="text" placeholder={`Link caption e.g. ${linkDefault}`} value={caption} onChange={e => setCaption(e.target.value)} />
          <input type="url" placeholder="Paste X or TikTok URL..." value={url} onChange={e => setUrl(e.target.value)} />
          <Button size="sm" onClick={() => { if (!caption || !url) { alert('Please fill in both the caption and URL.'); return; } onSaveLink(id, caption, url); setCaption(''); setUrl(''); }}>Set Link</Button>
          <Button variant="outline" size="sm" onClick={() => onClearLink(id)}>Remove</Button>
        </div>
      )}
    </div>
  );
}

export default function GPA() {
  const { isAdmin } = useAdmin();
  const { getField } = useContent();
  const [links, setLinks] = useContentList<GpaLinks>('gc_gpa_links', {});

  function saveLink(id: keyof GpaLinks, caption: string, url: string) {
    setLinks({ ...links, [id]: { caption, url } });
  }

  function clearLink(id: keyof GpaLinks) {
    const updated = { ...links };
    delete updated[id];
    setLinks(updated);
  }

  // A block counts as "filled" once the admin has written a body or set a link.
  // Sections with no filled block are hidden on the public site; admins always
  // see every section so they can add content.
  const hasContent = (bodyKey: string, id: keyof GpaLinks) =>
    getField(bodyKey, '').trim() !== '' || !!links[id]?.url;

  const showMwr = isAdmin || hasContent('gpa-mwr-body', 'mwr');
  const showPotw = isAdmin || hasContent('gpa-potw-body', 'potw');
  const showGoal = hasContent('gpa-goal-body', 'goal');
  const showAssist = hasContent('gpa-assist-body', 'assist');
  const showGoalAssist = isAdmin || showGoal || showAssist;
  const showUp = isAdmin || hasContent('gpa-up-body', 'up');

  return (
    <>
      <Stripe />
      <Nav />

      <div className="gc-pagehead gc-chevrons medium reveal">
        <div className="gc-pagehead-inner">
          <div className="gc-scorebug">
            <span className="live">Updated Every Week</span>
            <span className="meta">Ghanaian Players Abroad</span>
          </div>
          <h1 className="gc-ph-title"><span className="gold">GPA</span> Weekly.</h1>
          <p className="gc-ph-lead">Every week we break down what happened, what stood out and what deserved more attention.</p>
        </div>
      </div>

      {/* 1. MATCHWEEK REVIEW — editorial column */}
      {showMwr && (
        <section className="gc-editorial reveal">
          <div className="gc-rule">
            <span className="gc-rule-eyebrow">Matchweek Review</span>
          </div>
          <h2 className="gc-col-head">{getField('gpa-mwr-heading', 'Matchweek 34 Review.')}</h2>
          <GpaBlock
            id="mwr"
            label="This Week's Breakdown"
            bodyKey="gpa-mwr-body"
            linkDefault="Watch: Kudus vs Man City — Matchday 38"
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
        </section>
      )}

      {/* 2. PLAYER OF THE WEEK (red accent) */}
      {showPotw && (
        <section className="gc-editorial alt red-accent reveal">
          <div className="gc-rule">
            <span className="gc-rule-eyebrow r">Player of the Week</span>
          </div>
          <h2 className="gc-col-head">Who <span className="gold">Stood Out.</span></h2>
          <GpaBlock
            id="potw"
            sectionClass="red"
            labelClass="red"
            label="Player of the Week"
            nameKey="gpa-potw-name"
            nameDef="Updated Every Monday"
            bodyKey="gpa-potw-body"
            linkDefault="Watch: Kudus vs Man City — Matchday 38"
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
        </section>
      )}

      {/* 3. GOAL AND ASSIST (two-block split) */}
      {showGoalAssist && (
        <section className="gc-editorial reveal">
          <div className="gc-rule">
            <span className="gc-rule-eyebrow">Goal and Assist of the Week</span>
          </div>
          <h2 className="gc-col-head">The Moments <span className="gold">Worth Watching.</span></h2>
          <div className="gc-col-split">
            {(isAdmin || showGoal) && (
              <div>
                <GpaBlock
                  id="goal"
                  label="Goal of the Week"
                  nameKey="gpa-goal-name"
                  nameDef="Coming Monday"
                  bodyKey="gpa-goal-body"
                  linkDefault="Link caption..."
                  links={links}
                  onSaveLink={saveLink}
                  onClearLink={clearLink}
                  isAdmin={isAdmin}
                />
              </div>
            )}
            {(isAdmin || showAssist) && (
              <div>
                <GpaBlock
                  id="assist"
                  label="Assist of the Week"
                  nameKey="gpa-assist-name"
                  nameDef="Coming Monday"
                  bodyKey="gpa-assist-body"
                  linkDefault="Link caption..."
                  links={links}
                  onSaveLink={saveLink}
                  onClearLink={clearLink}
                  isAdmin={isAdmin}
                />
              </div>
            )}
          </div>
        </section>
      )}

      {/* 4. UNDERRATED (green accent) */}
      {showUp && (
        <section className="gc-editorial alt green-accent reveal">
          <div className="gc-rule">
            <span className="gc-rule-eyebrow gr">Underrated Performance of the Week</span>
          </div>
          <h2 className="gc-col-head">The One <span className="gold">Everybody Missed.</span></h2>
          <GpaBlock
            id="up"
            sectionClass="grn"
            label="Underrated Performance"
            nameKey="gpa-up-name"
            nameDef="Updated Every Week"
            bodyKey="gpa-up-body"
            linkDefault="Link caption..."
            links={links}
            onSaveLink={saveLink}
            onClearLink={clearLink}
            isAdmin={isAdmin}
          />
        </section>
      )}

      <Footer />
      <Stripe />
    </>
  );
}
