import { after, NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { getDb } from "@/lib/db";
import { appUrl } from "@/lib/app-url";
import { emailConfigured, noticeEmail, sendEmail, submissionEmail } from "@/lib/email";
import { clientIp, failures, recordFailure } from "@/lib/rate-limit";
import { fromThisSite } from "@/lib/same-site";
import { site } from "@/lib/site";
import { MEMBER_DAYS, SESSION_COOKIE, cookieOptions, encodeSession, type NewSession } from "@/lib/session";

type Db = NonNullable<ReturnType<typeof getDb>>;

/** Forms the team hears about by email, by API path. Newsletter sign-ups are left out: too many, nothing to act on. */
const notifyFor: Record<string, string> = {
  join: "membership application",
  casting: "casting request",
  contact: "contact message",
  booking: "booking request",
  "location-request": "location request",
};

/** After the response is sent: email the team, and log loudly if that fails. */
export function notifyTeam(req: Request, data: Record<string, unknown>) {
  const form = notifyFor[new URL(req.url).pathname.split("/").pop() ?? ""];
  if (!form) return;
  if (!emailConfigured()) {
    if (process.env.NODE_ENV === "production") console.error(`[forms] No email service is set up (ELASTIC_EMAIL_API_KEY), so nobody was told about a new ${form}.`);
    return;
  }
  const to = process.env.NOTIFY_EMAIL || site.email;
  after(() => sendEmail({ to, ...submissionEmail(form, data, `${appUrl(req)}/admin`) }).catch((e) => console.error(`[forms] couldn't email the team about a new ${form}`, e)));
}

/** What the person who sent each form is told, so they know it arrived (the old site sent these too). */
const confirmations: Record<string, (d: Record<string, unknown>) => { subject: string; paragraphs: string[] }> = {
  contact: () => ({
    subject: "We got your message",
    paragraphs: ["Thanks for getting in touch with RafikiHub. Your message has reached the team and we'll reply by email, usually within two working days."],
  }),
  booking: (d) => ({
    subject: "Booking received",
    paragraphs: [
      `Thanks for booking ${String(d.service ?? "a Sio Bahati service").replace(/-/g, " ")} with RafikiHub.${d.preferredDate ? ` You asked for ${String(d.preferredDate)}.` : ""}`,
      "We'll call or email you to confirm the date, time and price. Nothing is charged until then.",
    ],
  }),
  "location-request": (d) => ({
    subject: "Location request received",
    paragraphs: [
      `Thanks for your location request${d.locationType ? ` (${String(d.locationType).toLowerCase()})` : ""}. Our locations team will send you options and next steps by email.`,
    ],
  }),
  casting: (d) => ({
    subject: "Casting request received",
    paragraphs: [
      `Thanks for sending us${d.projectTitle ? ` "${String(d.projectTitle)}"` : " your casting"}. The team reviews every breakdown before it goes out to agents and performers, and will be in touch if anything's missing.`,
      "You can follow your castings and the applications they get from your dashboard.",
    ],
  }),
};

/** After the response is sent: a short "we got it" email to whoever filled the form in. Never blocks or fails the form. */
function confirmToSender(req: Request, data: Record<string, unknown>) {
  const form = new URL(req.url).pathname.split("/").pop() ?? "";
  const make = confirmations[form];
  const to = typeof data.email === "string" ? data.email : "";
  if (!make || !to || !emailConfigured()) return;
  const name = String(data.fullName ?? data.contactName ?? data.organization ?? "");
  after(() => sendEmail({ to, ...noticeEmail({ name, ...make(data) }) }).catch((e) => console.error(`[forms] couldn't send the ${form} confirmation`, e)));
}

type SignIn = { redirect: string; session: NewSession };

/** A success response; when `signIn` is given (and sessions are enabled) it also signs the person in and sends them on. */
function success(req: Request, signIn?: SignIn) {
  if (!signIn) return NextResponse.json({ ok: true });
  // Whoever just applied gets their own fresh dashboard, even if the master login was open in this browser
  const token = encodeSession(signIn.session, MEMBER_DAYS);
  if (!token) return NextResponse.json({ ok: true });
  const res = NextResponse.json({ ok: true, redirect: signIn.redirect });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions(MEMBER_DAYS));
  return res;
}

/**
 * Shared handler: validate → spam check → save → respond with JSON the forms understand.
 * `signIn` optionally turns a saved submission into a dashboard session (join and casting forms).
 */
export async function handleForm<T extends { website?: string }>(
  req: Request,
  schema: ZodSchema<T>,
  save: (db: Db, data: Omit<T, "website">) => Promise<unknown>,
  signIn?: (data: Omit<T, "website">) => SignIn,
) {
  if (!fromThisSite(req)) return NextResponse.json({ ok: false, error: "This form has to be sent from rafikihub.com. Reload the page and try again." }, { status: 403 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten().fieldErrors as Record<string, string[] | undefined>;
    const fields = Object.fromEntries(Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? ""]));
    return NextResponse.json({ ok: false, error: "Some fields need attention.", fields }, { status: 400 });
  }
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot filled the hidden field

  const db = getDb();
  // Up to 10 of each form an hour from one address: plenty for people, a wall for scripts
  const limitKey = `form:${new URL(req.url).pathname}:${clientIp(req)}`;
  if (db && (await failures(db, limitKey, 60 * 60).catch(() => 0)) >= 10) {
    return NextResponse.json({ ok: false, error: "You've sent this form a lot in the last hour. Wait a while, or email info@rafikihub.com." }, { status: 429 });
  }
  if (!db) {
    // No names or emails in the logs
    console.warn(`[forms] DATABASE_URL is not set, so a ${new URL(req.url).pathname} submission wasn't saved.`);
    return NextResponse.json(
      { ok: false, error: "The database isn't connected yet. Email info@rafikihub.com and we'll help directly." },
      { status: 503 },
    );
  }
  try {
    await save(db, data);
    await recordFailure(db, limitKey, 60 * 60).catch((e) => console.error("[forms] couldn't count a submission", e));
    notifyTeam(req, data);
    confirmToSender(req, data);
    return success(req, signIn?.(data));
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    // Already on file (e.g. already subscribed): fine, but no sign-in, since nothing proves this person owns that email
    if (code === "23505") return success(req);
    console.error("[forms] save failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save that just now. Try again in a minute, or email info@rafikihub.com." },
      { status: 500 },
    );
  }
}
