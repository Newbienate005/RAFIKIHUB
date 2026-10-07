"use client";

import { upload } from "@vercel/blob/client";
import { useId, useRef, useState } from "react";

const slug = (name: string) => name.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "image";
const ext = (name: string) => name.match(/\.[a-z0-9]+$/i)?.[0].toLowerCase() ?? ".jpg";

async function uploadImage(file: File, folder: string) {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file (JPG, PNG or WebP).");
  if (file.size > 10 * 1024 * 1024) throw new Error("That image is over 10 MB. Resize it and try again.");
  const blob = await upload(`images/${folder}/${slug(file.name)}${ext(file.name)}`, file, { access: "public", handleUploadUrl: "/api/admin/upload" });
  return blob.url;
}

function useUploader(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function run(files: FileList | File[], onUrl: (url: string) => void) {
    setBusy(true);
    setError("");
    try {
      for (const f of Array.from(files)) onUrl(await uploadImage(f, folder));
    } catch (e) {
      const msg = (e as Error).message;
      setError(/BLOB_READ_WRITE_TOKEN|aren't set up/.test(msg) ? "Uploads aren't set up yet. Paste an image link instead." : msg);
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, run };
}

/** One image: upload, paste a link, or remove. The value is sent as a hidden field. */
export function ImageField({ name, label, defaultValue, folder = "site", hint }: { name: string; label: string; defaultValue?: string; folder?: string; hint?: string }) {
  const id = useId();
  const [url, setUrl] = useState(defaultValue ?? "");
  const file = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUploader(folder);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input type="hidden" name={name} value={url} />
      <div className="img-field">
        <div className="img-field__preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url ? <img src={url} alt="" /> : <span>No image</span>}
        </div>
        <div className="img-field__controls">
          <div className="btn-row">
            <button type="button" className="btn btn--ink btn--sm" onClick={() => file.current?.click()} disabled={busy}>{busy ? "Uploading…" : url ? "Replace" : "Upload"}</button>
            {url ? <button type="button" className="btn btn--ghost btn--sm" onClick={() => setUrl("")}>Remove</button> : null}
          </div>
          <input ref={file} type="file" accept="image/*" hidden onChange={(e) => e.target.files?.length && run(e.target.files, setUrl)} />
          <input id={id} className="img-field__url" type="url" inputMode="url" placeholder="…or paste an image link" value={url} onChange={(e) => setUrl(e.target.value.trim())} />
          {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}

/** Several images in order (headshots). Sent as one hidden field, one link per line. */
export function ImageListField({ name, label, defaultValue = [], folder = "headshots", hint }: { name: string; label: string; defaultValue?: string[]; folder?: string; hint?: string }) {
  const [urls, setUrls] = useState<string[]>(defaultValue);
  const [paste, setPaste] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const { busy, error, run } = useUploader(folder);
  const move = (i: number, d: -1 | 1) => setUrls((u) => { const n = [...u]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <input type="hidden" name={name} value={urls.join("\n")} />
      {urls.length ? (
        <ol className="img-list">
          {urls.map((u, i) => (
            <li key={u + i}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt={`Headshot ${i + 1}`} />
              {i === 0 ? <span className="img-list__main">Main</span> : null}
              <div className="img-list__tools">
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move headshot ${i + 1} earlier`}>←</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === urls.length - 1} aria-label={`Move headshot ${i + 1} later`}>→</button>
                <button type="button" onClick={() => setUrls((x) => x.filter((_, j) => j !== i))} aria-label={`Remove headshot ${i + 1}`}>✕</button>
              </div>
            </li>
          ))}
        </ol>
      ) : <p className="hint">No images yet.</p>}
      <div className="btn-row">
        <button type="button" className="btn btn--ink btn--sm" onClick={() => file.current?.click()} disabled={busy}>{busy ? "Uploading…" : "Upload images"}</button>
      </div>
      <input ref={file} type="file" accept="image/*" multiple hidden onChange={(e) => e.target.files?.length && run(e.target.files, (u) => setUrls((x) => [...x, u]))} />
      <div className="img-field__paste">
        <input type="url" inputMode="url" placeholder="…or paste an image link" value={paste} onChange={(e) => setPaste(e.target.value)} aria-label={`Add ${label.toLowerCase()} by link`} />
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => { if (/^https?:\/\//.test(paste.trim())) { setUrls((x) => [...x, paste.trim()]); setPaste(""); } }}>Add</button>
      </div>
      {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}
