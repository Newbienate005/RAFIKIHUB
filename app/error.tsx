"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site } from "@/lib/site";

/** Shown when a page fails while loading. Says what happened, keeps the person in the site, and offers a retry. */
export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[page]", error);
  }, [error]);

  return (
    <section className="section">
      <div className="wrap measure">
        <p className="kicker">Something went wrong</p>
        <h1>This page missed its cue</h1>
        <p className="lead">It didn&apos;t load properly. That&apos;s on our side, not yours. Try again, and if it keeps happening, email us and we&apos;ll sort it out.</p>
        <div className="btn-row">
          <button type="button" className="btn btn--sun" onClick={reset}>Try again</button>
          <Link className="btn btn--ghost" href="/">Go to the home page</Link>
        </div>
        <p className="small">
          Still stuck? Email <a href={`mailto:${site.email}?subject=${encodeURIComponent("A page on RafikiHub isn't loading")}`}>{site.email}</a>
          {error.digest ? <> and mention code <code>{error.digest}</code></> : null}.
        </p>
      </div>
    </section>
  );
}
