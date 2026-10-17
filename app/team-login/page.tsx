import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Team login", robots: { index: false, follow: false } };

/** The admin login: just the master password, no email. Members sign in at /login. */
export default async function TeamLoginPage() {
  const session = await getSession();
  const masterSetUp = Boolean(process.env.MASTER_PASSWORD);
  return (
    <section className="section">
      <div className="wrap auth">
        <p className="kicker">RafikiHub team</p>
        <h1 className="auth__title">Team login</h1>
        <div className="panel">
          {session?.kind === "master" ? (
            <>
              <p>You&apos;re signed in with the master login.</p>
              <div className="btn-row">
                <Link className="btn btn--sun" href="/admin">Open the admin</Link>
              </div>
              <form action="/api/auth/logout" method="post" className="auth__logout">
                <button type="submit" className="link-button">Log out</button>
              </form>
            </>
          ) : (
            <>
              <p className="small">Enter the team password to open the admin and both dashboards. No email needed.</p>
              {masterSetUp ? <LoginForm /> : (
                <p className="form-error">The master login isn&apos;t set up yet. Add a <code>MASTER_PASSWORD</code> environment variable (in Vercel: Settings → Environment Variables) and redeploy.</p>
              )}
            </>
          )}
        </div>
        <p className="small auth__note">A member? <Link href="/login">Log in with your email</Link>.</p>
      </div>
    </section>
  );
}
