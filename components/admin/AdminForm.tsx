"use client";

import { useActionState, useEffect, useRef, useTransition, type ReactNode } from "react";

export type FormState = { ok?: boolean; message?: string; errors?: Record<string, string> };

/**
 * Wraps an admin form around a server action. Submits without React's automatic form reset, so
 * nothing typed is lost when validation fails; lists the problems and highlights each field.
 */
export function AdminForm({
  action,
  children,
  submitLabel = "Save",
  labels = {},
  className = "admin-form",
}: {
  action: (prev: FormState, form: FormData) => Promise<FormState>;
  children: ReactNode;
  submitLabel?: string;
  /** Field name → label, for the error summary */
  labels?: Record<string, string>;
  className?: string;
}) {
  const [state, formAction] = useActionState(action, {});
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLFormElement>(null);
  const summary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const form = ref.current;
    if (!form) return;
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
    for (const name of Object.keys(state.errors ?? {})) {
      form.querySelectorAll(`[name="${CSS.escape(name)}"]`).forEach((el) => el.setAttribute("aria-invalid", "true"));
    }
    if (state.message) summary.current?.focus();
  }, [state]);

  const errors = Object.entries(state.errors ?? {});
  return (
    <form
      ref={ref}
      className={className}
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
    >
      {state.message ? (
        <div ref={summary} tabIndex={-1} className={state.ok ? "form-success" : "admin-errors"} role={state.ok ? "status" : "alert"}>
          <p>{state.message}</p>
          {errors.length ? <ul>{errors.map(([k, v]) => <li key={k}><strong>{labels[k] ?? k}:</strong> {v}</li>)}</ul> : null}
        </div>
      ) : null}
      {children}
      <div className="admin-form__bar">
        <button type="submit" className="btn btn--sun" disabled={pending}>{pending ? "Saving…" : submitLabel}</button>
      </div>
    </form>
  );
}

/** A button that asks before doing something that can't be undone. */
export function ConfirmButton({ action, children, message, className = "btn btn--ghost btn--sm" }: { action: () => Promise<void>; children: ReactNode; message: string; className?: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button type="button" className={className} disabled={pending} onClick={() => { if (window.confirm(message)) startTransition(() => action()); }}>
      {pending ? "Working…" : children}
    </button>
  );
}

/** A small button that runs a server action (move up, hide, publish…). */
export function ActionButton({ action, children, className = "btn btn--ink btn--sm", label }: { action: () => Promise<void>; children: ReactNode; className?: string; label?: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <button type="button" className={className} disabled={pending} aria-label={label} onClick={() => startTransition(() => action())}>
      {children}
    </button>
  );
}
