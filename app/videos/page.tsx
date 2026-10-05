import { CtaBand } from "@/components/CtaBand";
import { FilterGrid } from "@/components/FilterGrid";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { VideoPlayer } from "@/components/VideoPlayer";
import { videos } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMeta({
  title: "RafikiHub Online: video library of acting workshops and masterclasses",
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
    uploadDate: v.published,
  }));
  return (
    <>
      {videos.length ? <JsonLd data={schema} /> : null}
      <PageHeader
        kicker="RafikiHub Online · Video Library"
        title={<>Learn from <em>working artists</em>.</>}
        lead="Free workshops and masterclasses from the RafikiHub community of performers and crew."
        crumbs={[{ name: "RafikiHub Resources", path: "/resources" }, { name: "RafikiHub Online", path: "/videos" }]}
      />
      <section className="section">
        <div className="wrap">
          {videos.length ? (
            <FilterGrid
              label="Filter videos by category"
              items={videos.map((v) => ({
                key: v.youtubeId,
                group: v.category,
                node: <VideoPlayer video={v} />,
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
