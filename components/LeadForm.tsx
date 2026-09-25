"use client";

import { useState, type FormEvent } from "react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  half?: boolean;
};

type Props = {
  endpoint: string;
  fields: Field[];
  submitLabel: string;
  successMessage: string;
  compact?: boolean;
};

export function LeadForm({ endpoint, fields, submitLabel, successMessage, compact }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    setFieldErrors({});
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.ok) return setState("done");
      setFieldErrors(json.fields ?? {});
      setError(json.error ?? "That didn't go through. Try again.");
    } catch {
      setError("You appear to be offline. Check your connection and try again.");
    }
    setState("idle");
  }

  if (state === "done") {
    return <p className="form-success" role="status">{successMessage}</p>;
  }

  return (
    <form className={compact ? "form form--compact" : "form"} onSubmit={onSubmit} noValidate>
      {fields.map((f) => {
        const id = `${endpoint.replace(/\W/g, "")}-${f.name}`;
        const err = fieldErrors[f.name];
        const common = {
          id,
          name: f.name,
          required: f.required,
          autoComplete: f.autoComplete,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": err ? `${id}-err` : f.hint ? `${id}-hint` : undefined,
        };
        return (
          <div key={f.name} className={`field ${f.half ? "field--half" : ""}`}>
            <label htmlFor={id} className={compact ? "sr-only" : undefined}>
              {f.label}{!f.required && !compact ? <span className="optional"> (optional)</span> : null}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={5} />
            ) : f.type === "select" ? (
              <select {...common} defaultValue="">
                <option value="" disabled>Choose one</option>
                {f.options?.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : (
              <input {...common} type={f.type ?? "text"} placeholder={compact ? f.label : undefined} />
            )}
            {f.hint && !err ? <p id={`${id}-hint`} className="hint">{f.hint}</p> : null}
            {err ? <p id={`${id}-err`} className="field-error">{err}</p> : null}
          </div>
        );
      })}
      {/* Honeypot: hidden from people, bots fill it in */}
      <div className="hp" aria-hidden="true">
        <label>Leave this empty<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="btn btn--sun" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
