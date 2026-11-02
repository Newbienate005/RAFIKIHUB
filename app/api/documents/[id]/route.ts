import { eq, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { memberDocuments } from "@/lib/db/schema";
import { getSession } from "@/lib/session";

/** Downloads one private document: only its own member or the admin, never cached, always as a download. */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  const s = await getSession();
  const db = getDb();
  if (!s || !db || !Number.isInteger(id)) return new Response("Not found", { status: 404 });
  const [d] = await db
    .select({ accountId: memberDocuments.accountId, fileName: memberDocuments.fileName, mime: memberDocuments.mime, b64: sql<string>`encode(${memberDocuments.data}, 'base64')` })
    .from(memberDocuments)
    .where(eq(memberDocuments.id, id))
    .limit(1);
  // The same answer for "no such document" and "not yours", so ids can't be probed
  if (!d || !(s.kind === "master" || (s.kind === "member" && s.accountId === d.accountId))) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(d.b64, "base64"), {
    headers: {
      "Content-Type": d.mime,
      "Content-Disposition": `attachment; filename="${d.fileName.replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
