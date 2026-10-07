import Link from "next/link";
import type { ReactNode } from "react";

/** Title row at the top of every admin page. */
export function AdminHeader({ title, description, actions, back }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; back?: { href: string; label: string } }) {
  return (
    <header className="admin-head">
      {back ? <Link href={back.href} className="admin-head__back">← {back.label}</Link> : null}
      <div className="admin-head__row">
        <div>
          <h1>{title}</h1>
          {description ? <p className="lead">{description}</p> : null}
        </div>
        {actions ? <div className="btn-row">{actions}</div> : null}
      </div>
    </header>
  );
}

/** Shown on admin pages when DATABASE_URL isn't set. */
export function NoDatabase() {
  return (
    <div className="admin-card admin-setup">
      <h2>Connect the database first</h2>
      <p>The admin saves everything to the RafikiHub database, and it isn't connected here yet.</p>
      <ol>
        <li>In Neon, open the RafikiHub project and copy the connection string (use a <strong>dev</strong> branch for testing).</li>
        <li>Add it as <code>DATABASE_URL</code>: in <code>.env.local</code> on your computer, or in Vercel under Settings → Environment Variables.</li>
        <li>Run <code>npm run db:push</code> once to create the tables, then reload this page.</li>
      </ol>
    </div>
  );
}

export function Notice({ children, tone = "ok" }: { children: ReactNode; tone?: "ok" | "info" }) {
  return <p className={tone === "ok" ? "form-success" : "admin-info"} role="status">{children}</p>;
}

export function Pager({ page, total, size, href }: { page: number; total: number; size: number; href: (p: number) => string }) {
  const pages = Math.max(1, Math.ceil(total / size));
  if (pages < 2) return null;
  return (
    <nav className="pager" aria-label="Pages">
      {page > 1 ? <Link href={href(page - 1)} className="btn btn--ink btn--sm">← Newer</Link> : <span />}
      <span className="small">Page {page} of {pages} · {total} in all</span>
      {page < pages ? <Link href={href(page + 1)} className="btn btn--ink btn--sm">Older →</Link> : <span />}
    </nav>
  );
}

export function StatusPill({ status }: { status: string }) {
  return <span className={`status status--${status}`}>{status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " ")}</span>;
}

/** A plain filter tab bar: links that keep the rest of the query string. */
export function Tabs({ items, current, label }: { items: { key: string; label: string; href: string; count?: number }[]; current: string; label: string }) {
  return (
    <nav className="filter" aria-label={label}>
      {items.map((t) => (
        <Link key={t.key} href={t.href} className="chip" aria-current={t.key === current ? "page" : undefined}>
          {t.label}{t.count !== undefined ? <span className="chip__n">{t.count}</span> : null}
        </Link>
      ))}
    </nav>
  );
}

export const fmtDate = (d: unknown) =>
  d ? new Date(d as string).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Nairobi" }) : "";
