import { desc, eq, sql } from "drizzle-orm";
import { AdminHeader, NoDatabase } from "@/components/admin/ui";
import { getDb } from "@/lib/db";
import { accounts, memberDocuments } from "@/lib/db/schema";
import { documentKinds } from "@/lib/document-rules";
import { requireMaster } from "@/lib/session";
import { reviewDocument } from "./actions";

const labelOf = (kind: string) => [...documentKinds.young, ...documentKinds.pet].find((k) => k.id === kind)?.label ?? kind;
const size = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.round(n / 1024)} KB`);

/** Young performers' and pets' private documents, waiting ones first. Files open only through /api/documents. */
export default async function DocumentsPage() {
  await requireMaster(); // the layout checks too, but a request can skip the layout
  const header = <AdminHeader title="Member documents" description="Birth certificates, guardian IDs and consent for young performers; ownership and vaccination records for pets. Private: only the member and the team can open them." />;
  const db = getDb();
  if (!db) return <>{header}<NoDatabase /></>;
  const rows = await db
    .select({ id: memberDocuments.id, kind: memberDocuments.kind, fileName: memberDocuments.fileName, size: memberDocuments.size, status: memberDocuments.status, note: memberDocuments.note, createdAt: memberDocuments.createdAt, name: accounts.name, email: accounts.email })
    .from(memberDocuments)
    .innerJoin(accounts, eq(accounts.id, memberDocuments.accountId))
    .orderBy(sql`(${memberDocuments.status} = 'pending') DESC`, desc(memberDocuments.createdAt))
    .limit(200);

  return (
    <>
      {header}
      {rows.length ? (
        <ul className="admin-queue">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="admin-queue__main">
                <a href={`/api/documents/${r.id}`} className="admin-queue__title">{labelOf(r.kind)}: {r.name}</a>
                <span className="small">{r.fileName} · {size(r.size)} · {r.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}{r.note ? ` · “${r.note}”` : ""}</span>
              </div>
              <span className={`status status--${r.status === "approved" ? "audition-booked" : r.status === "rejected" ? "declined" : "shortlisted"}`}>{r.status === "pending" ? "To check" : r.status === "approved" ? "Approved" : "Rejected"}</span>
              {r.status !== "approved" ? (
                <form action={reviewDocument.bind(null, r.id)}>
                  <input type="hidden" name="status" value="approved" />
                  <button type="submit" className="admin-queue__act">Approve</button>
                </form>
              ) : null}
              {r.status !== "rejected" ? (
                <form action={reviewDocument.bind(null, r.id)} className="admin-status admin-status--inline">
                  <input type="hidden" name="status" value="rejected" />
                  <label htmlFor={`note-${r.id}`} className="sr-only">Reason for {r.name}</label>
                  <input id={`note-${r.id}`} name="note" placeholder="Reason (sent to them)" maxLength={500} />
                  <button type="submit" className="btn btn--ink btn--sm">Reject</button>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card admin-empty">
          <h2>No documents yet</h2>
          <p>Parents of young performers and pet owners upload them from their dashboard. They appear here to check.</p>
        </div>
      )}
    </>
  );
}
