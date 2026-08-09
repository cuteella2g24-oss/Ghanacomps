import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { verifyToken, type SaveResult } from '../lib/content';
import { staticPlayers, leagueLabels } from '../data/players';
import { DEFAULT_HOME_HIGHLIGHTS, DEFAULT_BS_HIGHLIGHTS, type Clip } from '../data/clips';
import { BS_UPDATE_DEFAULTS, FIXTURE_DEFAULTS } from './BlackStars';

/**
 * /admin — the single place to edit the site's *information* (news, transfers,
 * player teams, comp/archive links, X-post embeds, fixtures + countdowns,
 * highlights). Login is the ADMIN_SECRET; one Save button publishes everything
 * to KV for all visitors. Page copy/design is intentionally NOT edited here.
 */

// Built-in legend/cult comp links that can be repointed at a player's archive.
// Blank = keep the page's built-in default link.
const LEGEND_LINKS: { key: string; label: string }[] = [
  { key: 'l2-c1', label: 'Michael Essien — vs Italy 2006' },
  { key: 'l1-c1', label: 'Abedi Pelé — vs Nigeria 1992' },
  { key: 'l3-c1', label: 'Asamoah Gyan — vs Germany 2014' },
  { key: 'l3-c2', label: 'Asamoah Gyan — vs Czech Republic 2006' },
  { key: 'l3-c3', label: 'Asamoah Gyan — vs Egypt 2014 Q' },
  { key: 'l4-c1', label: 'Stephen Appiah — vs Italy 2006' },
  { key: 'l5-c1', label: 'Kwadwo Asamoah — vs Uruguay 2010' },
  { key: 'l5-c2', label: 'Kwadwo Asamoah — vs USA 2010' },
  { key: 'l6-c1', label: 'Anthony Annan — vs Uruguay 2010' },
  { key: 'l7-c1', label: 'Richard Kingson — vs Italy 2006' },
  { key: 'l8-c1', label: 'Fatau Dauda — vs Portugal 2014' },
  { key: 'l9-c1', label: 'Kevin Prince Boateng — vs Uruguay 2010' },
  { key: 'l9-c2', label: 'Kevin Prince Boateng — vs Australia 2010' },
  { key: 'ch1-c1', label: 'Quincy Owusu Abeyie — vs Australia 2010' },
];

/* ---------- small building blocks ---------- */

function Section({ id, title, note, children }: { id: string; title: string; note?: string; children: ReactNode }) {
  return (
    <section className="adm-section" id={id}>
      <h2 className="adm-section-h">{title}</h2>
      {note && <p className="adm-note">{note}</p>}
      {children}
    </section>
  );
}

/** Scalar field bound to a fields[] key. Local state → commit on blur (snappy). */
function FieldText({ label, fieldKey, def = '', area = false, ph = '' }: { label: string; fieldKey: string; def?: string; area?: boolean; ph?: string }) {
  const { getField, setField } = useContent();
  const [val, setVal] = useState(() => getField(fieldKey, def));
  const commit = () => setField(fieldKey, val);
  return (
    <label className="adm-field">
      <span className="adm-label">{label}</span>
      {area ? (
        <textarea className="adm-input" rows={5} value={val} placeholder={ph} onChange={e => setVal(e.target.value)} onBlur={commit} />
      ) : (
        <input className="adm-input" value={val} placeholder={ph} onChange={e => setVal(e.target.value)} onBlur={commit} />
      )}
    </label>
  );
}

interface Column { key: string; ph: string; type?: 'text' | 'textarea' | 'select' | 'url'; options?: string[] }

