import { eq } from "drizzle-orm";
import { AdminHeader, NoDatabase, fmtDate } from "@/components/admin/ui";
import { getDb } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";

type Report = { at: string; file: string; summary: Record<string, number>; skipped: Record<string, number>; notes: string[]; filesCopied: boolean };

export default async function ImportPage() {
  const header = (
    <AdminHeader
      title="Import the old database"
      description="Bring members, profiles, castings, payments, bookings and blog posts across from the old rafikihub.com."
    />
  );
  const db = getDb();
  if (!db) return <>{header}<NoDatabase /></>;
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.key, "import:last")).limit(1).catch(() => []);
  const last = row?.value as Report | undefined;

  return (
    <>
      {header}
      {last ? (
        <section className="admin-card" aria-labelledby="last">
          <h2 id="last" className="admin-card__title">Last import · {fmtDate(last.at)}</h2>
          <p className="small">From {last.file}{last.filesCopied ? ", with photos and reels copied to Vercel Blob" : ". Photos and reels still load from the old site"}.</p>
          <dl className="facts">
            {Object.entries(last.summary).map(([k, v]) => <div key={k} className="facts__row"><dt>{k.trim()}</dt><dd>{v}</dd></div>)}
          </dl>
          {Object.keys(last.skipped).length ? (
            <>
              <h3>Left out</h3>
              <ul className="plain">{Object.entries(last.skipped).map(([k, v]) => <li key={k}>{v} {k}</li>)}</ul>
            </>
          ) : null}
          {last.notes.length ? <ul className="plain">{last.notes.map((n) => <li key={n}>{n}</li>)}</ul> : null}
        </section>
      ) : null}

      <section className="admin-card admin-setup" aria-labelledby="how">
        <h2 id="how" className="admin-card__title">How to import</h2>
        <p>The import runs on a computer, not in the browser: the export holds members&apos; personal data, so it never gets uploaded to the website.</p>
        <ol>
          <li>In Hostinger&apos;s control panel, open <strong>phpMyAdmin</strong>, choose the RafikiHub database, and use <strong>Export</strong> (Quick, SQL format). Save the <code>.sql</code> file somewhere private.</li>
          <li>In the project folder, check it first. This changes nothing:<pre><code>npm run import:old -- path/to/rafikihub.sql --dry-run</code></pre></li>
          <li>Import into a <strong>Neon dev branch</strong> first (its <code>DATABASE_URL</code> in <code>.env.local</code>), check members and profiles here, then repeat against the live database.<pre><code>npm run import:old -- path/to/rafikihub.sql</code></pre></li>
          <li>Before rafikihub.com moves to the new site, copy the photos, reels and blog images into Vercel Blob (needs <code>BLOB_READ_WRITE_TOKEN</code>):<pre><code>npm run import:old -- path/to/rafikihub.sql --copy-files</code></pre></li>
        </ol>
        <p className="small">You can run it again with a newer export until the switch-over: accounts and castings are updated, profiles are only refreshed if nobody has edited them here, and nothing else is duplicated.</p>
      </section>

      <section className="admin-card" aria-labelledby="what">
        <h2 id="what" className="admin-card__title">What comes across</h2>
        <ul className="plain">
          <li><strong>Member accounts</strong>: performers, crew, pets and casting professionals, with their old passwords, so members can log in once member logins are switched on. Duplicate emails are merged.</li>
          <li><strong>Talent profiles</strong>: at the same link as before (rafikihub.com/profile?url=… keeps working). Published only if the member was active and visible on the old site.</li>
          <li><strong>Castings and applications</strong>, agent links, payments, Sio Bahati bookings, location requests and blog posts.</li>
          <li><strong>Left out on purpose</strong>: ID and passport numbers, KRA PINs, home addresses and every uploaded document. Members&apos; phone numbers and emails stay private on their account, not on their public profile.</li>
        </ul>
      </section>
    </>
  );
}
