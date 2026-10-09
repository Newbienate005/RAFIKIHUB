import Link from "next/link";
import { ClipPlayer } from "@/components/profile/ClipPlayer";
import { Photo } from "@/components/Photo";
import { isPet, type TalentProfile } from "@/lib/data";
import { mediaOrigin, originLabel, reelsOf, voiceClipsOf } from "@/lib/media";

const Origin = ({ url }: { url: string }) => <span className={`origin origin--${mediaOrigin(url)}`}>{originLabel[mediaOrigin(url)]}</span>;

/** The dashboard's "My media" tab: a member's photos, showreels and voice clips, from the old site or uploaded here. */
export function MyMedia({ profile: p, published }: { profile: TalentProfile | null; published: boolean }) {
  if (!p) {
    return (
      <section aria-labelledby="media">
        <h2 id="media">My media</h2>
        <p className="small">You don&apos;t have a profile yet. Create one, then add your photos, showreels and voice clips.</p>
        <Link href="/dashboard/profile" className="btn btn--sun btn--sm">Create my profile</Link>
      </section>
    );
  }
  const pet = isPet(p);
  const photos = p.media.headshots;
  const reels = reelsOf(p);
  const voices = pet ? [] : voiceClipsOf(p);
  const fromOldSite = [...photos, ...reels.map((r) => r.url), ...voices.map((v) => v.url)].some((u) => mediaOrigin(u) === "old-site");
  const edit = <Link href="/dashboard/profile#s-media" className="btn btn--sun btn--sm">{photos.length || reels.length || voices.length ? "Add or change media" : "Add media"}</Link>;

  return (
    <section aria-labelledby="media" className="my-media">
      <div className="section-head">
        <h2 id="media">My media</h2>
        {edit}
      </div>
      <p className="small">
        {fromOldSite ? "Everything from your old RafikiHub profile is here, along with anything you've uploaded since. " : null}
        {published ? "This is what casting directors see on your profile." : "Your profile isn't public yet, so only you and the RafikiHub team can see these."}
      </p>

      <section aria-labelledby="m-photos" className="my-media__group">
        <h3 id="m-photos">{pet ? "Photos" : "Headshots and photos"} <span className="my-media__count">{photos.length}</span></h3>
        {photos.length ? (
          <ul className="gallery my-media__photos">
            {photos.map((h, i) => (
              <li key={h + i}>
                <a href={h} target="_blank" rel="noopener" aria-label={`Open photo ${i + 1} full size (new tab)`}>
                  <Photo src={h} alt={`${p.fullName}, photo ${i + 1}`} label={p.fullName} sizes="(max-width: 600px) 45vw, 200px" />
                </a>
                <span className="my-media__tags">{i === 0 ? <span className="img-list__main">Main</span> : null}<Origin url={h} /></span>
              </li>
            ))}
          </ul>
        ) : <p className="small my-media__empty">No photos yet. Profiles with a clear headshot get looked at first.</p>}
      </section>

      <section aria-labelledby="m-reels" className="my-media__group">
        <h3 id="m-reels">Showreels <span className="my-media__count">{reels.length}</span></h3>
        {reels.length ? (
          <ul className="clips">
            {reels.map((r, i) => (
              <li key={r.url + i} className="clip">
                <ClipPlayer clip={r} fallbackTitle={`Showreel ${i + 1}`} />
                <p className="clip__title">{r.title || `Showreel ${i + 1}`}</p>
                <p className="clip__meta">{i === 0 ? <span className="img-list__main">Main</span> : null}<Origin url={r.url} /></p>
              </li>
            ))}
          </ul>
        ) : <p className="small my-media__empty">No showreels yet. Upload one, or paste a YouTube or Vimeo link.</p>}
      </section>

      {pet ? null : (
        <section aria-labelledby="m-voices" className="my-media__group">
          <h3 id="m-voices">Voice clips <span className="my-media__count">{voices.length}</span></h3>
          {voices.length ? (
            <ul className="clips clips--audio">
              {voices.map((v, i) => (
                <li key={v.url + i} className="clip">
                  <p className="clip__title">{v.title || `Voice clip ${i + 1}`}</p>
                  <ClipPlayer clip={v} fallbackTitle={`Voice clip ${i + 1}`} />
                  <p className="clip__meta">{i === 0 ? <span className="img-list__main">Main</span> : null}<Origin url={v.url} /></p>
                </li>
              ))}
            </ul>
          ) : <p className="small my-media__empty">No voice clips yet. Voice-over work is cast from these.</p>}
        </section>
      )}

      {p.media.documents.length ? (
        <section aria-labelledby="m-docs" className="my-media__group">
          <h3 id="m-docs">Documents</h3>
          <ul className="plain">{p.media.documents.map((d) => <li key={d.url}><a href={d.url} target="_blank" rel="noopener">{d.name}</a></li>)}</ul>
          <p className="small">Added by the RafikiHub team. Email us to change them.</p>
        </section>
      ) : null}
    </section>
  );
}
