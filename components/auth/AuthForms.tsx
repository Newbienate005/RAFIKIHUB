"use client";

import Link from "next/link";
import { useState, type FormEvent, type ReactNode } from "react";

type Result = { ok?: boolean; error?: string; message?: string; redirect?: string; fields?: Record<string, string> };

/** Posts JSON, follows a redirect on success, and keeps what was typed when something's wrong. */
function useJsonForm(endpoint: string) {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>({});
  async function submit(e: FormEvent<HTMLFormElement>, extra: Record<string, string> = {}) {
    e.preventDefault();
    setBusy(true);
    setResult({});
    const data = { ...Object.fromEntries(new FormData(e.currentTarget).entries()), ...extra };
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const json: Result = await res.json().catch(() => ({ error: "Something went wrong on our side. Try again." }));
      if (json.ok && json.redirect) return window.location.assign(json.redirect);
      setResult(json);
    } catch {
      setResult({ error: "You appear to be offline. Check your connection and try again." });
    }
    setBusy(false);
  }
  return { busy, result, submit };
}

function Field({ id, label, type, autoComplete, error, hint, extra }: { id: string; label: string; type: string; autoComplete: string; error?: string; hint?: ReactNode; extra?: ReactNode }) {
  return (
    <div className="field">
      <div className="field__row"><label htmlFor={id}>{label}</label>{extra}</div>
      <input id={id} name={id} type={type} autoComplete={autoComplete} required aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined} />
      {error ? <p id={`${id}-err`} className="field-error">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

/** Members: email and password. Old rafikihub.com passwords work. */
export function MemberLoginForm() {
  const { busy, result, submit } = useJsonForm("/api/auth/member-login");
  return (
    <form className="form" method="post" action="/api/auth/member-login" onSubmit={(e) => submit(e)} noValidate>
      <Field id="email" label="Email" type="email" autoComplete="email" />
      <Field id="password" label="Password" type="password" autoComplete="current-password" extra={<Link href="/forgot-password" className="field__aside">Forgot password?</Link>} />
      {result.error ? <p className="form-error" role="alert">{result.error}</p> : null}
      <button className="btn btn--sun" type="submit" disabled={busy} aria-busy={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}

/** Asks for a reset link. Always gives the same answer, so it can't reveal who has an account. */
export function ForgotForm() {
  const { busy, result, submit } = useJsonForm("/api/auth/forgot");
  if (result.ok) return <p className="form-success" role="status">{result.message}</p>;
  return (
    <form className="form" onSubmit={(e) => submit(e)} noValidate>
      <Field id="email" label="Email" type="email" autoComplete="email" hint="The address you signed up to RafikiHub with." error={result.error && !result.ok ? result.error : undefined} />
      <button className="btn btn--sun" type="submit" disabled={busy} aria-busy={busy}>{busy ? "Sending…" : "Send reset link"}</button>
    </form>
  );
}

/** Sets a new password from the link in the email. */
export function ResetForm({ token }: { token: string }) {
  const { busy, result, submit } = useJsonForm("/api/auth/reset");
  const [mismatch, setMismatch] = useState("");
  return (
    <form
      className="form"
      noValidate
      onSubmit={(e) => {
        const f = new FormData(e.currentTarget);
        if (f.get("password") !== f.get("confirm")) { e.preventDefault(); setMismatch("The two passwords don't match."); return; }
        setMismatch("");
        submit(e, { token });
      }}
    >
      <Field id="password" label="New password" type="password" autoComplete="new-password" error={result.fields?.password} hint="At least 8 characters. A short sentence is easy to remember and hard to guess." />
      <Field id="confirm" label="Type it again" type="password" autoComplete="new-password" error={mismatch || undefined} />
      {result.error && !result.fields ? <p className="form-error" role="alert">{result.error} {/expired|used/.test(result.error) ? <Link href="/forgot-password">Get a new link</Link> : null}</p> : null}
      <button className="btn btn--sun" type="submit" disabled={busy} aria-busy={busy}>{busy ? "Saving…" : "Save new password"}</button>
    </form>
  );
}
