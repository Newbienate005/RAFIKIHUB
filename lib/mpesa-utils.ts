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
