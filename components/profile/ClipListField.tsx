"use client";

import { upload } from "@vercel/blob/client";
import { useRef, useState } from "react";
import type { MediaClip } from "@/lib/data";
import { mediaOrigin, originLabel } from "@/lib/media";

const limits = {
  video: { folder: "videos", accept: "video/mp4,video/webm,video/quicktime", mb: 150, types: "MP4, WebM or MOV" },
  audio: { folder: "voices", accept: "audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/x-wav,audio/aac,audio/ogg", mb: 100, types: "MP3, M4A or WAV" },
} as const;

const slug = (name: string) => name.toLowerCase().replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "clip";
const ext = (name: string) => name.match(/\.[a-z0-9]+$/i)?.[0].toLowerCase() ?? "";
const titleFromFile = (name: string) => name.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ").trim().slice(0, 120);

/** Showreels or voice clips in order, each with a title. Sent as one hidden JSON field. The first one is the main one. */
export function ClipListField({ name, label, kind, defaultValue = [], folder, hint }: { name: string; label: string; kind: "video" | "audio"; defaultValue?: MediaClip[]; folder: string; hint?: string }) {
  const [clips, setClips] = useState<MediaClip[]>(defaultValue);
  const [paste, setPaste] = useState("");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const L = limits[kind];
  const noun = kind === "video" ? "showreel" : "voice clip";

  const move = (i: number, d: -1 | 1) => setClips((c) => { const n = [...c]; [n[i], n[i + d]] = [n[i + d], n[i]]; return n; });
  const retitle = (i: number, title: string) => setClips((c) => c.map((x, j) => (j === i ? { ...x, title } : x)));

  async function run(files: FileList) {
    setError("");
    try {
      for (const f of Array.from(files)) {
        if (!f.type.startsWith(`${kind}/`)) throw new Error(`Choose a ${kind} file (${L.types}).`);
        if (f.size > L.mb * 1024 * 1024) throw new Error(`${f.name} is over ${L.mb} MB. Trim or compress it, or upload it to YouTube and paste the link.`);
        setBusy(`Uploading ${f.name}…`);
        const blob = await upload(`${L.folder}/${folder}/${slug(f.name)}${ext(f.name)}`, f, { access: "public", handleUploadUrl: "/api/admin/upload", multipart: f.size > 20 * 1024 * 1024 });
        setClips((c) => [...c, { url: blob.url, title: titleFromFile(f.name) || null }]);
      }
    } catch (e) {
      const msg = (e as Error).message;
      setError(/BLOB_READ_WRITE_TOKEN|aren't set up/.test(msg) ? "Uploads aren't set up yet. Paste a YouTube or Vimeo link instead." : msg);
    } finally {
      setBusy("");
      if (file.current) file.current.value = "";
    }
  }

  function addLink() {
    const u = paste.trim();
    if (!/^https?:\/\/\S+$/i.test(u)) { setError("Paste a full link starting with https://"); return; }
    setError("");
    setClips((c) => [...c, { url: u, title: null }]);
    setPaste("");
  }

  return (
    <div className="field">
      <span className="field__label">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(clips.map((c) => ({ url: c.url, title: c.title?.trim() || null })))} />
      {clips.length ? (
        <ol className="clip-list">
          {clips.map((c, i) => (
            <li key={c.url + i}>
              <div className="clip-list__head">
                <span className="clip-list__icon" aria-hidden="true">{kind === "video" ? "▶" : "♪"}</span>
                <input type="text" value={c.title ?? ""} onChange={(e) => retitle(i, e.target.value)} placeholder={`Title, e.g. ${kind === "video" ? "Drama reel 2025" : "Radio ad, Swahili"}`} maxLength={120} aria-label={`Title of ${noun} ${i + 1}`} />
                <div className="img-list__tools">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} aria-label={`Move ${noun} ${i + 1} up`}>↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === clips.length - 1} aria-label={`Move ${noun} ${i + 1} down`}>↓</button>
                  <button type="button" onClick={() => setClips((x) => x.filter((_, j) => j !== i))} aria-label={`Remove ${noun} ${i + 1}`}>✕</button>
                </div>
              </div>
              <p className="clip-list__meta">
                {i === 0 ? <span className="img-list__main">Main</span> : null}
                <span className={`origin origin--${mediaOrigin(c.url)}`}>{originLabel[mediaOrigin(c.url)]}</span>
                <a href={c.url} target="_blank" rel="noopener">Open<span className="sr-only"> {noun} {i + 1} (new tab)</span></a>
              </p>
            </li>
          ))}
        </ol>
      ) : <p className="hint">No {noun}s yet.</p>}
      <div className="btn-row">
        <button type="button" className="btn btn--ink btn--sm" onClick={() => file.current?.click()} disabled={Boolean(busy)}>{busy ? "Uploading…" : `Upload ${noun}`}</button>
      </div>
      <input ref={file} type="file" accept={L.accept} multiple hidden onChange={(e) => e.target.files?.length && run(e.target.files)} />
      <div className="img-field__paste">
        <input type="url" inputMode="url" placeholder={kind === "video" ? "…or paste a YouTube or Vimeo link" : "…or paste a link to the clip"} value={paste} onChange={(e) => setPaste(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addLink(); } }} aria-label={`Add a ${noun} by link`} />
        <button type="button" className="btn btn--ghost btn--sm" onClick={addLink}>Add</button>
      </div>
      {busy ? <p className="hint" role="status">{busy}</p> : null}
      {error ? <p className="field-error" role="alert">{error}</p> : <p className="hint">{hint ?? `${L.types}, up to ${L.mb} MB each.`} The first one is your main {noun}.</p>}
    </div>
  );
}
