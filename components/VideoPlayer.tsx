"use client";

import { useState } from "react";
import type { Video } from "@/lib/data";

/**
 * Plays a YouTube video on the page. Until someone presses play it is just a thumbnail, so the
 * page doesn't load YouTube's player (or its cookies) for every video. Uses youtube-nocookie.com.
 */
export function VideoPlayer({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { youtubeId, title } = video;
  return (
    <div className="video">
      <div className="video__thumb">
        {/* The thumbnail stays underneath until the player has loaded, then the player fades in over it */}
        <button type="button" className={`video__start${playing && !loaded ? " is-loading" : ""}`} onClick={() => setPlaying(true)} aria-label={`Play video: ${title}`} disabled={playing} aria-busy={playing && !loaded}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="video__play" aria-hidden="true">▶</span>
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
      </div>
      <span className="card__genre">{video.category}</span>
      <h2 className="video__title">{title}</h2>
      {video.instructor ? <span className="card__meta">with {video.instructor}</span> : null}
      <a className="video__yt" href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener">
        Watch on YouTube<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
