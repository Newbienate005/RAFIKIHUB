/**
 * RafikiHub's own line icons, drawn in the house beadwork style: a 1.8px outline in the text colour with
 * beads (small discs, and the concentric "Maasai collar" rings used in the hero) picked out in orange.
 * Decorative: always next to a text label, so hidden from screen readers.
 */
const bead = "var(--accent)";

const paths = {
  // A map pin whose head is a beaded disc
  pin: (
    <>
      <path d="M12 21.5s-6.5-6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15.5 12 21.5 12 21.5Z" />
      <circle cx="12" cy="10.2" r="2.8" fill={bead} stroke="none" />
      <circle cx="12" cy="10.2" r="1.5" stroke="#121212" strokeWidth="0.9" />
    </>
  ),
  // A handset, the call ringing out as a row of beads
  phone: (
    <>
      <path d="M6.6 3.5h2.2l1.3 4-1.8 1.3a11 11 0 0 0 5 5l1.3-1.8 4 1.3v2.2a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z" />
      <circle cx="15.2" cy="4.6" r="1.1" fill={bead} stroke="none" />
      <circle cx="18" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="19.6" cy="9.2" r="1.1" fill={bead} stroke="none" />
    </>
  ),
  // An envelope closed with a beaded seal
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.6 6.6 8.4 6.4 8.4-6.4" />
      <circle cx="12" cy="13" r="2.9" fill={bead} stroke="none" />
      <circle cx="12" cy="13" r="1.1" fill="#121212" stroke="none" />
    </>
  ),
  // A calendar page, the days marked as a strand of beads
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <circle cx="8" cy="14" r="1.1" fill={bead} stroke="none" />
      <circle cx="12" cy="14" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1.1" fill={bead} stroke="none" />
      <circle cx="8" cy="17.4" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17.4" r="1.1" fill={bead} stroke="none" />
    </>
  ),
  // Two people, for representation and agents: heads as beads
  people: (
    <>
      <circle cx="9" cy="8" r="3" fill={bead} stroke="none" />
      <circle cx="16.5" cy="9" r="2.4" />
      <path d="M3.5 20c.6-3.6 2.8-5.6 5.5-5.6s4.9 2 5.5 5.6M14.6 14.6c2.6-.3 4.9 1.4 5.9 4.9" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, className = "icon" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths[name]}
    </svg>
  );
}
