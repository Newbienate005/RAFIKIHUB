"use client";

import { useRef, useState } from "react";
import type { Video } from "@/lib/data";
import { VideoPlayer } from "./VideoPlayer";

const PER_PAGE = 9;
const ALL = "All Genres";

/**
 * The Video Library as on the old site: a genre dropdown and nine videos a page with Prev / 1 / 2 / Next.
 * Every video stays in the HTML (hidden when not on the current page) so search engines see them all.
 */
export function VideoLibrary({ videos, genres }: { videos: Video[]; genres: readonly string[] }) {
  const [genre, setGenre] = useState(ALL);
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);
  // Genres that have videos, in the admin's order, plus any genre a stored video uses that isn't in the list
  const options = [...genres.filter((g) => videos.some((v) => v.category === g)), ...Array.from(new Set(videos.map((v) => v.category).filter((c) => !genres.includes(c))))];
  const matching = videos.map((v, i) => ({ v, i })).filter(({ v }) => genre === ALL || v.category === genre);
  const pages = Math.max(1, Math.ceil(matching.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = new Set(matching.slice((current - 1) * PER_PAGE, current * PER_PAGE).map(({ i }) => i));

  const go = (p: number) => {
    setPage(p);
    top.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  };

  return (
    <div ref={top} className="vlib">
      <div className="vlib__head">
        <h2 className="vlib__title">Recent Videos</h2>
        <div className="field vlib__genre">
          <label htmlFor="vlib-genre" className="sr-only">Genre</label>
          <select id="vlib-genre" value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }}>
            <option value={ALL}>{ALL}</option>
            {options.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>
      <p className="sr-only" aria-live="polite">{matching.length} videos{pages > 1 ? `, page ${current} of ${pages}` : ""}</p>
      <div className="cards">
        {videos.map((v, i) => (
          <div key={`${v.youtubeId ?? v.file}-${i}`} hidden={!shown.has(i)}><VideoPlayer video={v} /></div>
        ))}
      </div>
      {pages > 1 ? (
        <nav className="vlib__pages" aria-label="Video pages">
          <button type="button" className="chip" onClick={() => go(current - 1)} disabled={current === 1}>Prev</button>
          {Array.from({ length: pages }, (_, n) => n + 1).map((p) => (
            <button key={p} type="button" className="chip" aria-pressed={p === current} aria-label={`Page ${p}`} onClick={() => go(p)}>{p}</button>
          ))}
          <button type="button" className="chip" onClick={() => go(current + 1)} disabled={current === pages}>Next</button>
        </nav>
      ) : null}
    </div>
  );
}
