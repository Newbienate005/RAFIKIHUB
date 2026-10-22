"use client";

import { useState, type InputHTMLAttributes } from "react";

/**
 * A password input with a Show / Hide button, so people can check what they typed (especially on
 * phones). The button sits inside the field, doesn't submit the form, and keeps the caret in place.
 */
export function PasswordInput(props: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { id: string }) {
  const [shown, setShown] = useState(false);
  return (
    <div className="password">
      <input {...props} type={shown ? "text" : "password"} autoCapitalize="none" autoCorrect="off" spellCheck={false} />
      <button
        type="button"
        className="password__toggle"
        aria-controls={props.id}
        aria-pressed={shown}
        aria-label={shown ? "Hide password" : "Show password"}
        // Keep focus (and the caret) in the input while toggling
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setShown((s) => !s)}
      >
        <EyeIcon closed={shown} />
      </button>
    </div>
  );
}

/**
 * An eye drawn like Maasai beadwork: the iris is a beaded disc (the same rings as the hero's bead) and the
 * lashes are a row of beads. While the password is showing, a stroke crosses it out (the usual "hide" sign).
 */
function EyeIcon({ closed }: { closed: boolean }) {
  return (
    <svg className="password__eye" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <path d="M2.5 13c2.6-3.6 5.8-5.4 9.5-5.4s6.9 1.8 9.5 5.4c-2.6 3.6-5.8 5.4-9.5 5.4S5.1 16.6 2.5 13Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.4" fill="var(--accent)" />
      <circle cx="12" cy="13" r="2" fill="none" stroke="#121212" strokeWidth="0.9" />
      <circle cx="12" cy="13" r="0.8" fill="#121212" />
      <circle cx="7" cy="4.6" r="1.1" fill="var(--accent)" />
      <circle cx="12" cy="3.6" r="1.1" fill="currentColor" />
      <circle cx="17" cy="4.6" r="1.1" fill="var(--accent)" />
      {closed ? (
        <>
          {/* a dark gap under the stroke so it reads cleanly over the eye */}
          <path d="M4 21 20 5" stroke="var(--surface-2, #181818)" strokeWidth="4" strokeLinecap="round" />
          <path d="M4 21 20 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      ) : null}
    </svg>
  );
}
