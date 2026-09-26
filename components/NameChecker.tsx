"use client";

import { useState, type FormEvent } from "react";

export function NameChecker() {
  const [name, setName] = useState("");
  const [state, setState] = useState<{ status: "idle" | "checking" | "available" | "taken" | "error"; message?: string }>({ status: "idle" });

  async function check(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return setState({ status: "error", message: "Enter at least two letters." });
    setState({ status: "checking" });
    try {
      const res = await fetch("/api/name-check", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      const json = await res.json();
      if (!json.ok) return setState({ status: "error", message: json.error });
      setState({ status: json.available ? "available" : "taken" });
    } catch {
      setState({ status: "error", message: "You appear to be offline. Try again." });
    }
  }

  return (
    <form className="namecheck" onSubmit={check}>
      <label htmlFor="stage-name" className="sr-only">Stage name</label>
      <input id="stage-name" value={name} onChange={(e) => { setName(e.target.value); setState({ status: "idle" }); }} placeholder="e.g. Wanjiru Kamau" autoComplete="off" />
      <button className="btn btn--sun" type="submit" disabled={state.status === "checking"}>{state.status === "checking" ? "Checking…" : "Check availability"}</button>
      <p className="namecheck__result" role="status">
        {state.status === "available" ? <strong className="ok">“{name.trim()}” is available.</strong> : null}
        {state.status === "taken" ? <strong>That name is already registered on RafikiHub. Try adding a middle name or initial.</strong> : null}
        {state.status === "error" ? <span className="field-error">{state.message}</span> : null}
      </p>
    </form>
  );
}
