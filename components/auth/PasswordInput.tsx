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
        {shown ? "Hide" : "Show"}
      </button>
    </div>
  );
}
