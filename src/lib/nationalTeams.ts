/**
 * National-teams content model — the single source of truth for the content
 * keys behind each team on the /blackstars hub. Kept out of the page/component
 * files so importing it (from BlackStars.tsx and Admin.tsx) doesn't trip
 * react-refresh/only-export-components.
 *
 * Men (Black Stars) → the ORIGINAL legacy keys (bs:* / fixture:f1|f2 /
 * gc_bs_embeds / gc_bs_highlights) so all existing data stays live and unchanged.
 * Every other team → new namespaced keys with EMPTY defaults, so nothing shows
 * until an admin fills it in. Both the page and /admin import this so they can
 * never drift apart.
 */
import { type Clip, DEFAULT_BS_HIGHLIGHTS } from '../data/clips';

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

/** The national teams the hub can switch between. */
export type TeamId = 'men' | 'women' | 'u20' | 'u17';

export const TEAMS: { id: TeamId; label: string; scorebug: string }[] = [
  { id: 'men',   label: "Men's · Black Stars",   scorebug: 'Black Stars Watch' },
  { id: 'women', label: "Women's · Black Queens", scorebug: 'Black Queens Watch' },
  { id: 'u20',   label: 'U-20',                   scorebug: 'U-20 Watch' },
  { id: 'u17',   label: 'U-17',                   scorebug: 'U-17 Watch' },
];

/** Blank fixture default — for teams that start empty (title cleared = hidden). */
const BLANK_FIXTURE = { label: '', title: '', det: '', iso: '', stake: '' };

/** Editorial (top news block) resolved keys + their defaults. */
interface EditorialKeys {
  eyebrow: { key: string; def: string };
  title: { key: string; def: string };
  heading: { key: string; def: string };
  body: { key: string; def: string };
}

/** One fixture's resolved keys + its per-field defaults. */
interface FixtureKeys {
  label: { key: string; def: string };
  title: { key: string; def: string };
  det: { key: string; def: string };
  iso: { key: string; def: string };
  stake: { key: string; def: string };
}

export interface TeamKeys {
  editorial: EditorialKeys;
  fixtures: Record<'f1' | 'f2', FixtureKeys>;
  embedsList: string;
  highlightsList: string;
  highlightsDefault: Clip[];
}

export function teamKeys(team: TeamId): TeamKeys {
  if (team === 'men') {
    return {
      editorial: {
        eyebrow: { key: 'bs:eyebrow', def: BS_UPDATE_DEFAULTS['bs:eyebrow'] },
        title:   { key: 'bs:title',   def: BS_UPDATE_DEFAULTS['bs:title'] },
        heading: { key: 'bs:heading', def: BS_UPDATE_DEFAULTS['bs:heading'] },
        body:    { key: 'bs:body',    def: BS_UPDATE_DEFAULTS['bs:body'] },
      },
      fixtures: {
        f1: {
          label: { key: 'bs:f1-label', def: FIXTURE_DEFAULTS.f1.label },
          title: { key: 'bs:f1-title', def: FIXTURE_DEFAULTS.f1.title },
          det:   { key: 'bs:f1-det',   def: FIXTURE_DEFAULTS.f1.det },
          iso:   { key: 'fixture:f1',  def: FIXTURE_DEFAULTS.f1.iso },
          stake: { key: 'bs:f1-stake', def: FIXTURE_DEFAULTS.f1.stake },
        },
        f2: {
          label: { key: 'bs:f2-label', def: FIXTURE_DEFAULTS.f2.label },
          title: { key: 'bs:f2-title', def: FIXTURE_DEFAULTS.f2.title },
          det:   { key: 'bs:f2-det',   def: FIXTURE_DEFAULTS.f2.det },
          iso:   { key: 'fixture:f2',  def: FIXTURE_DEFAULTS.f2.iso },
          stake: { key: 'bs:f2-stake', def: FIXTURE_DEFAULTS.f2.stake },
        },
      },
      embedsList: 'gc_bs_embeds',
      highlightsList: 'gc_bs_highlights',
      highlightsDefault: DEFAULT_BS_HIGHLIGHTS,
    };
  }

  // Other teams — namespaced keys, empty defaults.
  const fixture = (fx: 'f1' | 'f2'): FixtureKeys => ({
    label: { key: `nt-${team}:${fx}-label`, def: BLANK_FIXTURE.label },
    title: { key: `nt-${team}:${fx}-title`, def: BLANK_FIXTURE.title },
    det:   { key: `nt-${team}:${fx}-det`,   def: BLANK_FIXTURE.det },
    iso:   { key: `fixture:nt-${team}-${fx}`, def: BLANK_FIXTURE.iso },
    stake: { key: `nt-${team}:${fx}-stake`, def: BLANK_FIXTURE.stake },
  });
  return {
    editorial: {
      eyebrow: { key: `nt:${team}:eyebrow`, def: '' },
      title:   { key: `nt:${team}:title`,   def: '' },
      heading: { key: `nt:${team}:heading`, def: '' },
      body:    { key: `nt:${team}:body`,    def: '' },
    },
    fixtures: { f1: fixture('f1'), f2: fixture('f2') },
    embedsList: `gc_nt_${team}_embeds`,
    highlightsList: `gc_nt_${team}_highlights`,
    highlightsDefault: [],
  };
}
