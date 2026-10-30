"use client";

import { useState, useTransition } from "react";
import { applyToCasting, withdrawApplication } from "@/app/dashboard/performer/actions";

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
