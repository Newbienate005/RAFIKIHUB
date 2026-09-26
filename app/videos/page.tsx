import { CtaBand } from "@/components/CtaBand";
import { FilterGrid } from "@/components/FilterGrid";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { videos } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "Video Library: acting workshops and masterclasses",
  description: "Free workshops and masterclasses from RafikiHub: acting, self-tapes, auditions and crew skills, taught by working artists in Kenya.",
  path: "/videos",
  noindex: videos.length === 0,
});

export default function VideosPage() {
  const schema = videos.map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: `${v.title}${v.instructor ? ` with ${v.instructor}` : ""}. A RafikiHub ${v.category.toLowerCase()} masterclass.`,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
    uploadDate: "2024-01-01",
  }));
  return (
    <>
      {videos.length ? <JsonLd data={schema} /> : null}
      <PageHeader
        kicker="Video Library"
        title={<>Learn from <em>working artists</em>.</>}
        lead="Free workshops and masterclasses from the RafikiHub community of performers and crew."
        crumbs={[{ name: "Resource Hub", path: "/resources" }, { name: "Video Library", path: "/videos" }]}
      />
      <section className="section">
        <div className="wrap">
          {videos.length ? (
            <FilterGrid
              label="Filter videos by category"
              items={videos.map((v) => ({
                key: v.youtubeId,
                group: v.category,
                node: (
                  <a className="video" href={`https://www.youtube.com/watch?v=${v.youtubeId}`} target="_blank" rel="noopener">
                    <span className="video__thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
                      <span className="video__play" aria-hidden="true">▶</span>
                      {v.duration ? <span className="video__dur">{v.duration}</span> : null}
                    </span>
                    <span className="card__genre">{v.category}</span>
                    <span className="video__title">{v.title}</span>
                    {v.instructor ? <span className="card__meta">with {v.instructor}</span> : null}
                  </a>
                ),
              }))}
            />
          ) : (
            <div className="empty">
              <h2>New videos are on their way</h2>
              <p>While we add them here, watch RafikiHub workshops and masterclasses on our YouTube channel.</p>
              <a className="btn btn--ink" href={site.social.youtube} target="_blank" rel="noopener">Watch on YouTube</a>
            </div>
          )}
        </div>
      </section>
      <CtaBand title="Want to teach a workshop?" text="We're always looking for working actors, directors and crew to share what they know." primary={{ href: "/contact", label: "Get in touch" }} />
    </>
  );
}
