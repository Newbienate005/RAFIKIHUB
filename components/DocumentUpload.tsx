"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

/** Upload one private document (young performers' and pets' paperwork). The server checks the file again. */
export function DocumentUpload({ kinds }: { kinds: readonly { id: string; label: string }[] }) {
  const router = useRouter();
  const [state, setState] = useState<{ busy: boolean; error?: string; done?: boolean }>({ busy: false });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState({ busy: true });
    const res = await fetch("/api/documents", { method: "POST", body: new FormData(form) }).catch(() => null);
    const json = res ? await res.json().catch(() => ({ ok: false, error: "Something went wrong. Try again." })) : { ok: false, error: "You appear to be offline." };
    if (!json.ok) return setState({ busy: false, error: json.error });
    form.reset();
    setState({ busy: false, done: true });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="doc-upload">
      <div className="field">
        <label htmlFor="doc-kind">Document</label>
        <select id="doc-kind" name="kind" required defaultValue="">
          <option value="" disabled>Choose one</option>
          {kinds.map((k) => <option key={k.id} value={k.id}>{k.label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="doc-file">File</label>
        <input id="doc-file" name="file" type="file" required accept="application/pdf,image/jpeg,image/png,image/webp" />
        <p className="hint">A PDF or a clear photo, up to 4 MB. Only you and the RafikiHub team can see it.</p>
      </div>
      {state.error ? <p className="form-error" role="alert">{state.error}</p> : null}
      {state.done ? <p className="form-success" role="status">Uploaded. The team will check it, and you&apos;ll see the result here.</p> : null}
      <button type="submit" className="btn btn--sun btn--sm" disabled={state.busy}>{state.busy ? "Uploading…" : "Upload"}</button>
    </form>
  );
}
