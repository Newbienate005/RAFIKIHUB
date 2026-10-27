"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Plan } from "@/lib/data";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "waiting"; ref: string; amount: number } | { kind: "paid" } | { kind: "failed"; message: string };

/**
 * Pay for a membership plan with M-Pesa: pick a plan, confirm the number, then approve the PIN prompt on the phone.
 * The form checks every few seconds until Pesawise confirms; the plan switches on from that confirmation.
 */
export function MpesaPay({ plans, current, expiresOn, phone }: { plans: Plan[]; current?: string | null; expiresOn?: string | null; phone?: string | null }) {
  const [plan, setPlan] = useState(current && plans.some((p) => p.id === current) ? current : plans[1]?.id ?? plans[0].id);
  const [state, setState] = useState<State>({ kind: "idle" });
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stop = () => { if (timer.current) clearInterval(timer.current); timer.current = null; };
  useEffect(() => stop, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const number = String(new FormData(e.currentTarget).get("phone") ?? "");
    setState({ kind: "sending" });
    try {
      const res = await fetch("/api/payments/mpesa", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan, phone: number }) });
      const json = await res.json().catch(() => ({ ok: false, error: "Something went wrong. Try again." }));
      if (!json.ok) return setState({ kind: "failed", message: json.error });
      setState({ kind: "waiting", ref: json.reference, amount: json.amount });
      const started = Date.now();
      stop();
      timer.current = setInterval(async () => {
        const r = await fetch(`/api/payments/mpesa?ref=${encodeURIComponent(json.reference)}`).then((x) => x.json()).catch(() => null);
        if (r?.status === "success") { stop(); setState({ kind: "paid" }); }
        else if (r?.status === "rejected") { stop(); setState({ kind: "failed", message: "The payment was cancelled or didn't go through. You haven't been charged; try again." }); }
        else if (Date.now() - started > 3 * 60 * 1000) { stop(); setState({ kind: "failed", message: "We haven't heard back from M-Pesa yet. If you paid, your plan will switch on shortly and you'll get a receipt by email." }); }
      }, 4000);
    } catch {
      setState({ kind: "failed", message: "You appear to be offline. Check your connection and try again." });
    }
  }

  if (state.kind === "paid") {
    return (
      <section className="panel mpesa" aria-live="polite">
        <h2>Payment received</h2>
        <p>Your membership is active. A receipt is on its way to your email.</p>
        <a className="btn btn--sun btn--sm" href="">Refresh my dashboard</a>
      </section>
    );
  }

  const chosen = plans.find((p) => p.id === plan)!;
  return (
    <section className="panel mpesa" aria-labelledby="mpesa-title">
      <h2 id="mpesa-title">{current ? "Renew or change your plan" : "Choose your membership"}</h2>
      {expiresOn ? <p className="small">Your plan runs until {expiresOn}. Paying now adds to the time you have left.</p> : null}
      <form onSubmit={onSubmit} className="mpesa__form">
        <fieldset className="mpesa__plans">
          <legend className="sr-only">Plan</legend>
          {plans.map((p) => (
            <label key={p.id} className={`mpesa__plan${p.id === plan ? " is-picked" : ""}`}>
              <input type="radio" name="plan" value={p.id} checked={p.id === plan} onChange={() => setPlan(p.id)} />
              <span className="mpesa__name">{p.name}</span>
              <span className="mpesa__price">Ksh {p.priceKsh.toLocaleString("en-KE")}</span>
              <span className="small">{p.label}</span>
            </label>
          ))}
        </fieldset>
        <div className="field">
          <label htmlFor="mpesa-phone">M-Pesa number</label>
          <input id="mpesa-phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required defaultValue={phone ?? ""} placeholder="0712 345 678" />
          <p className="hint">You&apos;ll get a prompt on this phone to enter your M-Pesa PIN.</p>
        </div>
        {state.kind === "failed" ? <p className="form-error" role="alert">{state.message}</p> : null}
        {state.kind === "waiting" ? (
          <p className="form-success" role="status">Check your phone: approve Ksh {state.amount.toLocaleString("en-KE")} by entering your M-Pesa PIN. This page updates by itself.</p>
        ) : null}
        <button type="submit" className="btn btn--sun" disabled={state.kind === "sending" || state.kind === "waiting"}>
          {state.kind === "sending" ? "Sending…" : state.kind === "waiting" ? "Waiting for your PIN…" : `Pay Ksh ${chosen.priceKsh.toLocaleString("en-KE")} with M-Pesa`}
        </button>
      </form>
    </section>
  );
}
