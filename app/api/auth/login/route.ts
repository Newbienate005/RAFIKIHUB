import { NextResponse } from "next/server";
import { MASTER_DAYS, SESSION_COOKIE, checkMasterPassword, cookieOptions, encodeSession, sessionsEnabled } from "@/lib/session";

/** Where to go after signing in: only a path on this site, never another host. */
function landingPath(next: string | null, base: string) {
  // Tab, newline and backslash are stripped or rewritten by URL parsers ("/\t/evil.com" becomes "//evil.com"), so refuse them
  if (!next || /[\u0000- \\]/.test(next) || !next.startsWith("/")) return "/admin";
  const from = new URL(base);
  const to = new URL(next, from);
  return to.origin === from.origin ? to.pathname + to.search + to.hash : "/admin";
}

/**
 * Master login: one password (MASTER_PASSWORD) that opens every dashboard.
 * Takes JSON from LoginForm, or a plain form post if the form is submitted before its script loads.
 */
export async function POST(req: Request) {
  const isForm = !(req.headers.get("content-type") ?? "").includes("application/json");
  // Form posts get redirects (303 so the browser follows with GET); fetch calls get JSON.
  const fail = (error: string, status: number) =>
    isForm ? NextResponse.redirect(new URL("/team-login?error=1", req.url), 303) : NextResponse.json({ ok: false, error }, { status });

  if (!sessionsEnabled()) {
    return fail("Sign-in isn't set up yet. Add SESSION_SECRET to the environment variables.", 503);
  }
  if (!process.env.MASTER_PASSWORD) {
    return fail("The master login isn't set up yet. Add MASTER_PASSWORD to the environment variables.", 503);
  }
  const password = isForm
    ? String((await req.formData().catch(() => null))?.get("password") ?? "")
    : await req.json().then((b: { password?: unknown } | null) => (typeof b?.password === "string" ? b.password : ""), () => "");
  if (!checkMasterPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return fail("That password isn't right.", 401);
  }
  // The master login opens the admin; ?next= is only honoured for paths on this site
  const next = new URL(req.headers.get("referer") ?? req.url).searchParams.get("next");
  const dest = landingPath(next, req.url);
  const res = isForm ? NextResponse.redirect(new URL(dest, req.url), 303) : NextResponse.json({ ok: true, redirect: dest });
  res.cookies.set(SESSION_COOKIE, encodeSession({ kind: "master" }, MASTER_DAYS)!, cookieOptions(MASTER_DAYS));
  return res;
}
