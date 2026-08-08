/**
 * Shared squad data — the built-in "Ghanaians playing abroad" roster and the
 * league lookup tables. Lives here (not inside Players.tsx) so the admin
 * dashboard can edit each player's club/position against the same source.
 */

export interface StaticPlayer {
  eid: string;
  lg: string;
  league: string;
  name: string;
  /** Club + position, may contain the `<s>·</s>` separator markup. */
  meta: string;
}

export const leagueLabels: Record<string, string> = {
  pl: 'Premier League', l1: 'Ligue 1', ll: 'La Liga', sa: 'Serie A',
  bl: 'Bundesliga', ch: 'Championship', ot: 'Other Leagues',
};

// Single source of truth for the six named-league crests. Reused by the filter
// chips and the per-row ledger tags. 'ot' has no crest and is intentionally absent.
export const leagueBadges: Record<string, string> = {
  pl: '/assets/leagues/pl.svg',
  l1: '/assets/leagues/l1.svg',
  ll: '/assets/leagues/ll.svg',
  sa: '/assets/leagues/sa.svg',
  bl: '/assets/leagues/bl.svg',
  ch: '/assets/leagues/ch.svg',
};

// Filter bar: [code, label]. Named leagues show an official crest; All/Other are text.
export const leagueFilters: [string, string][] = [
  ['all', 'All'],
  ['pl', 'Premier League'],
  ['l1', 'Ligue 1'],
  ['ll', 'La Liga'],
  ['sa', 'Serie A'],
  ['bl', 'Bundesliga'],
  ['ch', 'Championship'],
  ['ot', 'Other'],
];

