import { CtaBand } from "@/components/CtaBand";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { VideoLibrary } from "@/components/VideoLibrary";
import { images } from "@/lib/images";
import { getContent } from "@/lib/content";
import { videoGenres } from "@/lib/data";
import { pageMeta } from "@/lib/seo";
import { site } from "@/lib/site";

export const generateMetadata = async () => pageMeta({
  title: "Master Classes: the RafikiHub Video Library",
  description: "Free masterclasses, training workshops and how-to videos from RafikiHub, taught by working artists in Kenya.",
  path: "/videos",
  noindex: (await getContent("videos")).length === 0,
});

export default async function VideosPage() {
  const videos = await getContent("videos");
  // Search engines get the YouTube videos; uploaded files have no thumbnail to show in results
  const schema = videos.filter((v) => v.youtubeId).map((v) => ({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: v.title,
    description: `${v.title}${v.instructor ? ` with ${v.instructor}` : ""}. From the RafikiHub Video Library (${v.category}).`,
    thumbnailUrl: `https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${v.youtubeId}`,
    contentUrl: `https://www.youtube.com/watch?v=${v.youtubeId}`,
    uploadDate: v.published,
  }));
  return (
    <>
      {schema.length ? <JsonLd data={schema} /> : null}
      <PageHeader image={images.headers.videos}
        kicker="RafikiHub Resources"
        title={<>Video <em>Library</em></>}
        lead="Masterclasses, training workshops and how-to videos from the RafikiHub community of performers and crew."
        crumbs={[{ name: "RafikiHub Resources", path: "/resources" }, { name: "Video Library", path: "/videos" }]}
      />
      <section className="section">
        <div className="wrap">
          {videos.length ? (
            <VideoLibrary videos={videos} genres={videoGenres} />
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
