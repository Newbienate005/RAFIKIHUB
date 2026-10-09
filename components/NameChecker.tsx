"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

type Status = { status: "idle" | "checking" | "available" | "taken" | "error"; message?: string; for?: string };

/**
 * Stage Name Checker. Checks as you type (after a short pause), so the answer is there without pressing
 * anything; the button still works. Only the latest name's answer is shown.
 */
export function NameChecker() {
  const [name, setName] = useState("");
  const [state, setState] = useState<Status>({ status: "idle" });
  const pending = useRef<AbortController | null>(null);
  const inFlightFor = useRef<string | null>(null);

  async function run(value: string) {
    const v = value.trim();
    if (v === inFlightFor.current) return; // already checking exactly this name
    pending.current?.abort();
    inFlightFor.current = null;
    if (v.length < 2) return setState(v ? { status: "error", message: "Enter at least two letters." } : { status: "idle" });
    const ctrl = new AbortController();
    pending.current = ctrl;
    inFlightFor.current = v;
    setState({ status: "checking", for: v });
    try {
      const res = await fetch("/api/name-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: v }), signal: ctrl.signal });
      const json = await res.json().catch(() => ({ ok: false, error: "Something went wrong on our side. Try again soon." }));
      if (ctrl.signal.aborted) return;
      inFlightFor.current = null;
      if (!json.ok) return setState({ status: "error", message: json.error });
      setState({ status: json.available ? "available" : "taken", for: v });
    } catch (e) {
      if ((e as Error).name === "AbortError") return; // a newer check replaced this one
      inFlightFor.current = null;
      setState({ status: "error", message: "You appear to be offline. Try again." });
    }
  }

  // Check after a pause in typing, not on every keystroke
  useEffect(() => {
    if (!name.trim()) { pending.current?.abort(); inFlightFor.current = null; setState({ status: "idle" }); return; }
    const t = setTimeout(() => run(name), 500);
    return () => clearTimeout(t);
  }, [name]);

  useEffect(() => () => pending.current?.abort(), []);

  const onSubmit = (e: FormEvent) => { e.preventDefault(); run(name); };

  return (
    <form className="namecheck" onSubmit={onSubmit}>
      <label htmlFor="stage-name" className="sr-only">Stage name</label>
      <input id="stage-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Wanjiru Kamau" autoComplete="off" spellCheck={false} />
      <button className="btn btn--sun" type="submit" disabled={state.status === "checking"}>{state.status === "checking" ? "Checking…" : "Check availability"}</button>
      <p className="namecheck__result" role="status" aria-live="polite">
        {state.status === "checking" ? <span className="small">Checking “{state.for}”…</span> : null}
        {state.status === "available" ? <strong className="ok">“{state.for}” is available.</strong> : null}
        {state.status === "taken" ? <strong>“{state.for}” is already registered on RafikiHub. Try adding a middle name or initial.</strong> : null}
        {state.status === "error" ? <span className="field-error">{state.message}</span> : null}
      </p>
    </form>
  );
}
