import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { dashboardRoles } from "@/lib/dashboard";
import { getSession } from "@/lib/session";

// Not linked from the menus: bookmark it.
export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const session = await getSession();
  const setUp = Boolean(process.env.MASTER_PASSWORD);
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: "30rem" }}>
        <p className="kicker">RafikiHub dashboards</p>
        <h1 style={{ fontSize: "var(--step-3)" }}>Log in</h1>
        {session ? (
          <div className="panel">
            <p>You're already signed in{session.kind === "master" ? " with the master login" : ` as ${session.name}`}.</p>
            <div className="btn-row">
              {dashboardRoles
                .filter((d) => session.kind === "master" || d.role === session.role)
                .map((d) => <Link key={d.role} className="btn btn--ink" href={d.href}>{d.label}</Link>)}
            </div>
            <form action="/api/auth/logout" method="post" style={{ marginTop: "1.25rem" }}>
              <button type="submit" className="link-button">Log out</button>
            </form>
          </div>
        ) : (
          <div className="panel">
            <p className="small">The master login opens both the Performer and the Casting dashboards.</p>
            {setUp ? <LoginForm /> : (
              <p className="form-error">The master login isn't set up yet. Add a <code>MASTER_PASSWORD</code> environment variable (in Vercel: Settings → Environment Variables) and redeploy.</p>
            )}
          </div>
        )}
        <p className="small" style={{ marginTop: "1.5rem" }}>New to RafikiHub? <Link href="/join">Apply for membership</Link> and you'll go straight to your dashboard.</p>
      </div>
    </section>
  );
}
