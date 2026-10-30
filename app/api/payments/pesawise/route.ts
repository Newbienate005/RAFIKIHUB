import { timingSafeEqual } from "node:crypto";
import { and, eq, sql } from "drizzle-orm";
import { after, NextResponse } from "next/server";
import { configuredAppUrl } from "@/lib/app-url";
import { plans } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, payments } from "@/lib/db/schema";
import { emailConfigured, noticeEmail, sendEmail } from "@/lib/email";
import { extendPlan } from "@/lib/mpesa-utils";

const same = (a: string, b: string) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));

/**
 * Pesawise's payment confirmation (set as the callback URL in Pesawise, with ?token=PESAWISE_WEBHOOK_TOKEN).
 * Accepted only when: the token matches, it names a payment this site started that is still pending,
 * and Pesawise's amount is the amount we asked for. Then the plan is switched on and a receipt is emailed.
 * Ignored calls still get 200 so Pesawise stops retrying them; the reason goes to the logs.
 */
export async function POST(req: Request) {
  const expected = process.env.PESAWISE_WEBHOOK_TOKEN ?? "";
  const given = new URL(req.url).searchParams.get("token") ?? "";
  if (!expected || !same(expected, given)) return NextResponse.json({ ok: false }, { status: 403 });
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false }, { status: 503 });

  const data = (await req.json().catch(() => null)) as { requestId?: unknown; reference?: unknown; success?: unknown; amount?: unknown } | null;
  const requestId = data?.requestId != null ? String(data.requestId) : "";
  if (!requestId) return NextResponse.json({ ok: false }, { status: 400 });

  const [p] = await db.select().from(payments).where(and(eq(payments.providerRef, requestId), eq(payments.status, "pending"))).limit(1);
  if (!p) {
    console.warn(`[pesawise] callback for an unknown or already settled payment: ${requestId}`);
    return NextResponse.json({ ok: true });
  }
  if (data?.reference != null && String(data.reference) !== p.reference) {
    console.warn(`[pesawise] reference mismatch for ${requestId}`);
    return NextResponse.json({ ok: true });
  }
  if (data?.success !== true) {
    await db.update(payments).set({ status: "rejected" }).where(and(eq(payments.id, p.id), eq(payments.status, "pending")));
    return NextResponse.json({ ok: true });
  }
  if (Number(data.amount) !== p.amountKsh) {
    console.warn(`[pesawise] amount mismatch for ${requestId}: expected ${p.amountKsh}, got ${String(data.amount)}`);
    return NextResponse.json({ ok: true });
  }

  const plan = plans.find((x) => x.id === p.planId);
  const [acct] = await db.select({ name: accounts.name, email: accounts.email, planExpiresAt: accounts.planExpiresAt }).from(accounts).where(eq(accounts.id, p.accountId)).limit(1);
  if (!plan || !acct) return NextResponse.json({ ok: true });
  const expires = extendPlan(acct.planExpiresAt, plan.months);
  const paidAt = new Date();
  // One transaction. The account only changes if THIS call moved the payment from pending to paid,
  // so a repeated or simultaneous callback can't add the months twice.
  const [settled] = await db.batch([
    db.update(payments).set({ status: "success", paidAt }).where(and(eq(payments.id, p.id), eq(payments.status, "pending"))).returning({ id: payments.id }),
    db.update(accounts).set({ planId: plan.id, planExpiresAt: expires, status: sql`CASE WHEN ${accounts.status} = 'blocked' THEN ${accounts.status} ELSE 'active' END` }).where(and( // paying never unblocks an account
      eq(accounts.id, p.accountId),
      sql`EXISTS (SELECT 1 FROM ${payments} WHERE ${payments.id} = ${p.id} AND ${payments.status} = 'success' AND ${payments.paidAt} = ${paidAt})`,
    )),
  ]);
  if (!settled.length) return NextResponse.json({ ok: true });

  if (emailConfigured() && acct.email) {
    const until = expires.toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" });
    const receipt = noticeEmail({
      name: acct.name,
      subject: `Payment received: RafikiHub ${plan.name}`,
      paragraphs: [
        `Thank you. We received Ksh ${p.amountKsh.toLocaleString("en-KE")} by M-Pesa for the ${plan.name} plan (${plan.label}).`,
        `Your membership is active until ${until}. Reference: ${p.reference}.`,
      ],
      button: { label: "Open my dashboard", href: `${configuredAppUrl()}/dashboard` },
    });
    after(() => sendEmail({ to: acct.email, ...receipt }).catch((e) => console.error("[pesawise] couldn't send the receipt", e)));
  }
  return NextResponse.json({ ok: true });
}
