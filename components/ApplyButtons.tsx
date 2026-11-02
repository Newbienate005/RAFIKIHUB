"use client";

import { useState, useTransition } from "react";
import { applyToCasting, submitClient, withdrawApplication } from "@/app/dashboard/performer/actions";

/** "Apply" on an open casting: sends the application, then says how it went in place. */
export function ApplyButton({ auditionId, title }: { auditionId: number; title: string }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  if (msg?.ok) return <span className="status status--shortlisted" role="status">Applied ✓</span>;
  return (
    <span className="apply">
      <button type="button" className="btn btn--sun btn--sm" disabled={pending} aria-busy={pending} aria-label={`Apply to ${title}`}
        onClick={() => start(async () => { const r = await applyToCasting(auditionId); setMsg(r.ok ? { ok: true, text: "" } : { ok: false, text: r.error }); })}>
        {pending ? "Sending…" : "Apply"}
      </button>
      {msg && !msg.ok ? <span className="field-error" role="alert">{msg.text}</span> : null}
    </span>
  );
}

/** "Withdraw" on the member's own application, after a confirm. */
export function WithdrawButton({ applicationId, title }: { applicationId: number; title: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <span className="apply">
      <button type="button" className="link-button" disabled={pending} aria-label={`Withdraw from ${title}`}
        onClick={() => { if (window.confirm(`Withdraw your application for "${title}"? You can't apply to it again.`)) start(async () => { const r = await withdrawApplication(applicationId); if (!r.ok) setError(r.error); }); }}>
        {pending ? "Withdrawing…" : "Withdraw"}
      </button>
      {error ? <span className="field-error" role="alert">{error}</span> : null}
    </span>
  );
}

/** An agent picks an open casting and submits one of their approved clients to it. */
export function SubmitClient({ performerId, name, castings }: { performerId: number; name: string; castings: { id: number; title: string }[] }) {
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pick, setPick] = useState("");
  if (!castings.length) return <span className="small">No open castings</span>;
  return (
    <span className="apply">
      <label htmlFor={`sub-${performerId}`} className="sr-only">Casting to submit {name} to</label>
      <select id={`sub-${performerId}`} value={pick} onChange={(e) => { setPick(e.target.value); setMsg(null); }}>
        <option value="">Choose a casting</option>
        {castings.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
      </select>
      <button type="button" className="btn btn--sun btn--sm" disabled={pending || !pick} aria-busy={pending}
        onClick={() => start(async () => { const r = await submitClient(performerId, Number(pick)); setMsg(r.ok ? { ok: true, text: "Submitted ✓" } : { ok: false, text: r.error }); })}>
        {pending ? "Sending…" : "Submit"}
      </button>
      {msg ? <span className={msg.ok ? "status status--shortlisted" : "field-error"} role={msg.ok ? "status" : "alert"}>{msg.text}</span> : null}
    </span>
  );
}
