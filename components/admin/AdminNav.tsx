"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavGroup = { label: string; items: { href: string; label: string; badge?: number }[] };

/** Admin sidebar. The current page is bold and white; new inbox items show as a count. */
export function AdminNav({ groups }: { groups: NavGroup[] }) {
  const path = usePathname();
  const isCurrent = (href: string) => (href === "/admin" ? path === "/admin" : path === href || path.startsWith(`${href}/`));
  return (
    <nav aria-label="Admin" className="admin-nav">
      {groups.map((g) => (
        <div key={g.label} className="admin-nav__group">
          <h2>{g.label}</h2>
          <ul>
            {g.items.map((i) => (
              <li key={i.href}>
                <Link href={i.href} aria-current={isCurrent(i.href) ? "page" : undefined}>
                  <span>{i.label}</span>
                  {i.badge ? <span className="admin-nav__badge" aria-label={`${i.badge} new`}>{i.badge}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
