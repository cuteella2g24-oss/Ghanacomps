/** SportyIcon — the GhanaComps custom football/sporty line-icon family.
 *
 *  One stroke language so the set reads as a single kit: fill:none,
 *  stroke:currentColor, stroke-width:1.75, round caps/joins, 24px viewBox.
 *  Color always rides `currentColor` off the chip (gold / red / green), never a
 *  hardcoded hue. Every glyph is decorative — the card title carries meaning —
 *  so the <svg> is aria-hidden and takes no label. Mirrors the inline-SVG habit
 *  already used by Nav / About's ExpandGlyph: a single component with a
 *  name→paths map keeps the family one source of truth.
 *
 *  Wrapper attrs (size, stroke, caps) live in CSS on `.gc-sportcard-chip svg`
 *  (see style.css §1.4) so the glyph inherits the chip's exact geometry. */

export type SportyIconName =
  | 'ball'
  | 'boot'
  | 'goal'
  | 'whistle'
  | 'stadium'
  | 'jersey'
  | 'trophy'
  | 'stopwatch'
  | 'flag'
  | 'tactics'
  | 'mail'
  | 'broadcast';

/** name → inner path geometry. Tuned for the 1.75 stroke at 24px; `stadium` and
 *  `whistle` were nudged to the pixel grid (see notes) so they read cleanly. */
const PATHS: Record<SportyIconName, React.ReactNode> = {
  // Football with pentagon seams — the ball-in-motion feel.
  ball: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.2l3.4 2.5-1.3 4h-4.2l-1.3-4L12 7.2z" />
      <path d="M12 7.2V4.2M15.4 9.7l2.7-1M14.1 13.7l1.8 2.4M9.9 13.7l-1.8 2.4M8.6 9.7l-2.7-1" />
    </>
  ),
  // Cleat striking, motion tick off the toe.
  boot: (
    <>
      <path d="M4 7h5l1.5 5.5L19 14a2 2 0 012 2v1H5a1 1 0 01-1-1V7z" />
      <path d="M4 17.5h17" />
      <path d="M9 7v4" />
    </>
  ),
  // Goal frame + net cross-hatch.
  goal: (
    <>
      <path d="M3 5h18v13H3z" />
      <path d="M3 9h18M3 13h18M7 5v13M12 5v13M17 5v13" />
    </>
  ),
  // Whistle with pea + lanyard curl. Nudged: pea sits on the 9/13 grid, mouth
  // aligns to whole units so the round caps land cleanly at 24px.
  whistle: (
    <>
      <path d="M13 9h7a1 1 0 011 1v2a5 5 0 01-5 5h-3a4 4 0 110-8z" />
      <circle cx="9" cy="13" r="1" />
      <path d="M13 9V6a2 2 0 012-2h2" />
    </>
  ),
  // Stadium bowl arc + floodlight uprights. Nudged: uprights land on whole-unit
  // x (6/12/18) and the lamp dots use .5-offset y so the bowl reads symmetric.
  stadium: (
    <>
      <path d="M3 14c0-2.2 4-4 9-4s9 1.8 9 4-4 4-9 4-9-1.8-9-4z" />
      <path d="M6 12.5V7M12 11V5M18 12.5V7" />
      <path d="M6 7h.01M12 5h.01M18 7h.01" />
    </>
  ),
  // Kit / jersey silhouette with collar + number line.
  jersey: (
    <>
      <path d="M8 4l4 2 4-2 4 3-2.5 3H18v8H6v-8H4.5L2 7l4-3z" />
      <path d="M10 4a2 2 0 004 0" />
      <path d="M12 12v4" />
    </>
  ),
  // Cup with handles on a plinth.
  trophy: (
    <>
      <path d="M7 4h10v4a5 5 0 01-10 0V4z" />
      <path d="M7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3" />
      <path d="M12 13v4M9 20h6M10 17h4" />
    </>
  ),
  // Stopwatch — crown button + sweep hand.
  stopwatch: (
    <>
      <circle cx="12" cy="14" r="7" />
      <path d="M12 14l3-2M12 7V4M10 4h4M18.5 8.5l1.5-1.5" />
    </>
  ),
  // Corner / pennant flag on a pole.
  flag: (
    <>
      <path d="M6 3v18" />
      <path d="M6 4h11l-2.5 3.5L17 11H6" />
    </>
  ),
  // Chalkboard with arrow play + node.
  tactics: (
    <>
      <path d="M4 4h16v13H4z" />
      <path d="M8 20h8M12 17v3" />
      <path d="M7 13c2-4 5-4 7 0" />
      <circle cx="7" cy="13" r="1" />
      <path d="M13 9l2 1-2 1" />
    </>
  ),
  // Envelope — the channel supporter (Contact).
  mail: (
    <>
      <path d="M3 6h18v12H3z" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  // Concentric signal arcs = social / broadcast — the second channel supporter.
  broadcast: (
    <>
      <circle cx="12" cy="16" r="1.6" />
      <path d="M9 13a4 4 0 016 0M6.5 10.5a8 8 0 0111 0" />
    </>
  ),
};

interface SportyIconProps {
  name: SportyIconName;
}

/** Renders one glyph from the family. Decorative by contract (aria-hidden);
 *  the chip's host card title supplies the accessible meaning. */
export default function SportyIcon({ name }: SportyIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
