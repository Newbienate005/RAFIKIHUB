import { NextResponse } from "next/server";
import { inboxCsv, isInboxKey } from "@/lib/admin/inbox";
import { getSession } from "@/lib/session";

/** CSV download of one inbox. Master login only. */
export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  if ((await getSession())?.kind !== "master") return NextResponse.json({ error: "Sign in to the admin." }, { status: 401 });
  const { type } = await params;
  if (!isInboxKey(type)) return NextResponse.json({ error: "Unknown inbox." }, { status: 404 });
  const csv = await inboxCsv(type);
  if (csv === null) return NextResponse.json({ error: "The database isn't connected." }, { status: 503 });
  const day = new Date().toISOString().slice(0, 10);
  return new Response(`﻿${csv}`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="rafikihub-${type}-${day}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
