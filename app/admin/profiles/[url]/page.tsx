import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { AdminForm, ConfirmButton } from "@/components/admin/AdminForm";
import { ImageListField } from "@/components/admin/ImageField";
import { AdminHeader, NoDatabase, Notice } from "@/components/admin/ui";
import {
  creditsText, documentsText, emptyProfile, linesOf, measurementKeys, measurementLabels, profileOptions, trainingText, traitsText,
} from "@/lib/admin/profile-form";
import type { TalentProfile } from "@/lib/data";
import { getDb } from "@/lib/db";
import { talentProfiles } from "@/lib/db/schema";
import { profileCompleteness } from "@/lib/profile-completeness";
import { deleteProfile, saveProfile } from "../actions";

type Props = { params: Promise<{ url: string }>; searchParams: Promise<{ saved?: string }> };

const labels: Record<string, string> = {
  fullName: "Name", profileUrl: "Link name", category: "Category", ageMax: "Playing age", heightFeet: "Height", dateOfBirth: "Date of birth",
  credits: "Credits", training: "Training", traits: "Appearance traits", documents: "Documents", weightKg: "Weight", email: "Email",
  website: "Website", showreelUrl: "Showreel", voiceoverReelUrl: "Voice-over reel",
};

function Text({ name, label, value, half, type = "text", hint }: { name: string; label: string; value?: string | number | null; half?: boolean; type?: string; hint?: string }) {
  return (
    <div className={half ? "field field--half" : "field"}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} defaultValue={value ?? ""} />
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}
function Area({ name, label, value, rows = 4, hint }: { name: string; label: string; value: string; rows?: number; hint?: string }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <textarea id={name} name={name} rows={rows} defaultValue={value} />
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}
function Choice({ name, label, value, options }: { name: string; label: string; value: string | null; options: readonly string[] }) {
  return (
    <div className="field field--half">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={value ?? ""}>
        <option value="">Not given</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

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
  const m = p.furtherMeasurements;

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

      <AdminForm action={saveProfile.bind(null, isNew ? "new" : p.profileUrl)} labels={labels} submitLabel={isNew ? "Create profile" : "Save profile"}>
        <section className="admin-card form" aria-labelledby="s-basics">
          <h2 id="s-basics" className="admin-card__title">The basics</h2>
          <Text name="fullName" label="Name" value={p.fullName} half />
          <Text name="profileUrl" label="Link name" value={p.profileUrl} half hint="rafikihub.com/profile/link-name. Changing it breaks links the member has already shared." />
          <Choice name="category" label="Category" value={p.category} options={profileOptions.category} />
          <Area name="bio" label="About them" value={p.bio ?? ""} rows={5} />
          <div className="field field--check"><label><input type="checkbox" name="_published" defaultChecked={published} /> Published (anyone with the link can see it)</label></div>
          <div className="field field--check"><label><input type="checkbox" name="represented" defaultChecked={p.representedByRafikiHub} /> Represented by RafikiHub Talent Management</label></div>
          <div className="field field--check"><label><input type="checkbox" name="isEnhanced" defaultChecked={p.isEnhanced} /> Enhanced listing</label></div>
        </section>

        <section className="admin-card form" aria-labelledby="s-media">
          <h2 id="s-media" className="admin-card__title">Headshots and reels</h2>
          <ImageListField name="headshots" label="Headshots" defaultValue={p.media.headshots} hint="The first one is the main photo, used in search results and link previews." />
          <Text name="showreelUrl" label="Showreel link" value={p.media.showreelUrl} type="url" half />
          <Text name="voiceoverReelUrl" label="Voice-over reel link" value={p.media.voiceoverReelUrl} type="url" half />
          <Area name="documents" label="Documents" value={documentsText(p)} rows={2} hint="Public: anyone viewing the profile can open them. One per line, as Name | https://link. Never add ID or passport scans." />
        </section>

        <section className="admin-card form" aria-labelledby="s-personal">
          <h2 id="s-personal" className="admin-card__title">Personal details</h2>
          <Text name="ageMin" label="Playing age from" value={p.personalData.playingAge?.min} type="number" half />
          <Text name="ageMax" label="Playing age to" value={p.personalData.playingAge?.max} type="number" half />
          <Text name="heightFeet" label="Height (feet)" value={p.personalData.height?.feet} type="number" half />
          <Text name="heightInches" label="Height (inches)" value={p.personalData.height?.inches} type="number" half />
          <Text name="dateOfBirth" label="Date of birth" value={p.personalData.dateOfBirth} type="date" half hint="Only the age is shown on the profile." />
          <Text name="country" label="Country" value={p.personalData.country} half />
          <Area name="cities" label="Cities they work in" value={linesOf(p.cities)} rows={3} hint="One per line." />
          <Area name="nationalities" label="Nationalities" value={linesOf(p.nationalities)} rows={2} hint="One per line." />
        </section>

        <section className="admin-card form" aria-labelledby="s-look">
          <h2 id="s-look" className="admin-card__title">Appearance and voice</h2>
          <Choice name="appearance" label="Appearance" value={p.appearance.appearance} options={profileOptions.appearance} />
          <Choice name="eyeColor" label="Eye colour" value={p.appearance.eyeColor} options={profileOptions.eyeColor} />
          <Choice name="hairColor" label="Hair colour" value={p.appearance.hairColor} options={profileOptions.hairColor} />
          <Choice name="hairLength" label="Hair length" value={p.appearance.hairLength} options={profileOptions.hairLength} />
          <Choice name="facialHair" label="Facial hair" value={p.appearance.facialHair} options={profileOptions.facialHair} />
          <Choice name="voiceQuality" label="Voice quality" value={p.voiceAttributes.voiceQuality} options={profileOptions.voiceQuality} />
          <Choice name="voiceCharacter" label="Voice character" value={p.voiceAttributes.voiceCharacter} options={profileOptions.voiceCharacter} />
          <Text name="lowVoice" label="Low voice" value={p.voiceRange.lowVoice} half />
          <Text name="mediumVoice" label="Medium voice" value={p.voiceRange.mediumVoice} half />
          <Text name="highVoice" label="High voice" value={p.voiceRange.highVoice} half />
          <Area name="traits" label="Appearance traits" value={traitsText(p)} rows={2} hint={`One per line, as Trait | Where. Traits: ${profileOptions.trait.join(", ")}.`} />
        </section>

        <section className="admin-card form" aria-labelledby="s-measure">
          <h2 id="s-measure" className="admin-card__title">Measurements</h2>
          {measurementKeys.map((k) => (
            <div key={k} className="field field--half field--unit">
              <label htmlFor={`m_${k}`}>{measurementLabels[k]}</label>
              <div className="unit-input">
                <input id={`m_${k}`} name={`m_${k}`} type="number" step="0.5" defaultValue={m[k]?.value ?? ""} />
                <select name={`m_${k}_unit`} defaultValue={m[k]?.unit ?? "inches"} aria-label={`${measurementLabels[k]} unit`}>
                  <option value="inches">in</option><option value="cm">cm</option>
                </select>
              </div>
            </div>
          ))}
          <Text name="weightKg" label="Weight (kg)" value={m.weightKg} type="number" half />
          <Text name="shoeSize" label="Shoe size" value={m.shoeSize} half />
          <Text name="dressSize" label="Dress size" value={m.dressSize} half />
        </section>

        <section className="admin-card form" aria-labelledby="s-cv">
          <h2 id="s-cv" className="admin-card__title">CV</h2>
          <Area name="credits" label="Credits" value={creditsText(p)} rows={6} hint="One per line: Year | Production | Role | Type | Director. Types: Film, TV, Theatre, Commercial, Radio, Voice Over, Music Video, Other." />
          <Area name="training" label="Training" value={trainingText(p)} rows={4} hint="One per line: Institution | Course | Year" />
          <Area name="skills" label="Skills" value={linesOf(p.skills)} rows={4} hint="One per line, e.g. Stage combat, Swimming, Puppetry." />
          <Area name="languages" label="Languages" value={linesOf(p.languages)} rows={3} hint="One per line." />
          <Area name="accents" label="Accents" value={linesOf(p.accents)} rows={3} hint="One per line." />
        </section>

        <section className="admin-card form" aria-labelledby="s-contact">
          <h2 id="s-contact" className="admin-card__title">Contact details</h2>
          <Text name="email" label="Email" value={p.contactDetails.email} type="email" half />
          <Text name="phone" label="Phone" value={p.contactDetails.phone} half />
          <Text name="website" label="Website" value={p.contactDetails.website} type="url" half />
          <Text name="contactCountry" label="Country" value={p.contactDetails.country} half />
          <Text name="address" label="Address" value={p.contactDetails.address} />
        </section>
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
