import { desc, eq, sql } from "drizzle-orm";
import { AdminHeader, NoDatabase } from "@/components/admin/ui";
import { services } from "@/lib/data";
import { getDb } from "@/lib/db";
import { accounts, reviews } from "@/lib/db/schema";
import { reviewLabels, stars, type ReviewKind } from "@/lib/reviews";
import { requireMaster } from "@/lib/session";
import { moderateReview } from "./actions";

/** Every review waits here until the team approves it. Waiting ones first. */
export default async function ReviewsPage() {
  await requireMaster(); // the layout checks too, but a request can skip the layout
  const header = <AdminHeader title="Reviews" description="Casting directors on performers, performers on castings and members on services. Nothing shows publicly until it's approved here." />;
  const db = getDb();
  if (!db) return <>{header}<NoDatabase /></>;
  const rows = await db
    .select({
      id: reviews.id, kind: reviews.kind, subject: reviews.subject, rating: reviews.rating, body: reviews.body, status: reviews.status, createdAt: reviews.createdAt, author: accounts.name,
      about: sql<string | null>`CASE ${reviews.kind} WHEN 'performer' THEN (SELECT name FROM accounts a WHERE a.id = ${reviews.subject}::int) WHEN 'casting' THEN (SELECT title FROM auditions c WHERE c.id = ${reviews.subject}::int) END`,
    })
    .from(reviews)
    .innerJoin(accounts, eq(accounts.id, reviews.authorId))
    .orderBy(sql`(${reviews.status} = 'pending') DESC`, desc(reviews.createdAt))
    .limit(200);

  return (
    <>
      {header}
      {rows.length ? (
        <ul className="admin-queue">
          {rows.map((r) => (
            <li key={r.id}>
              <div className="admin-queue__main">
                <span className="admin-queue__title"><span aria-label={`${r.rating} out of 5`}>{stars(r.rating)}</span> {r.author} on {r.about ?? services.find((s) => s.id === r.subject)?.name ?? r.subject}</span>
                <span className="small">“{r.body}”</span>
                <span className="small">{reviewLabels[r.kind as ReviewKind] ?? r.kind} · {r.createdAt.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <span className={`status status--${r.status === "approved" ? "audition-booked" : r.status === "rejected" ? "declined" : "shortlisted"}`}>{r.status === "pending" ? "To check" : r.status === "approved" ? "Showing" : "Hidden"}</span>
              {r.status !== "approved" ? (
                <form action={moderateReview.bind(null, r.id)}><input type="hidden" name="status" value="approved" /><button type="submit" className="admin-queue__act">Approve</button></form>
              ) : null}
              {r.status !== "rejected" ? (
                <form action={moderateReview.bind(null, r.id)}><input type="hidden" name="status" value="rejected" /><button type="submit" className="btn btn--ink btn--sm">{r.status === "approved" ? "Hide" : "Reject"}</button></form>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="admin-card admin-empty">
          <h2>No reviews yet</h2>
          <p>Members leave reviews from their dashboards once they&apos;ve worked together on a casting or booked a service.</p>
        </div>
      )}
    </>
  );
}