export const staticPlayers: StaticPlayer[] = [
  { eid: 'p1', lg: 'pl', league: 'Premier League', name: 'Mohammed Kudus', meta: 'Tottenham<s>·</s>MF' },
  { eid: 'p2', lg: 'pl', league: 'Premier League', name: 'Antoine Semenyo', meta: 'Manchester City<s>·</s>FW' },
  { eid: 'p3', lg: 'l1', league: 'Ligue 1', name: 'Ernest Nuamah', meta: 'Olympique Lyon<s>·</s>FW' },
  { eid: 'p4', lg: 'l1', league: 'Ligue 1', name: 'Alidu Seidu', meta: 'Stade Rennes<s>·</s>DF' },
  { eid: 'p5', lg: 'l1', league: 'Ligue 1', name: 'Salis Abdul Samed', meta: 'OGC Nice<s>·</s>MF' },
  { eid: 'p6', lg: 'l1', league: 'Ligue 1', name: 'Kojo Peprah Oppong', meta: 'OGC Nice<s>·</s>DF' },
  { eid: 'p7', lg: 'l1', league: 'Ligue 1', name: 'Gideon Mensah', meta: 'AJ Auxerre<s>·</s>DF' },
  { eid: 'p8', lg: 'l1', league: 'Ligue 1', name: 'Elisha Owusu', meta: 'AJ Auxerre<s>·</s>MF' },
  { eid: 'p9', lg: 'l1', league: 'Ligue 1', name: 'Marvin Senaya', meta: 'AJ Auxerre<s>·</s>DF' },
  { eid: 'p10', lg: 'l1', league: 'Ligue 1', name: 'Abu Francis', meta: 'Toulouse<s>·</s>MF' },
  { eid: 'p11', lg: 'l1', league: 'Ligue 1', name: 'Mohammed Salisu', meta: 'AS Monaco<s>·</s>DF' },
  { eid: 'p12', lg: 'll', league: 'La Liga', name: 'Thomas Partey', meta: 'Villarreal CF<s>·</s>MF' },
  { eid: 'p13', lg: 'll', league: 'La Liga', name: 'Inaki Williams', meta: 'Athletic Bilbao<s>·</s>FW' },
  { eid: 'p14', lg: 'll', league: 'La Liga', name: 'Abdul Mumin', meta: 'Rayo Vallecano<s>·</s>DF' },
  { eid: 'p15', lg: 'll', league: 'La Liga', name: 'Kwasi Sibo', meta: 'Real Oviedo<s>·</s>MF' },
  { eid: 'p16', lg: 'sa', league: 'Serie A', name: 'Kamaldeen Sulemana', meta: 'Atalanta<s>·</s>FW' },
  { eid: 'p17', lg: 'sa', league: 'Serie A', name: 'Ibrahim Sulemana', meta: 'Cagliari<s>·</s>MF' },
  { eid: 'p18', lg: 'sa', league: 'Serie A', name: 'Caleb Ekuban', meta: 'Genoa<s>·</s>FW' },
  { eid: 'p19', lg: 'sa', league: 'Serie A', name: 'Alfred Duncan', meta: 'Venezia<s>·</s>MF' },
  { eid: 'p20', lg: 'bl', league: 'Bundesliga', name: 'Jonas Adjetey', meta: 'VfL Wolfsburg<s>·</s>DF' },
  { eid: 'p21', lg: 'bl', league: 'Bundesliga', name: 'Ransford Yeboah', meta: 'Hamburger SV<s>·</s>FW' },
  { eid: 'p22', lg: 'bl', league: 'Bundesliga', name: 'Derrick Kohn', meta: 'Union Berlin<s>·</s>DF' },
  { eid: 'p23', lg: 'ch', league: 'Championship', name: 'Jordan Ayew', meta: 'Leicester City<s>·</s>FW' },
  { eid: 'p24', lg: 'ch', league: 'Championship', name: 'Abdul Fatawu Issahaku', meta: 'Leicester City<s>·</s>FW' },
  { eid: 'p25', lg: 'ch', league: 'Championship', name: 'Ibrahim Osman', meta: 'Birmingham City<s>·</s>FW' },
  { eid: 'p26', lg: 'ch', league: 'Championship', name: 'Brandon Thomas Asante', meta: 'Coventry City<s>·</s>FW' },
  { eid: 'p27', lg: 'ch', league: 'Championship', name: 'Forson Amankwah', meta: 'Norwich City<s>·</s>MF' },
  { eid: 'p28', lg: 'ot', league: 'Other Leagues', name: 'Alexander Djiku', meta: 'Fenerbahce<s>·</s>DF' },
  { eid: 'p29', lg: 'ot', league: 'Other Leagues', name: 'Jerome Opoku', meta: 'Basaksehir<s>·</s>DF' },
  { eid: 'p30', lg: 'ot', league: 'Other Leagues', name: 'Caleb Yirenkyi', meta: 'Nordsjaelland<s>·</s>MF' },
  { eid: 'p31', lg: 'ot', league: 'Other Leagues', name: 'Christopher Bonsu Baah', meta: 'Al Qadsiah<s>·</s>FW' },
  { eid: 'p32', lg: 'ot', league: 'Other Leagues', name: 'Joseph Paintsil', meta: 'LA Galaxy<s>·</s>FW' },
  { eid: 'p33', lg: 'ot', league: 'Other Leagues', name: 'Lawrence Ati-Zigi', meta: 'FC St. Gallen<s>·</s>GK' },
  { eid: 'p34', lg: 'ot', league: 'Other Leagues', name: 'Majeed Ashimeru', meta: 'RAAL La Louviere<s>·</s>MF' },
  { eid: 'p35', lg: 'ot', league: 'Other Leagues', name: 'Abdul Rahman Baba', meta: 'PAOK<s>·</s>DF' },
  { eid: 'p36', lg: 'ot', league: 'Other Leagues', name: 'Andrew Ayew', meta: 'NAC Breda<s>·</s>FW' },
  { eid: 'p37', lg: 'ot', league: 'Other Leagues', name: 'Kamal Sowah', meta: 'NAC Breda<s>·</s>MF' },
  { eid: 'p38', lg: 'ot', league: 'Other Leagues', name: 'Patric Pfeiffer', meta: 'Darmstadt<s>·</s>DF' },
  { eid: 'p39', lg: 'ot', league: 'Other Leagues', name: 'Ibrahim Sadiq', meta: 'AZ Alkmaar<s>·</s>FW' },
  { eid: 'p40', lg: 'ot', league: 'Other Leagues', name: 'Jerry Afriyie', meta: 'RAAL La Louviere<s>·</s>FW' },
  { eid: 'p41', lg: 'ot', league: 'Other Leagues', name: 'Mohammed Fuseini', meta: 'Royale Union SG<s>·</s>FW' },
  { eid: 'p42', lg: 'ot', league: 'Other Leagues', name: 'Prince Amoako Jnr', meta: 'Nordsjaelland<s>·</s>FW' },
  { eid: 'p43', lg: 'ot', league: 'Other Leagues', name: 'Prince Kwabena Adu', meta: 'Viktoria Plzen<s>·</s>FW' },
  { eid: 'p44', lg: 'ot', league: 'Other Leagues', name: 'Felix Afena Gyan', meta: 'Amed Sportif<s>·</s>FW' },
  { eid: 'p45', lg: 'ot', league: 'Other Leagues', name: 'Joseph Anang', meta: 'St. Patricks Athletic<s>·</s>GK' },
  { eid: 'p46', lg: 'ot', league: 'Other Leagues', name: 'Derrick Luckassen', meta: 'Pafos FC<s>·</s>DF' },
  { eid: 'p47', lg: 'ot', league: 'Other Leagues', name: 'Daniel Agyei', meta: 'Kocaelispor<s>·</s>FW' },
  { eid: 'p48', lg: 'ot', league: 'Other Leagues', name: 'Augustine Boakye', meta: 'Saint Etienne<s>·</s>FW' },
  { eid: 'p49', lg: 'ot', league: 'Other Leagues', name: 'Lawrence Agyekum', meta: 'Cercle Brugge<s>·</s>MF' },
];
