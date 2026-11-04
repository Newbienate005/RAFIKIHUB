"use client";

import { useState } from "react";
import type { Video } from "@/lib/data";

/** "2022-12-27" → "27 Dec, 2022", as on the old Video Library */
const shownDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).replace(/ (\d{4})$/, ", $1");
};

/**
 * Plays a Video Library video on the page. A YouTube video is just a thumbnail until someone presses play,
 * so the page doesn't load YouTube's player (or its cookies) for every video. Uses youtube-nocookie.com.
 * An uploaded file plays in the browser's own player.
 */
export function VideoPlayer({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { youtubeId, file, title } = video;
  return (
    <div className="video">
      <div className="video__thumb">
        {youtubeId ? (
          <>
            {/* The thumbnail stays underneath until the player has loaded, then the player fades in over it */}
            <button type="button" className={`video__start${playing && !loaded ? " is-loading" : ""}`} onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`} disabled={playing} aria-busy={playing && !loaded}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="" width={480} height={360} loading="lazy" decoding="async" />
              <span className="video__play" aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg></span>
              {video.duration ? <span className="video__dur">{video.duration}</span> : null}
            </button>
            {playing ? (
              <iframe
                className={loaded ? "is-loaded" : undefined}
                onLoad={() => setLoaded(true)}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : null}
          </>
        ) : file ? (
          <video className="video__file" src={file} controls preload="metadata" playsInline aria-label={title} />
        ) : null}
      </div>
      <h2 className="video__title">{title}</h2>
      {video.instructor ? <span className="card__meta">with {video.instructor}</span> : null}
      <p className="video__meta">
        <span>Issued by Admin</span>
        <time dateTime={video.published}>{shownDate(video.published)}</time>
      </p>
      <span className="card__genre video__genre">{video.category}</span>
    </div>
  );
}
