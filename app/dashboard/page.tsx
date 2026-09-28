import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

/** Sends each visitor to the right dashboard: master to the Performer view (with a switcher), members to their own. */
export default async function DashboardIndex() {
  const s = await getSession();
  if (!s) redirect("/login");
  redirect(s.kind === "master" ? "/dashboard/performer" : `/dashboard/${s.role}`);
}
