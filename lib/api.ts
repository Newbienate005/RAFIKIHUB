import { NextResponse } from "next/server";
import type { ZodSchema } from "zod";
import { getDb } from "@/lib/db";

type Db = NonNullable<ReturnType<typeof getDb>>;

/** Shared handler: validate → spam check → save → respond with JSON the forms understand. */
export async function handleForm<T extends { website?: string }>(
  req: Request,
  schema: ZodSchema<T>,
  save: (db: Db, data: Omit<T, "website">) => Promise<unknown>,
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
    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code;
    if (code === "23505") return NextResponse.json({ ok: true }); // already subscribed
    console.error("[forms] save failed", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save that just now. Try again in a minute, or email info@rafikihub.com." },
      { status: 500 },
    );
  }
}
