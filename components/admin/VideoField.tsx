"use client";

import { upload } from "@vercel/blob/client";
import { useId, useRef, useState } from "react";
import { uploadName } from "@/lib/upload-name";

const MB = 150;

/** One video file: upload, paste a link, or remove. The value is sent as a hidden field. */
export function VideoField({ name, label, defaultValue, folder = "site", hint }: { name: string; label: string; defaultValue?: string; folder?: string; hint?: string }) {
  const id = useId();
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);

  async function run(f: File) {
    setError("");
    try {
      if (!f.type.startsWith("video/")) throw new Error("Choose a video file (MP4, WebM or MOV).");
      if (f.size > MB * 1024 * 1024) throw new Error(`That video is over ${MB} MB. Compress it, or put it on YouTube and paste the link above.`);
      setBusy(true);
      const blob = await upload(`videos/${folder}/${uploadName(f.name, "video", ".mp4")}`, f, { access: "public", handleUploadUrl: "/api/admin/upload", multipart: f.size > 20 * 1024 * 1024 });
      setUrl(blob.url);
    } catch (e) {
      const msg = (e as Error).message;
      setError(/BLOB_READ_WRITE_TOKEN|aren't set up/.test(msg) ? "Uploads aren't set up yet. Paste a link to the video instead." : msg);
    } finally {
      setBusy(false);
      if (file.current) file.current.value = "";
    }
  }

  return (
    <div className="field">
      <label htmlFor={id}>{label} <span className="optional">(optional)</span></label>
      <input type="hidden" name={name} value={url} />
      <div className="img-field">
        <div className="img-field__preview">
          {url ? <video src={url} preload="metadata" muted playsInline /> : <span>No file</span>}
        </div>
        <div className="img-field__controls">
          <div className="btn-row">
            <button type="button" className="btn btn--ink btn--sm" onClick={() => file.current?.click()} disabled={busy}>{busy ? "Uploading…" : url ? "Replace" : "Upload"}</button>
            {url ? <button type="button" className="btn btn--ghost btn--sm" onClick={() => setUrl("")}>Remove</button> : null}
          </div>
          <input ref={file} type="file" accept="video/mp4,video/webm,video/quicktime" hidden onChange={(e) => e.target.files?.[0] && run(e.target.files[0])} />
          <input id={id} className="img-field__url" type="url" inputMode="url" placeholder="…or paste a link to the video file" value={url} onChange={(e) => setUrl(e.target.value.trim())} />
          {error ? <p className="field-error" role="alert">{error}</p> : hint ? <p className="hint">{hint}</p> : null}
        </div>
      </div>
    </div>
  );
}
