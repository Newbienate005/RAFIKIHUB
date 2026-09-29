import Link from "next/link";
import { dashboardRoles, type DashboardRole } from "@/lib/dashboard";
import type { Session } from "@/lib/session";

type Tab = { id: string; label: string };
type Props = { session: Session; role: DashboardRole; welcome?: boolean; tabs: readonly Tab[]; tab: string; children: React.ReactNode };

/** Header for both dashboards: greeting, master-login switcher and log out. */
export function DashboardShell({ session, role, welcome, tabs, tab, children }: Props) {
  const master = session.kind === "master";
  const first = master ? "" : session.name.split(" ")[0];
  const current = dashboardRoles.find((d) => d.role === role)!;
  return (
    <>
      <header className="page-header pattern dash-header">
        <div className="wrap">
          <div className="dash-header__top">
            <p className="kicker">{current.label}</p>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="link-button">Log out</button>
            </form>
          </div>
          <h1>{master ? <>Master <em>view</em>.</> : welcome ? <>Karibu, <em>{first}</em>.</> : <>Welcome back, <em>{first}</em>.</>}</h1>
          <p className="lead">
            {master
              ? "You're signed in with the master login, so you can open both dashboards."
              : welcome
                ? "Thanks for joining. Your application is with our team, and this is your dashboard while we set up your membership."
                : "Here's where your membership, profile and castings live."}
          </p>
          {master ? (
            <nav aria-label="Dashboards" className="dash-tabs">
              {dashboardRoles.map((d) => (
                <Link key={d.role} href={d.href} aria-current={d.role === role ? "page" : undefined}>{d.label}</Link>
              ))}
            </nav>
          ) : null}
        </div>
      </header>
      <nav aria-label="Dashboard sections" className="dash-sections">
        <div className="wrap">
          <ul>
            {tabs.map((t) => (
              <li key={t.id}>
                <Link href={t.id === "home" ? current.href : `${current.href}?tab=${t.id}`} aria-current={t.id === tab ? "page" : undefined}>{t.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      {children}
    </>
  );
}

/** Picks the requested tab, falling back to the first. */
export function pickTab<T extends { id: string }>(tabs: readonly T[], requested?: string) {
  return (tabs.find((t) => t.id === requested) ?? tabs[0]).id;
}

/** Marks demo content that isn't connected to real data yet. */
export function SampleTag() {
  return <span className="sample-tag">Sample</span>;
}
