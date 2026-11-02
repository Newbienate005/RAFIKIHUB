import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { notifyTeam } from "@/lib/api";
import type { TalentProfile } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, memberDocuments, talentProfiles } from "@/lib/db/schema";
import { MAX_DOCUMENT_BYTES, documentGroup, documentKinds, sniffDocument } from "@/lib/document-rules";
import { failures, recordFailure } from "@/lib/rate-limit";
import { fromThisSite } from "@/lib/same-site";
import { getSession } from "@/lib/session";

const fail = (error: string, status = 400) => NextResponse.json({ ok: false, error }, { status });

/** A young performer's parent or guardian, or a pet's owner, uploads a private document for the team to check. */
export async function POST(req: Request) {
  if (!fromThisSite(req)) return fail("This form has to be sent from rafikihub.com. Reload the page and try again.", 403);
  const s = await getSession();
  if (!s || s.kind !== "member" || !s.accountId) return fail("Log in to your account to upload documents.", 401);
  const db = getDb();
  if (!db) return fail("Uploads aren't available right now. Try again soon.", 503);

  const [me] = await db
    .select({ name: accounts.name, email: accounts.email, category: accounts.category, status: accounts.status, profileCategory: talentProfiles.category, data: talentProfiles.data })
    .from(accounts)
    .leftJoin(talentProfiles, eq(talentProfiles.profileUrl, accounts.profileUrl))
    .where(eq(accounts.id, s.accountId))
    .limit(1);
  if (!me || me.status === "blocked") return fail("Your account can't upload documents. Email info@rafikihub.com.", 403);
  const group = documentGroup({ category: me.profileCategory || me.category, dateOfBirth: (me.data as TalentProfile | null)?.personalData?.dateOfBirth });
  if (!group) return fail("Documents are only needed for young performers and pets.");

  const form = await req.formData().catch(() => null);
  const kind = String(form?.get("kind") ?? "");
  const kindInfo = documentKinds[group].find((k) => k.id === kind);
  if (!kindInfo) return fail("Choose which document this is.");
  const file = form?.get("file");
  if (!(file instanceof File) || file.size === 0) return fail("Choose a file to upload.");
  if (file.size > MAX_DOCUMENT_BYTES) return fail("That file is over 4 MB. Take a smaller photo, or scan it at a lower resolution.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniffDocument(bytes);
  if (!mime) return fail("Upload a PDF or a photo (JPG, PNG or WebP).");

  // Enough for a family re-sending a few blurry scans, not enough to fill the database
  const limitKey = `docs:${s.accountId}`;
  if ((await failures(db, limitKey, 60 * 60).catch(() => 0)) >= 20) return fail("You've uploaded a lot in the last hour. Wait a while, or email info@rafikihub.com.", 429);
  await recordFailure(db, limitKey, 60 * 60).catch(() => {});

  const fileName = file.name.replace(/[^\w.\- ]+/g, "_").slice(0, 200) || "document";
  await db.insert(memberDocuments).values({
    accountId: s.accountId, kind, fileName, mime, size: bytes.length,
    data: sql`decode(${Buffer.from(bytes).toString("base64")}, 'base64')` as unknown as string,
  });
  // The team alert names the member and the document, never the file itself
  notifyTeam(new Request(new URL("/api/documents", req.url)), { Member: me.name, Email: me.email, Document: kindInfo.label });
  return NextResponse.json({ ok: true });
}
