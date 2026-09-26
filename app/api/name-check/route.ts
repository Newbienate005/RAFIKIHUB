import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { members, talentProfiles } from "@/lib/db/schema";
import { nameCheckSchema } from "@/lib/validation";

/** Stage Name Checker: is this name already used by a RafikiHub profile or application? */
export async function POST(req: Request) {
  const parsed = nameCheckSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Enter a name." }, { status: 400 });
  }
  const db = getDb();
  if (!db) return NextResponse.json({ ok: false, error: "The name checker isn't connected yet. Try again soon." }, { status: 503 });

  const name = parsed.data.name.toLowerCase().replace(/\s+/g, " ");
  const norm = (col: unknown) => sql`lower(regexp_replace(trim(${col}), '\\s+', ' ', 'g'))`;
  const [profile] = await db.select({ n: talentProfiles.profileUrl }).from(talentProfiles).where(sql`${norm(talentProfiles.fullName)} = ${name}`).limit(1);
  const [member] = profile ? [] : await db.select({ n: members.id }).from(members).where(sql`${norm(members.fullName)} = ${name}`).limit(1);

  return NextResponse.json({ ok: true, available: !profile && !member });
}
