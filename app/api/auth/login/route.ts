import { NextResponse } from "next/server";
import { MASTER_DAYS, SESSION_COOKIE, checkMasterPassword, cookieOptions, encodeSession } from "@/lib/session";

/**
 * Master login: one password (MASTER_PASSWORD) that opens every dashboard.
 * Takes JSON from LoginForm, or a plain form post if the form is submitted before its script loads.
 */
export async function POST(req: Request) {
  const isForm = !(req.headers.get("content-type") ?? "").includes("application/json");
  // Form posts get redirects (303 so the browser follows with GET); fetch calls get JSON.
  const fail = (error: string, status: number) =>
    isForm ? NextResponse.redirect(new URL("/login?error=1", req.url), 303) : NextResponse.json({ ok: false, error }, { status });

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
  const res = isForm ? NextResponse.redirect(new URL("/dashboard", req.url), 303) : NextResponse.json({ ok: true, redirect: "/dashboard" });
  res.cookies.set(SESSION_COOKIE, encodeSession({ kind: "master" }, MASTER_DAYS)!, cookieOptions(MASTER_DAYS));
  return res;
}
