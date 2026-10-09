"use client";

import { useEffect, useRef, useState, type FocusEvent, type FormEvent } from "react";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  /** Display labels for options, if different from the submitted values */
  optionLabels?: string[];
  /** Pre-select this field from a URL query parameter, e.g. ?plan=premium */
  defaultFromQuery?: string;
  required?: boolean;
  autoComplete?: string;
  hint?: string;
  half?: boolean;
};

/** The same checks the server makes, run as people fill the form in, so problems show up where they are. */
function check(f: Field, raw: string): string {
  const v = raw.trim();
  if (!v) return f.required ? (f.type === "select" ? "Choose one." : `Add your ${f.label.toLowerCase().replace(/^your /, "")}.`) : "";
  if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address, like name@example.com.";
  if (f.type === "tel" && v.replace(/\D/g, "").length < 7) return "Enter a phone number, with the country code if it's not Kenyan.";
  return "";
}

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
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    for (const f of fields) {
      const v = f.defaultFromQuery ? params.get(f.defaultFromQuery) : null;
      const el = v ? formRef.current?.elements.namedItem(f.name) : null;
      if (v && (el instanceof HTMLInputElement || el instanceof HTMLSelectElement) && (!f.options || f.options.includes(v))) el.value = v;
    }
  }, [fields]);

  const fieldFor = (name: string) => fields.find((f) => f.name === name);

  /** Validate a field when the person leaves it; once it has an error, re-check as they type so it clears straight away. */
  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const el = e.target as EventTarget as HTMLInputElement; // the field inside the form that fired it
    const f = fieldFor(el.name);
    if (!f) return;
    const msg = check(f, el.value);
    setFieldErrors((prev) => (prev[f.name] === msg || (!msg && !prev[f.name]) ? prev : { ...prev, [f.name]: msg }));
  };
  const onInput = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as EventTarget as HTMLInputElement; // the field inside the form that fired it
    const f = fieldFor(el.name);
    if (!f || !fieldErrors[f.name]) return;
    const msg = check(f, el.value);
    if (msg !== fieldErrors[f.name]) setFieldErrors((prev) => ({ ...prev, [f.name]: msg }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Check everything first: nothing is sent while a field still needs attention
    const form = e.currentTarget;
    const local: Record<string, string> = {};
    for (const f of fields) {
      const el = form.elements.namedItem(f.name) as HTMLInputElement | null;
      const msg = check(f, el?.value ?? "");
      if (msg) local[f.name] = msg;
    }
    if (Object.keys(local).length) {
      setFieldErrors(local);
      setError("");
      (form.elements.namedItem(Object.keys(local)[0]) as HTMLElement | null)?.focus();
      return;
    }
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
      const json = await res.json().catch(() => ({ ok: false, error: "Something went wrong on our side. Try again, or email info@rafikihub.com." }));
      if (json.ok && json.redirect) return window.location.assign(json.redirect); // signed in: open the dashboard
      if (json.ok) return setState("done");
      setFieldErrors(json.fields ?? {});
      const firstBad = Object.keys(json.fields ?? {})[0];
      if (firstBad) (formRef.current?.elements.namedItem(firstBad) as HTMLElement | null)?.focus();
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
    <form ref={formRef} className={compact ? "form form--compact" : "form"} onSubmit={onSubmit} onBlur={onBlur} onInput={onInput} onChange={onInput} noValidate>
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
                {f.options?.map((o, i) => <option key={o} value={o}>{f.optionLabels?.[i] ?? o}</option>)}
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
