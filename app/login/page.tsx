import type { Metadata } from "next";
import Link from "next/link";
import { MemberLoginForm } from "@/components/auth/AuthForms";
import { LoginForm } from "@/components/LoginForm";
import { dashboardRoles } from "@/lib/dashboard";
import { getSession } from "@/lib/session";

export const metadata: Metadata = { title: "Log in", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const session = await getSession();
  const { error } = await searchParams;
  const masterSetUp = Boolean(process.env.MASTER_PASSWORD);
  return (
    <section className="section">
      <div className="wrap auth">
        <p className="kicker">Members</p>
        <h1 className="auth__title">Log in to RafikiHub</h1>
        {session ? (
          <div className="panel">
            <p>You&apos;re already signed in{session.kind === "master" ? " with the master login" : ` as ${session.name}`}.</p>
            <div className="btn-row">
              {session.kind === "master" ? <Link className="btn btn--sun" href="/admin">Open the admin</Link> : null}
              {dashboardRoles
                .filter((d) => session.kind === "master" || d.role === session.role)
                .map((d) => <Link key={d.role} className="btn btn--ink" href={d.href}>{session.kind === "master" ? d.label : "Open my dashboard"}</Link>)}
            </div>
            <form action="/api/auth/logout" method="post" className="auth__logout">
              <button type="submit" className="link-button">Log out</button>
            </form>
          </div>
        ) : (
          <>
            <div className="panel">
              <p className="small">Use the email and password from your RafikiHub account. Passwords from the old rafikihub.com still work.</p>
              {error ? <p className="form-error" role="alert">That email and password don&apos;t match. Check them, or <Link href="/forgot-password">reset your password</Link>.</p> : null}
              <MemberLoginForm />
            </div>
            <p className="small auth__note">New to RafikiHub? <Link href="/join">Apply for membership</Link>.</p>
            <details className="auth__admin">
              <summary>RafikiHub team login</summary>
              <div className="panel">
                <p className="small">The master login opens the admin and both dashboards.</p>
                {masterSetUp ? <LoginForm /> : (
                  <p className="form-error">The master login isn&apos;t set up yet. Add a <code>MASTER_PASSWORD</code> environment variable (in Vercel: Settings → Environment Variables) and redeploy.</p>
                )}
              </div>
            </details>
          </>
        )}
      </div>
    </section>
  );
}
