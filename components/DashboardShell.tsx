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
  // Sidebar on wide screens; on phones the same section links become a floating bar at the bottom
  return (
    <div className="dash-app">
      <aside className="dash-side">
        <p className="dash-side__label">{current.label}</p>
        <nav aria-label="Dashboard sections" className="dash-sections">
          <ul>
            {tabs.map((t) => (
              <li key={t.id}>
                <Link href={t.id === "home" ? current.href : `${current.href}?tab=${t.id}`} aria-current={t.id === tab ? "page" : undefined}>{t.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        {master ? (
          <nav aria-label="Dashboards" className="dash-tabs">
            {dashboardRoles.map((d) => (
              <Link key={d.role} href={d.href} aria-current={d.role === role ? "page" : undefined}>{d.label}</Link>
            ))}
          </nav>
        ) : null}
        <form action="/api/auth/logout" method="post" className="dash-side__logout">
          <button type="submit" className="link-button">Log out</button>
        </form>
      </aside>
      <div className="dash-main">
        <header className="dash-header">
          <p className="dash-header__hello">{master ? "Master view" : welcome ? `Karibu, ${first}` : `Habari, ${first}`}</p>
          <h1>{master ? <>Every dashboard, <em>one login</em>.</> : welcome ? <>Welcome to <em>RafikiHub</em>.</> : <>Your <em>{current.label.toLowerCase()}</em>.</>}</h1>
          <p className="lead">
            {master
              ? "You're signed in with the master login, so you can open both dashboards."
              : welcome
                ? "Your account is ready. Start with your profile: it's what casting directors see first."
                : "Here's where your membership, profile and castings live."}
          </p>
        </header>
        {children}
      </div>
    </div>
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
