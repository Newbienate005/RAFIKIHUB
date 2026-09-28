import type { Metadata } from "next";

// Private pages: never indexed, and always rendered per request (they read the session cookie).
export const metadata: Metadata = { title: "Dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
