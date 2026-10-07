import type { Metadata } from "next";
import { AdminNav, type NavGroup } from "@/components/admin/AdminNav";
import { inboxCounts, inboxKeys, inboxTypes } from "@/lib/admin/inbox";
import { contentKindList, contentKinds } from "@/lib/content-kinds";
import { requireMaster } from "@/lib/session";

export const metadata: Metadata = { title: { absolute: "Admin | RafikiHub" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireMaster();
  const counts = await inboxCounts().catch(() => null);
  const groups: NavGroup[] = [
    { label: "Admin", items: [{ href: "/admin", label: "Overview" }] },
    { label: "Website content", items: contentKindList.map((k) => ({ href: `/admin/content/${k}`, label: contentKinds[k].label })) },
    { label: "Inbox", items: inboxKeys.map((k) => ({ href: `/admin/inbox/${k}`, label: inboxTypes[k].label, badge: counts?.[k].new })) },
    {
      label: "Talent and castings",
      items: [
        { href: "/admin/profiles", label: "Talent profiles" },
        { href: "/admin/members", label: "Member accounts" },
        { href: "/admin/castings", label: "Casting breakdowns" },
      ],
    },
    { label: "Tools", items: [{ href: "/admin/import", label: "Import old database" }, { href: "/dashboard/performer", label: "Preview dashboards" }] },
  ];
  return (
    <div className="admin">
      <aside className="admin__side">
        <AdminNav groups={groups} />
        <form action="/api/auth/logout" method="post" className="admin__logout">
          <button type="submit" className="link-button">Log out</button>
        </form>
      </aside>
      <div className="admin__main">{children}</div>
    </div>
  );
}
