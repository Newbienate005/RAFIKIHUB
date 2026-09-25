import { images } from "@/lib/images";
import { Photo } from "./Photo";

/** The hero: a casting director's contact sheet of headshots, one circled for the shortlist. */
export function ContactSheet() {
  const shortlisted = 3;
  return (
    <figure className="sheet" aria-label="Headshots of RafikiHub members">
      <ul className="sheet__grid">
        {images.hero.map((p, i) => (
          <li key={p.name} className={i === shortlisted ? "is-picked" : undefined}>
            <div className="sheet__frame">
              <Photo src={p.src} alt={`${p.name}, ${p.role}`} label={p.name} sizes="(max-width: 900px) 33vw, 200px" priority={i < 3} />
            </div>
            <p className="sheet__name">{p.name}</p>
            <p className="sheet__role">{p.role}</p>
            {i === shortlisted ? (
              <svg className="sheet__circle" viewBox="0 0 200 240" aria-hidden="true" preserveAspectRatio="none">
                <path d="M104 14 C 40 10, 8 60, 10 124 C 12 196, 60 232, 112 228 C 170 224, 196 178, 192 112 C 188 48, 150 12, 92 18" />
              </svg>
            ) : null}
          </li>
        ))}
      </ul>
      <figcaption>Shortlisted for audition</figcaption>
    </figure>
  );
}