/** Generic add/edit/remove editor over an array of flat objects in lists[]. */
function ListEditor({ listKey, columns, blank }: { listKey: string; columns: Column[]; blank: () => Record<string, unknown> }) {
  const { getList, setList } = useContent();
  const items = getList<Record<string, unknown>[]>(listKey, []);
  const update = (i: number, key: string, val: string) => setList(listKey, items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const remove = (i: number) => setList(listKey, items.filter((_, idx) => idx !== i));
  const add = () => setList(listKey, [...items, blank()]);
  return (
    <div className="adm-list">
      {items.length === 0 && <p className="adm-empty">None yet.</p>}
      {items.map((it, i) => (
        <div key={i} className="adm-row">
          {columns.map(col => {
            const v = (it[col.key] as string) ?? '';
            if (col.type === 'select') {
              return (
                <select key={col.key} className="adm-input adm-sel" value={v} onChange={e => update(i, col.key, e.target.value)}>
                  {col.options!.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              );
            }
            if (col.type === 'textarea') {
              return <textarea key={col.key} className="adm-input" rows={2} placeholder={col.ph} value={v} onChange={e => update(i, col.key, e.target.value)} />;
            }
            return <input key={col.key} className="adm-input" placeholder={col.ph} value={v} onChange={e => update(i, col.key, e.target.value)} />;
          })}
          <button type="button" className="adm-del" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="adm-add" onClick={add}>+ Add</button>
    </div>
  );
}

/* ---------- dashboard ---------- */

type TabId = 'home' | 'players' | 'legends' | 'blackstars' | 'gpa';
const TABS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'players', label: 'Players' },
  { id: 'legends', label: 'Legends & Cult' },
  { id: 'blackstars', label: 'Black Stars' },
  { id: 'gpa', label: 'GPA' },
];

function Dashboard({ token }: { token: string }) {
  const { save } = useContent();
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabId>('home');

  async function doSave() {
    setSaving(true);
    setStatus('Saving…');
    const r: SaveResult = await save(token);
    setStatus(
      r === 'saved' ? 'Saved — live for everyone ✓'
      : r === 'local' ? 'Saved locally (dev only)'
      : r === 'unauthorized' ? 'Wrong password — not saved. Reload and log in again.'
      : 'Save failed — check your connection and try again.',
    );
    setSaving(false);
    window.setTimeout(() => setStatus(''), 5000);
  }

  return (
    <div className="adm-wrap">
      <div className="adm-bar">
        <div className="adm-bar-title">GhanaComps <span className="gold">Admin</span></div>
        <div className="adm-bar-actions">
          {status && <span className="adm-status">{status}</span>}
          <Link className="adm-btn" to="/">View site ↗</Link>
          <button type="button" className="adm-btn adm-btn-primary" onClick={doSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <p className="adm-intro">Pick a section, edit its info, then press <strong>Save Changes</strong> once — it publishes to every visitor across all sections. Page wording and design are not edited here.</p>

      <div className="adm-tabs" role="tablist">
        {TABS.map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`adm-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'home' && (
        <>
          <Section id="home-news" title="Latest News" note="The headline feed on the homepage. Tag is shown as a coloured chip.">
            <ListEditor
              listKey="gc_news"
              columns={[
                { key: 'tag', type: 'select', ph: '', options: ['general', 'injury', 'transfer'] },
                { key: 'title', ph: 'Headline…' },
                { key: 'url', type: 'url', ph: 'Link URL (optional)…' },
              ]}
              blank={() => ({ tag: 'general', title: '', url: '' })}
            />
          </Section>

          <Section id="home-highlights" title="Highlights" note="Self-hosted clip tiles. Slug points at /assets/video/{slug}.mp4 + .poster.jpg. Set source to 'embed' + an X URL to play a post in the lightbox.">
            <ClipEditor listKey="gc_highlights" def={DEFAULT_HOME_HIGHLIGHTS} slugPrefix="highlights" />
          </Section>
        </>
      )}

      {tab === 'players' && (
        <>
          <Section id="player-news" title="Transfers & Updates" note="Shown on the Current Players page.">
            <ListEditor
              listKey="gc_player_news"
              columns={[
                { key: 'tag', type: 'select', ph: '', options: ['transfer', 'injury', 'callup', 'general'] },
                { key: 'title', ph: 'Headline e.g. Kudus joins new club' },
                { key: 'detail', type: 'textarea', ph: 'Detail (optional)…' },
              ]}
              blank={() => ({ tag: 'transfer', title: '', detail: '' })}
            />
          </Section>

          <Section id="teams" title="Teams & Positions" note="Change a player's club or position. Format: Club · Position. Leave a player untouched to keep the default.">
            <div className="adm-teams">
              {staticPlayers.map(p => (
                <FieldText key={p.eid} label={p.name} fieldKey={`team:${p.eid}`} def={p.meta} ph="Club · Position" />
              ))}
            </div>
            <p className="adm-note">Tip: the small dot between club and position is written as <code>&lt;s&gt;·&lt;/s&gt;</code>. You can also just type <code>Club · Position</code>.</p>
          </Section>

          <Section id="extra-players" title="Add Extra Players" note="Players not in the built-in list. League codes: pl, l1, ll, sa, bl, ch, ot.">
            <ExtraPlayersEditor />
          </Section>

          <Section id="performers" title="Weekend Performers" note="Cards that link out to a comp on X / TikTok.">
            <ListEditor
              listKey="gc_performers"
              columns={[
                { key: 'caption', ph: 'Caption e.g. Kudus vs Man City — MW38' },
                { key: 'url', type: 'url', ph: 'X or TikTok post URL…' },
              ]}
              blank={() => ({ caption: '', url: '' })}
            />
          </Section>
        </>
      )}

      {tab === 'legends' && (
        <>
          <Section id="legend-links" title="Comp / Archive Links" note="Repoint any 'Watch on X' link, e.g. to a player's whole archive. Leave blank to keep the built-in link.">
            <div className="adm-links">
              {LEGEND_LINKS.map(l => (
                <FieldText key={l.key} label={l.label} fieldKey={`link:${l.key}`} ph="Archive / post URL (blank = default)" />
              ))}
            </div>
          </Section>

          <Section id="essien" title="Essien Embedded Post" note="Paste an X post URL to embed the clip on the Essien card. Leave blank to show nothing.">
            <FieldText label="Essien X post URL" fieldKey="embed:essien" ph="https://x.com/Ghanacomps/status/…" />
          </Section>

          <Section id="extra-legends" title="Add Extra Legends" note="Adds a card to the Legends ledger.">
            <ExtraLegendsEditor listKey="gc_extra_legends" />
          </Section>

          <Section id="extra-cult" title="Add Cult Heroes">
            <ExtraLegendsEditor listKey="gc_extra_cult" />
          </Section>
        </>
      )}

      {tab === 'blackstars' && (
        <>
          <Section id="bs-update" title="Latest Update" note="The editorial news block at the top of the Black Stars page.">
            <FieldText label="Eyebrow" fieldKey="bs:eyebrow" def={BS_UPDATE_DEFAULTS['bs:eyebrow']} />
            <FieldText label="Title (gold headline)" fieldKey="bs:title" def={BS_UPDATE_DEFAULTS['bs:title']} />
            <FieldText label="Sub-heading" fieldKey="bs:heading" def={BS_UPDATE_DEFAULTS['bs:heading']} />
            <FieldText label="Body (blank line = new paragraph)" fieldKey="bs:body" def={BS_UPDATE_DEFAULTS['bs:body']} area />
          </Section>

          <Section id="bs-embeds" title="Goals & Moments (embedded X posts)" note="Paste X post URLs of goals; they embed and play on the site.">
            <ListEditor
              listKey="gc_bs_embeds"
              columns={[
                { key: 'url', type: 'url', ph: 'X post URL…' },
                { key: 'caption', ph: 'Caption (optional)…' },
              ]}
              blank={() => ({ url: '', caption: '' })}
            />
          </Section>

          <Section id="fixtures" title="Fixtures & Countdowns" note="Kickoff must be ISO format, e.g. 2026-05-22T17:00:00Z. Blank kickoff hides that fixture's countdown. Clear the matchup to hide the whole card.">
            {(['f1', 'f2'] as const).map(fx => (
              <div key={fx} className="adm-fixture">
                <div className="adm-sub">{fx === 'f1' ? 'Fixture 1' : 'Fixture 2'}</div>
                <FieldText label="Label" fieldKey={`bs:${fx}-label`} def={FIXTURE_DEFAULTS[fx].label} />
                <FieldText label="Matchup" fieldKey={`bs:${fx}-title`} def={FIXTURE_DEFAULTS[fx].title} />
                <FieldText label="Detail (date · venue · time)" fieldKey={`bs:${fx}-det`} def={FIXTURE_DEFAULTS[fx].det} />
                <FieldText label="Kickoff (ISO, for countdown)" fieldKey={`fixture:${fx}`} def={FIXTURE_DEFAULTS[fx].iso} ph="2026-05-22T17:00:00Z" />
                <FieldText label="What's at stake" fieldKey={`bs:${fx}-stake`} def={FIXTURE_DEFAULTS[fx].stake} area />
              </div>
            ))}
          </Section>

          <Section id="bs-highlights" title="Matchday Highlights">
            <ClipEditor listKey="gc_bs_highlights" def={DEFAULT_BS_HIGHLIGHTS} slugPrefix="highlights" />
          </Section>
        </>
      )}

      {tab === 'gpa' && (
        <Section id="gpa" title="GPA — Weekly Links" note="The link buttons on the GPA Weekly page.">
          <GpaLinksEditor />
        </Section>
      )}

      <div className="adm-footer">
        <button type="button" className="adm-btn adm-btn-primary" onClick={doSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        {status && <span className="adm-status">{status}</span>}
      </div>
    </div>
  );
}

/* ---------- specialised editors ---------- */

function ExtraPlayersEditor() {
  const { getList, setList } = useContent();
  const items = getList<{ id: string; name: string; club: string; league: string; label: string }[]>('gc_extra_players', []);
  const update = (i: number, key: string, val: string) => setList('gc_extra_players', items.map((it, idx) => {
    if (idx !== i) return it;
    const next = { ...it, [key]: val };
    if (key === 'league') next.label = leagueLabels[val] || 'Other Leagues';
    return next;
  }));
  const remove = (i: number) => setList('gc_extra_players', items.filter((_, idx) => idx !== i));
  const add = () => {
    // Unique id derived from existing ones (no impure Date.now during render).
    const maxN = items.reduce((m, it) => Math.max(m, parseInt(String(it.id).replace(/\D/g, ''), 10) || 0), 0);
    setList('gc_extra_players', [...items, { id: `extra${maxN + 1}`, name: '', club: '', league: 'ot', label: 'Other Leagues' }]);
  };
  return (
    <div className="adm-list">
      {items.length === 0 && <p className="adm-empty">None yet.</p>}
      {items.map((it, i) => (
        <div key={it.id} className="adm-row">
          <input className="adm-input" placeholder="Name" value={it.name} onChange={e => update(i, 'name', e.target.value)} />
          <input className="adm-input" placeholder="Club · Position" value={it.club} onChange={e => update(i, 'club', e.target.value)} />
          <select className="adm-input adm-sel" value={it.league} onChange={e => update(i, 'league', e.target.value)}>
            {['pl', 'l1', 'll', 'sa', 'bl', 'ch', 'ot'].map(c => <option key={c} value={c}>{leagueLabels[c]}</option>)}
          </select>
          <button type="button" className="adm-del" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="adm-add" onClick={add}>+ Add Player</button>
    </div>
  );
}

interface ExtraLegend { name: string; era: string; pos: string; pos_display: string; bio: string; comps: { title: string; url: string; stats: string }[]; quote: string }

function ExtraLegendsEditor({ listKey }: { listKey: string }) {
  const { getList, setList } = useContent();
  const items = getList<ExtraLegend[]>(listKey, []);
  const set = (i: number, patch: Partial<ExtraLegend>) => setList(listKey, items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const setComp = (i: number, patch: Partial<{ title: string; url: string; stats: string }>) =>
    setList(listKey, items.map((it, idx) => (idx === i ? { ...it, comps: [{ ...(it.comps?.[0] ?? { title: '', url: '', stats: '' }), ...patch }] } : it)));
  const remove = (i: number) => setList(listKey, items.filter((_, idx) => idx !== i));
  const add = () => setList(listKey, [...items, { name: '', era: 'Legend', pos: 'midfielder', pos_display: '', bio: '', comps: [{ title: '', url: '', stats: '' }], quote: '' }]);
  return (
    <div className="adm-list">
      {items.length === 0 && <p className="adm-empty">None yet.</p>}
      {items.map((it, i) => {
        const c = it.comps?.[0] ?? { title: '', url: '', stats: '' };
        return (
          <div key={i} className="adm-card">
            <div className="adm-card-grid">
              <input className="adm-input" placeholder="Name" value={it.name} onChange={e => set(i, { name: e.target.value })} />
              <input className="adm-input" placeholder="Era e.g. 2000s to 2010s" value={it.era} onChange={e => set(i, { era: e.target.value })} />
              <input className="adm-input" placeholder="Position · Club" value={it.pos_display} onChange={e => set(i, { pos_display: e.target.value })} />
              <select className="adm-input adm-sel" value={it.pos} onChange={e => set(i, { pos: e.target.value })}>
                {['midfielder', 'striker', 'goalkeeper'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <textarea className="adm-input" rows={2} placeholder="Bio" value={it.bio} onChange={e => set(i, { bio: e.target.value })} />
            <div className="adm-card-grid">
              <input className="adm-input" placeholder="Comp title e.g. vs Italy — 2006" value={c.title} onChange={e => setComp(i, { title: e.target.value })} />
              <input className="adm-input" placeholder="Comp URL" value={c.url} onChange={e => setComp(i, { url: e.target.value })} />
              <input className="adm-input" placeholder="Stats (optional)" value={c.stats} onChange={e => setComp(i, { stats: e.target.value })} />
            </div>
            <input className="adm-input" placeholder="Quote" value={it.quote} onChange={e => set(i, { quote: e.target.value })} />
            <button type="button" className="adm-del adm-del-wide" onClick={() => remove(i)}>Remove this card</button>
          </div>
        );
      })}
      <button type="button" className="adm-add" onClick={add}>+ Add</button>
    </div>
  );
}

function ClipEditor({ listKey, def, slugPrefix }: { listKey: string; def: Clip[]; slugPrefix: string }) {
  const { getList, setList } = useContent();
  const items = getList<Clip[]>(listKey, def);
  const update = (i: number, key: keyof Clip, val: string) => setList(listKey, items.map((it, idx) => (idx === i ? { ...it, [key]: val } : it)));
  const remove = (i: number) => setList(listKey, items.filter((_, idx) => idx !== i));
  const add = () => setList(listKey, [...items, { slug: `${slugPrefix}/new-clip`, title: '', ratio: '16x9', source: 'self' } as Clip]);
  return (
    <div className="adm-list">
      {items.length === 0 && <p className="adm-empty">None yet.</p>}
      {items.map((it, i) => (
        <div key={i} className="adm-card">
          <div className="adm-card-grid">
            <input className="adm-input" placeholder="Title" value={it.title} onChange={e => update(i, 'title', e.target.value)} />
            <input className="adm-input" placeholder="Tag e.g. Premier League" value={it.tag ?? ''} onChange={e => update(i, 'tag', e.target.value)} />
            <input className="adm-input" placeholder="Slug e.g. highlights/kudus-goal" value={it.slug} onChange={e => update(i, 'slug', e.target.value)} />
            <input className="adm-input" placeholder="Duration e.g. 1:24" value={it.duration ?? ''} onChange={e => update(i, 'duration', e.target.value)} />
            <select className="adm-input adm-sel" value={it.ratio} onChange={e => update(i, 'ratio', e.target.value)}>
              {['16x9', '9x16', '4x5'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <select className="adm-input adm-sel" value={it.source ?? 'self'} onChange={e => update(i, 'source', e.target.value)}>
              <option value="self">Self-hosted</option>
              <option value="embed">Embed X post</option>
            </select>
            <input className="adm-input" placeholder="Original / X URL (attribution or embed)" value={it.originalUrl ?? ''} onChange={e => update(i, 'originalUrl', e.target.value)} />
          </div>
          <button type="button" className="adm-del adm-del-wide" onClick={() => remove(i)}>Remove clip</button>
        </div>
      ))}
      <button type="button" className="adm-add" onClick={add}>+ Add Clip</button>
    </div>
  );
}

function GpaLinksEditor() {
  // gc_gpa_links is an object keyed by block id, each { caption, url }.
  const { getList, setList } = useContent();
  const links = getList<Record<string, { caption: string; url: string }>>('gc_gpa_links', {});
  const blocks: { id: string; label: string }[] = [
    { id: 'mwr', label: 'Matchweek Review' },
    { id: 'potw', label: 'Player of the Week' },
    { id: 'goal', label: 'Goal of the Week' },
    { id: 'assist', label: 'Assist of the Week' },
    { id: 'up', label: 'Upcoming' },
  ];
  const set = (id: string, key: 'caption' | 'url', val: string) =>
    setList('gc_gpa_links', { ...links, [id]: { caption: links[id]?.caption ?? '', url: links[id]?.url ?? '', [key]: val } });
  return (
    <div className="adm-list">
      {blocks.map(b => (
        <div key={b.id} className="adm-row">
          <span className="adm-rowlabel">{b.label}</span>
          <input className="adm-input" placeholder="Button caption" value={links[b.id]?.caption ?? ''} onChange={e => set(b.id, 'caption', e.target.value)} />
          <input className="adm-input" placeholder="URL" value={links[b.id]?.url ?? ''} onChange={e => set(b.id, 'url', e.target.value)} />
        </div>
      ))}
    </div>
  );
}

/* ---------- auth gate ---------- */

export default function Admin() {
  const { loaded } = useContent();
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [checking, setChecking] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setErr('');
    const r = await verifyToken(pw);
    setChecking(false);
    if (r === 'ok' || r === 'no-api') {
      // 'no-api' only happens with no Worker (local dev) — let the dev in.
      setToken(pw);
      setAuthed(true);
    } else if (r === 'error') {
      setErr('Login service is temporarily unavailable. Please try again.');
    } else {
      setErr('Wrong password.');
    }
  }

  if (authed) {
    // Wait for the current content to load before showing the forms — otherwise
    // the inputs would seed from defaults and a Save could overwrite live data.
    if (!loaded) {
      return (
        <div className="adm-login">
          <div className="adm-login-card"><div className="adm-login-title">Loading content…</div></div>
        </div>
      );
    }
    return <Dashboard token={token} />;
  }

  return (
    <div className="adm-login">
      <form className="adm-login-card" onSubmit={submit}>
        <div className="adm-login-title">GhanaComps <span className="gold">Admin</span></div>
        <p className="adm-login-sub">Enter the admin password to edit the site.</p>
        <input
          className="adm-input"
          type="password"
          placeholder="Admin password"
          value={pw}
          autoFocus
          onChange={e => setPw(e.target.value)}
        />
        {err && <div className="adm-login-err">{err}</div>}
        <button type="submit" className="adm-btn adm-btn-primary adm-login-btn" disabled={checking}>
          {checking ? 'Checking…' : 'Log in'}
        </button>
        <Link className="adm-login-back" to="/">← Back to site</Link>
      </form>
    </div>
  );
}
