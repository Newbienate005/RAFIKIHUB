import { NextResponse } from "next/server";
import { MASTER_DAYS, SESSION_COOKIE, checkMasterPassword, cookieOptions, encodeSession } from "@/lib/session";

/** Master login: one password (MASTER_PASSWORD) that opens every dashboard. */
export async function POST(req: Request) {
  if (!process.env.MASTER_PASSWORD) {
    return NextResponse.json({ ok: false, error: "The master login isn't set up yet. Add MASTER_PASSWORD to the environment variables." }, { status: 503 });
  }
  const body = (await req.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!checkMasterPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.json({ ok: false, error: "That password isn't right." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, redirect: "/dashboard" });
  res.cookies.set(SESSION_COOKIE, encodeSession({ kind: "master" }, MASTER_DAYS)!, cookieOptions(MASTER_DAYS));
  return res;
}
