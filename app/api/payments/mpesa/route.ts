import { randomBytes } from "node:crypto";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { plans } from "@/lib/data";
import { getDb } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { mpesaPhone } from "@/lib/mpesa-utils";
import { failures, recordFailure } from "@/lib/rate-limit";
import { fromThisSite } from "@/lib/same-site";
import { getSession } from "@/lib/session";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/**
 * Starts an M-Pesa payment for a membership plan: Pesawise sends an STK push (the PIN prompt) to the phone.
 * The price always comes from our own plan list, never from the browser. The plan only becomes active when
 * Pesawise confirms the payment (app/api/payments/pesawise).
 */
export async function POST(req: Request) {
  if (!fromThisSite(req)) return fail("This form has to be sent from rafikihub.com. Reload the page and try again.", 403);
  const s = await getSession();
  if (!s || s.kind !== "member" || !s.accountId) return fail("Log in to your account to pay for a membership.", 401);
  const key = process.env.PESAWISE_API_KEY, secret = process.env.PESAWISE_API_SECRET, balance = Number(process.env.PESAWISE_BALANCE_ID);
  if (!key || !secret || !Number.isInteger(balance)) return fail("M-Pesa payments aren't switched on yet. Email info@rafikihub.com to pay another way.", 503);
  const db = getDb();
  if (!db) return fail("Payments aren't available right now. Try again soon.", 503);

  const body = (await req.json().catch(() => null)) as { plan?: unknown; phone?: unknown } | null;
  const plan = plans.find((p) => p.id === body?.plan);
  if (!plan) return fail("Choose a plan.");
  const phone = mpesaPhone(typeof body?.phone === "string" ? body.phone : "");
  if (!phone) return fail("Enter the Safaricom number to charge, e.g. 0712 345 678.");

  // A few tries an hour per account: enough to retry a missed prompt, not enough to spam someone's phone
  const limitKey = `mpesa:${s.accountId}`;
  if ((await failures(db, limitKey, 60 * 60).catch(() => 0)) >= 5) return fail("You've started several payments in the last hour. Wait a while, or email info@rafikihub.com.", 429);
  await recordFailure(db, limitKey, 60 * 60).catch(() => {});

  const reference = `RH${s.accountId}${randomBytes(4).toString("hex").toUpperCase()}`;
  const [row] = await db
    .insert(payments)
    .values({ accountId: s.accountId, planId: plan.id, amountKsh: plan.priceKsh, phone, provider: "mpesa", reference, status: "pending" })
    .returning({ id: payments.id });

  let requestId: string | undefined;
  try {
    const res = await fetch("https://api.pesawise.com/api/payments/stk-push", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "api-key": key, "api-secret": secret },
      body: JSON.stringify({ balanceId: balance, amount: plan.priceKsh, phoneNumber: phone, reference }),
      signal: AbortSignal.timeout(20_000),
    });
    const json = (await res.json().catch(() => null)) as { requestId?: unknown } | null;
    if (res.ok && json?.requestId != null) requestId = String(json.requestId);
    else console.error("[mpesa] Pesawise refused the STK push", res.status);
  } catch (e) {
    console.error("[mpesa] couldn't reach Pesawise", e);
  }
  if (!requestId) {
    await db.update(payments).set({ status: "rejected" }).where(eq(payments.id, row.id));
    return fail("M-Pesa didn't accept the request. Check the number and try again in a minute.", 502);
  }
  await db.update(payments).set({ providerRef: requestId }).where(eq(payments.id, row.id));
  return NextResponse.json({ ok: true, reference, amount: plan.priceKsh });
}

/** The status of one of the signed-in member's own payments, polled by the pay form while they enter their PIN. */
export async function GET(req: Request) {
  const s = await getSession();
  if (!s || s.kind !== "member" || !s.accountId) return fail("Log in first.", 401);
  const reference = new URL(req.url).searchParams.get("ref") ?? "";
  const db = getDb();
  if (!db || !reference) return fail("Unknown payment.", 404);
  const [p] = await db
    .select({ status: payments.status })
    .from(payments)
    .where(and(eq(payments.reference, reference), eq(payments.accountId, s.accountId)))
    .limit(1);
  return p ? NextResponse.json({ ok: true, status: p.status }) : fail("Unknown payment.", 404);
}
