import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { getDb } from "@/lib/db";
import { MEMBER_DAYS, SESSION_COOKIE, cookieOptions, decodeSession, encodeSession, type NewSession } from "@/lib/session";

type Db = NonNullable<ReturnType<typeof getDb>>;

type SignIn = { redirect: string; session: NewSession };

/** A success response; when `signIn` is given (and sessions are enabled) it also signs the person in and sends them on. */
function success(req: Request, signIn?: SignIn) {
  if (!signIn) return NextResponse.json({ ok: true });
  // Already signed in with the master login (e.g. testing the form): keep that session, just open the dashboard
  const current = req.headers.get("cookie")?.match(new RegExp(`(?:^|; )${SESSION_COOKIE}=([^;]+)`))?.[1];
  if (decodeSession(current)?.kind === "master") return NextResponse.json({ ok: true, redirect: signIn.redirect });
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
  if (!db) {
    console.warn("[forms] DATABASE_URL is not set. Submission not saved:", data);
    return NextResponse.json(
      { ok: false, error: "The database isn't connected yet. Email info@rafikihub.com and we'll help directly." },
      { status: 503 },
    );
  }
  try {
    await save(db, data);
    return success(req, signIn?.(data));
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "23505") return success(req, signIn?.(data)); // already saved (e.g. already subscribed)
    console.error("[forms] save failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save that just now. Try again in a minute, or email info@rafikihub.com." },
      { status: 500 },
    );
  }
}
