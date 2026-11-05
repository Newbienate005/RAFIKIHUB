/** Pure helpers for M-Pesa payments (no imports, so they can be unit tested). */

/** A Kenyan mobile number in the 2547XXXXXXXX / 2541XXXXXXXX form M-Pesa expects, or null if it isn't one. */
export function mpesaPhone(input: string): string | null {
  const d = input.replace(/\D/g, "");
  const local = d.startsWith("254") ? d.slice(3) : d.startsWith("0") ? d.slice(1) : d;
  return /^(7|1)\d{8}$/.test(local) ? `254${local}` : null;
}

/** When a plan bought now ends: added to any time still left, so renewing early loses nothing. */
export function extendPlan(currentExpiry: Date | null, months: number, now = new Date()): Date {
  const start = currentExpiry && currentExpiry > now ? new Date(currentExpiry) : new Date(now);
  const end = new Date(start);
  end.setMonth(end.getMonth() + months);
  return end;
}

/**
 * What to do with Pesawise's confirmation of a payment we started and that is still pending:
 * settle it (switch the plan on), mark it rejected, or ignore it and log why. The plan only switches on
 * when Pesawise says it succeeded for exactly the amount we asked, on the same reference.
 */
export function callbackVerdict(
  p: { reference: string | null; amountKsh: number },
  data: { reference?: unknown; success?: unknown; amount?: unknown },
): { action: "settle" } | { action: "reject" } | { action: "ignore"; why: string } {
  if (data.reference != null && String(data.reference) !== p.reference) return { action: "ignore", why: "reference mismatch" };
  if (data.success !== true) return { action: "reject" };
  if (Number(data.amount) !== p.amountKsh) return { action: "ignore", why: `amount mismatch: expected ${p.amountKsh}, got ${String(data.amount)}` };
  return { action: "settle" };
}
