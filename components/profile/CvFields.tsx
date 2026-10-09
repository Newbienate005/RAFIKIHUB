"use client";

import { useId, useState, type KeyboardEvent } from "react";

/**
 * Friendly CV editors: rows for credits, training and appearance traits, and tag lists for skills,
 * languages and the like. Each one sends a single hidden field in the same "a | b | c" / one-per-line
 * format the profile form already reads, so the server side doesn't change.
 */

// "|" and line breaks separate columns and rows in the hidden field, so they can't appear inside a value
const clean = (v: string) => v.replace(/[|\r\n]+/g, " ").replace(/\s{2,}/g, " ");

type Col = { key: string; label: string; type?: "text" | "number" | "select"; options?: readonly string[]; placeholder?: string; width?: string; optional?: boolean };

function Rows<R extends Record<string, string>>({ name, label, cols, initial, blank, noun, hint }: { name: string; label: string; cols: Col[]; initial: R[]; blank: R; noun: string; hint?: string }) {
  const [rows, setRows] = useState<R[]>(initial);
  const id = useId();
  const set = (i: number, k: string, v: string) => setRows((r) => r.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const move = (i: number, d: -1 | 1) => setRows((r) => { const n = [...r]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  // Rows with nothing typed in (a dropdown alone doesn't count) are dropped; empty trailing columns are trimmed off
  const value = rows
    .filter((r) => cols.some((c) => c.type !== "select" && clean(r[c.key] ?? "").trim()))
    .map((r) => cols.map((c) => clean(r[c.key] ?? "").trim()).join(" | ").replace(/( \| )+$/, ""))
    .join("\n");
  return (
    <fieldset className="field rows-field">
      <legend>{label}</legend>
      <input type="hidden" name={name} value={value} />
      {rows.length ? (
        <ol className="rows-field__list">
          {rows.map((r, i) => (
            <li key={i} className="rows-field__row">
              <div className="rows-field__cols" style={{ gridTemplateColumns: cols.map((c) => c.width ?? "1fr").join(" ") }}>
                {cols.map((c) => {
                  const fid = `${id}-${i}-${c.key}`;
                  return (
                    <div key={c.key} className="rows-field__col">
                      <label htmlFor={fid}>{c.label}{c.optional ? <span className="rows-field__opt"> (optional)</span> : null}</label>
                      {c.type === "select" ? (
                        <select id={fid} value={r[c.key] ?? ""} onChange={(e) => set(i, c.key, e.target.value)}>
                          {!c.options?.includes(r[c.key]) ? <option value={r[c.key] ?? ""}>{r[c.key] || "Choose"}</option> : null}
                          {c.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input id={fid} type={c.type ?? "text"} inputMode={c.type === "number" ? "numeric" : undefined} value={r[c.key] ?? ""} placeholder={c.placeholder} onChange={(e) => set(i, c.key, e.target.value)} />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="rows-field__tools">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${noun} ${i + 1} up`}>↑</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === rows.length - 1} aria-label={`Move ${noun} ${i + 1} down`}>↓</button>
                <button type="button" onClick={() => setRows((x) => x.filter((_, j) => j !== i))} aria-label={`Remove ${noun} ${i + 1}`}>✕</button>
              </div>
            </li>
          ))}
        </ol>
      ) : <p className="hint">No {noun}s yet.</p>}
      <button type="button" className="btn btn--ink btn--sm" onClick={() => setRows((r) => [...r, { ...blank }])}>+ Add {noun}</button>
      {hint ? <p className="hint">{hint}</p> : null}
    </fieldset>
  );
}

export type CreditRow = { year: string; production: string; role: string; type: string; director: string };
export function CreditsField({ initial, types }: { initial: CreditRow[]; types: readonly string[] }) {
  return (
    <Rows name="credits" label="Credits" noun="credit" initial={initial} blank={{ year: "", production: "", role: "", type: types[0], director: "" }}
      hint="Newest first is how they're shown on your profile, whatever order you add them in."
      cols={[
        { key: "year", label: "Year", type: "number", placeholder: "2025", width: "5.5rem" },
        { key: "production", label: "Production", placeholder: "e.g. Volume" },
        { key: "role", label: "Role", placeholder: "e.g. Lead, Kamau" },
        { key: "type", label: "Type", type: "select", options: types, width: "9rem" },
        { key: "director", label: "Director", optional: true },
      ]} />
  );
}

export type TrainingRow = { institution: string; course: string; year: string };
export function TrainingField({ initial }: { initial: TrainingRow[] }) {
  return (
    <Rows name="training" label="Training" noun="course" initial={initial} blank={{ institution: "", course: "", year: "" }}
      cols={[
        { key: "institution", label: "School or teacher", placeholder: "e.g. Kenya National Theatre" },
        { key: "course", label: "Course", placeholder: "e.g. Screen acting masterclass" },
        { key: "year", label: "Year", type: "number", placeholder: "2024", width: "5.5rem", optional: true },
      ]} />
  );
}

export type TraitRow = { trait: string; location: string };
export function TraitsField({ initial, traits }: { initial: TraitRow[]; traits: readonly string[] }) {
  return (
    <Rows name="traits" label="Tattoos, piercings and scars" noun="trait" initial={initial} blank={{ trait: traits[0], location: "" }}
      cols={[
        { key: "trait", label: "What", type: "select", options: traits, width: "10rem" },
        { key: "location", label: "Where", placeholder: "e.g. Left wrist" },
      ]} />
  );
}

/** A list of short items (skills, languages, cities) as removable tags. Enter or comma adds one. */
export function TagsField({ name, label, initial, placeholder, hint, max }: { name: string; label: string; initial: string[]; placeholder?: string; hint?: string; max?: number }) {
  const [tags, setTags] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");
  const id = useId();
  const full = max !== undefined && tags.length >= max;
  const add = () => {
    const parts = draft.split(",").map((t) => clean(t).trim()).filter(Boolean);
    if (!parts.length) return;
    setTags((t) => [...t, ...parts.filter((p) => !t.some((x) => x.toLowerCase() === p.toLowerCase()))].slice(0, max ?? Infinity));
    setDraft("");
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); }
    else if (e.key === "Backspace" && !draft && tags.length) setTags((t) => t.slice(0, -1));
  };
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input type="hidden" name={name} value={tags.join("\n")} />
      <div className="tags-field">
        {tags.map((t, i) => (
          <span key={t + i} className="tags-field__tag">
            {t}
            <button type="button" onClick={() => setTags((x) => x.filter((_, j) => j !== i))} aria-label={`Remove ${t}`}>✕</button>
          </span>
        ))}
        <input id={id} value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={onKey} onBlur={add} placeholder={full ? "That's the most you can add" : placeholder} disabled={full} />
      </div>
      <p className="hint">{hint ? `${hint} ` : ""}Press Enter or type a comma after each one.</p>
    </div>
  );
}
