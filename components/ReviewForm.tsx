"use client";

import { useState, useTransition } from "react";
import { leaveReview } from "@/app/dashboard/review-actions";

/** "Review" link that opens a small star + text form in place. The team approves reviews before they show. */
export function ReviewForm({ kind, subject, about, done }: { kind: "performer" | "casting" | "service"; subject: string; about: string; done?: boolean }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (done || msg?.ok) return <span className="small">Reviewed ✓</span>;
  const id = `review-${kind}-${subject}`;
  return (
    <details className="review-form">
      <summary className="link-button">Review</summary>
      <form onSubmit={(e) => { e.preventDefault(); const f = new FormData(e.currentTarget); start(async () => { const r = await leaveReview(subject, f); setMsg(r.ok ? { ok: true, text: "" } : { ok: false, text: r.error }); }); }}>
        <input type="hidden" name="kind" value={kind} />
        <fieldset className="review-form__stars">
          <legend>Rating for {about}</legend>
          {[5, 4, 3, 2, 1].map((n) => (
            <span key={n}><input type="radio" id={`${id}-${n}`} name="rating" value={n} required /><label htmlFor={`${id}-${n}`} title={`${n} star${n > 1 ? "s" : ""}`}>★<span className="sr-only"> {n}</span></label></span>
          ))}
        </fieldset>
        <label htmlFor={`${id}-body`} className="sr-only">Your review of {about}</label>
        <textarea id={`${id}-body`} name="body" rows={3} required minLength={10} maxLength={1000} placeholder="What was it like working together?" />
        {msg && !msg.ok ? <p className="field-error" role="alert">{msg.text}</p> : null}
        <button type="submit" className="btn btn--sun btn--sm" disabled={pending} aria-busy={pending}>{pending ? "Sending…" : "Send review"}</button>
        <p className="hint">The RafikiHub team checks every review before it&apos;s shown.</p>
      </form>
    </details>
  );
}
