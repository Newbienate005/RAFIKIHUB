"use client";

import { useState } from "react";
import type { Article } from "@/lib/data";
import { ArticleCard } from "./ArticleCard";

/** "All genres" filter from the old blog. Every article stays in the HTML, so search engines see them all. */
export function BlogFilter({ articles, genres }: { articles: Article[]; genres: string[] }) {
  const [genre, setGenre] = useState("All genres");
  const options = ["All genres", ...genres.filter((g) => articles.some((a) => a.genre === g))];
  const count = genre === "All genres" ? articles.length : articles.filter((a) => a.genre === genre).length;

  return (
    <>
      <div className="filter" role="group" aria-label="Filter articles by genre">
        {options.map((g) => (
          <button key={g} type="button" className="chip" aria-pressed={genre === g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">{count} articles shown</p>
      <div className="cards">
        {articles.map((a) => (
          <div key={a.url} hidden={genre !== "All genres" && a.genre !== genre}>
            <ArticleCard article={a} headingLevel={2} />
          </div>
        ))}
      </div>
    </>
  );
}
