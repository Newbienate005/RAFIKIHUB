import Link from "next/link";
import { Caveat } from "next/font/google";
import { images } from "@/lib/images";
import { Photo } from "./Photo";

/**
 * The hero: headshots of real members as separate cards, tilted and staggered like prints on a table.
 * Each opens that member's profile, so it doubles as a preview of what casting directors see.
 */
// Handwriting for the note only, so the rest of the site keeps its one typeface
const hand = Caveat({ subsets: ["latin"], weight: "700", display: "swap" });

export function ContactSheet() {
  return (
    <figure className="sheet" aria-label="Headshots of RafikiHub members">
      <p className="sheet__note"><span className={hand.className}>Audition shortlist</span></p>
      <ul className="sheet__grid">
        {images.hero.map((p) => (
          <li key={p.name}>
            <Link href={`/profile/${p.profile}`} className="sheet__link">
              <div className="sheet__frame">
                <Photo src={p.src} alt="" label={p.name} sizes="(max-width: 900px) 33vw, 200px" /* no priority: the hero photo gets the bandwidth first */ />
                <span className="sheet__view" aria-hidden="true">View profile</span>
              </div>
              <p className="sheet__name">{p.name}</p>
              <p className="sheet__role">{p.role}</p>
            </Link>
          </li>
        ))}
      </ul>
    </figure>
  );
}
