"use client";

import { useEffect, useState, type FormEvent } from "react";

export function LoginForm() {
  const [state, setState] = useState<"idle" | "sending">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    const password = String(new FormData(e.currentTarget).get("password") ?? "");
    try {
      const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const json = await res.json().catch(() => ({ ok: false, error: "Something went wrong on our side. Try again." }));
      if (json.ok) return window.location.assign(json.redirect ?? "/dashboard");
      setError(json.error ?? "That didn't work. Try again.");
    } catch {
      setError("You appear to be offline. Check your connection and try again.");
    }
    setState("idle");
  }

  // A no-script form post that failed comes back as /login?error=1
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("error")) setError("That password isn't right.");
  }, []);

  // method/action matter if someone submits before this script loads: the password must never go in the URL.
  return (
    <form className="form" method="post" action="/api/auth/login" onSubmit={onSubmit} noValidate>
      <div className="field">
        <label htmlFor="master-password">Master password</label>
        <input id="master-password" name="password" type="password" autoComplete="current-password" required aria-invalid={error ? true : undefined} aria-describedby={error ? "master-password-err" : undefined} />
      </div>
      {error ? <p id="master-password-err" className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn--sun" type="submit" disabled={state === "sending"}>{state === "sending" ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
