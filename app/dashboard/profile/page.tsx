import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminForm } from "@/components/admin/AdminForm";
import { ProfileFields, profileFieldLabels } from "@/components/profile/ProfileFields";
import { emptyProfile } from "@/lib/admin/profile-form";
import { profileCategories, type TalentProfile } from "@/lib/data";
import { getMember } from "@/lib/member";
import { requireAccount } from "@/lib/session";
import { saveOwnProfile } from "./actions";

type Props = { searchParams: Promise<{ saved?: string }> };

/** A member editing their own public profile. */
export default async function MyProfilePage({ searchParams }: Props) {
  const session = await requireAccount();
  if (session.role === "casting") redirect("/dashboard/casting");
  const sp = await searchParams;
  const member = await getMember(session.accountId);
  if (!member) redirect("/login");
  const { account, profile, completeness } = member;

  const p: TalentProfile = profile?.data ?? {
    ...emptyProfile(),
    fullName: account.name,
    category: account.category && (profileCategories as readonly string[]).includes(account.category) ? (account.category as TalentProfile["category"]) : "Actor",
    profileUrl: "(made when you first save)",
  };

  return (
    <section className="section">
      <div className="wrap dash member-edit">
        <header className="admin-head">
          <Link href="/dashboard/performer" className="admin-head__back">← My dashboard</Link>
          <div className="admin-head__row">
            <div>
              <h1>{profile ? "Edit my profile" : "Create my profile"}</h1>
              <p className="lead">This is what casting directors see. Changes go live as soon as you save{profile?.published ? "" : ", once the RafikiHub team has published your profile"}.</p>
            </div>
            {profile?.published ? <div className="btn-row"><Link href={`/profile/${account.profileUrl}`} className="btn btn--ghost btn--sm" target="_blank">View my public profile</Link></div> : null}
          </div>
        </header>
        {sp.saved ? <p className="form-success" role="status">Saved.{profile?.published ? " Your public profile is updated." : ""}</p> : null}
        {completeness ? (
          <div className="admin-card admin-complete">
            <p><strong>{completeness.percent}% complete</strong>{completeness.missing.length ? ` · Still to add: ${completeness.missing.join(", ")}` : " · Every section is filled in."}</p>
            <span className="meter"><span style={{ width: `${completeness.percent}%` }} /></span>
          </div>
        ) : null}
        <AdminForm action={saveOwnProfile} labels={profileFieldLabels} submitLabel={profile ? "Save my profile" : "Create my profile"}>
          <ProfileFields p={p} mode="member" uploadFolder={`members/${account.id}`} />
        </AdminForm>
      </div>
    </section>
  );
}
