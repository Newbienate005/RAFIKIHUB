import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminForm, ConfirmButton } from "@/components/admin/AdminForm";
import { AdminHeader, NoDatabase, Notice } from "@/components/admin/ui";
import { ProfileFields, profileFieldLabels } from "@/components/profile/ProfileFields";
import { emptyProfile } from "@/lib/admin/profile-form";
import type { TalentProfile } from "@/lib/data";
import { getDb } from "@/lib/db";
import { talentProfiles } from "@/lib/db/schema";
import { profileCompleteness } from "@/lib/profile-completeness";
import { deleteProfile, saveProfile } from "../actions";

type Props = { params: Promise<{ url: string }>; searchParams: Promise<{ saved?: string }> };

export default async function ProfileEditPage({ params, searchParams }: Props) {
  const { url } = await params;
  const sp = await searchParams;
  const isNew = url === "new";
  const back = { href: "/admin/profiles", label: "Talent profiles" };
  const db = getDb();
  if (!db) return <><AdminHeader title={isNew ? "New profile" : "Edit profile"} back={back} /><NoDatabase /></>;

  let p: TalentProfile = emptyProfile();
  let published = false;
  if (!isNew) {
    const [row] = await db.select().from(talentProfiles).where(eq(talentProfiles.profileUrl, decodeURIComponent(url))).limit(1);
    if (!row) notFound();
    p = row.data;
    published = row.published;
  }
  const { percent, missing } = profileCompleteness(p);

  return (
    <>
      <AdminHeader
        title={isNew ? "New profile" : p.fullName}
        back={back}
        actions={!isNew ? <Link href={`/profile/${p.profileUrl}`} target="_blank" className="btn btn--ghost btn--sm">View profile</Link> : null}
      />
      {sp.saved ? <Notice>Saved.{published ? " The public profile is updated." : " It isn't published yet."}</Notice> : null}
      {!isNew ? (
        <div className="admin-card admin-complete">
          <p><strong>{percent}% complete</strong>{missing.length ? ` · Missing: ${missing.join(", ")}` : " · Every section is filled in."}</p>
          <span className="meter"><span style={{ width: `${percent}%` }} /></span>
        </div>
      ) : null}

      <AdminForm action={saveProfile.bind(null, isNew ? "new" : p.profileUrl)} labels={profileFieldLabels} submitLabel={isNew ? "Create profile" : "Save profile"}>
        <ProfileFields p={p} mode="admin" published={published} uploadFolder="headshots" />
      </AdminForm>

      {!isNew ? (
        <div className="admin-danger">
          <p>To take a profile down, untick “Published” instead. Deleting removes it and everything on it for good.</p>
          <ConfirmButton action={deleteProfile.bind(null, p.profileUrl)} message={`Delete ${p.fullName}'s profile? This can't be undone.`}>Delete profile</ConfirmButton>
        </div>
      ) : null}
    </>
  );
}
