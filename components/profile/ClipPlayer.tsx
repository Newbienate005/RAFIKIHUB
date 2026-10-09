import type { MediaClip } from "@/lib/data";
import { clipKind } from "@/lib/media";

/**
 * Plays a showreel or voice clip in the page. Video and audio files only load their first frame or
 * nothing until someone presses play. Old-site formats browsers can't play are offered as a download.
 */
export function ClipPlayer({ clip, fallbackTitle }: { clip: MediaClip; fallbackTitle: string }) {
  const title = clip.title || fallbackTitle;
  const k = clipKind(clip.url);
  if (k.kind === "youtube" || k.kind === "vimeo") {
    const src = k.kind === "youtube" ? `https://www.youtube-nocookie.com/embed/${k.id}?rel=0&modestbranding=1` : `https://player.vimeo.com/video/${k.id}?dnt=1`;
    return (
      <div className="clip__frame">
        <iframe src={src} title={title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
      </div>
    );
  }
  if (k.kind === "video" && k.playable) {
    return (
      // #t=0.1 makes browsers show the first frame instead of a black box
      <video className="clip__video" controls playsInline preload="metadata" src={`${clip.url}#t=0.1`} aria-label={title}>
        <a href={clip.url}>Download {title}</a>
      </video>
    );
  }
  if (k.kind === "audio" && k.playable) {
    return (
      <audio className="clip__audio" controls preload="none" src={clip.url} aria-label={title}>
        <a href={clip.url}>Download {title}</a>
      </audio>
    );
  }
  return (
    <p className="clip__fallback">
      {k.kind === "link" ? "Opens on another site." : "This file type doesn't play in the browser."}{" "}
      <a href={clip.url} target="_blank" rel="noopener">{k.kind === "link" ? "Open" : "Download"} {title}<span className="sr-only"> (new tab)</span></a>
    </p>
  );
}
