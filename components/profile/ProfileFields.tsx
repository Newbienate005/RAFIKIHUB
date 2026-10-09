import { ImageListField } from "@/components/admin/ImageField";
import { ClipListField } from "@/components/profile/ClipListField";
import { CreditsField, TagsField, TraitsField, TrainingField } from "@/components/profile/CvFields";
import {
  creditTypes, documentsText, measurementKeys, measurementLabels, profileOptions,
} from "@/lib/admin/profile-form";
import { reelsOf, voiceClipsOf } from "@/lib/media";
import { isPet, petPersonalityOptions, petSizeOptions, petSkillOptions, petTrainingOptions, petTypeOptions, type TalentProfile } from "@/lib/data";

/**
 * The talent profile editor's fields, shared by the admin (/admin/profiles/…) and members editing their
 * own profile (/dashboard/profile). Admins also set the link name, publishing and representation.
 * Pet profiles get a pet section instead of the human ones (playing age, voice, measurements, CV).
 */

export const profileFieldLabels: Record<string, string> = {
  fullName: "Name", profileUrl: "Link name", category: "Category", ageMax: "Playing age", heightFeet: "Height", dateOfBirth: "Date of birth",
  credits: "Credits", training: "Training", traits: "Appearance traits", documents: "Documents", weightKg: "Weight", email: "Email",
  website: "Website", reels: "Showreels", voiceClips: "Voice clips", petType: "Type of animal", petSize: "Size",
  petTrainingLevel: "Training level", petPersonality: "Personality",
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
function Choice({ name, label, value, options, hint }: { name: string; label: string; value: string | null | undefined; options: readonly string[]; hint?: string }) {
  return (
    <div className="field field--half">
      <label htmlFor={name}>{label}</label>
      <select id={name} name={name} defaultValue={value ?? ""}>
        <option value="">Not given</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {hint ? <p className="hint">{hint}</p> : null}
    </div>
  );
}

/**
 * `only="cv"` shows just the CV sections (personal details, appearance, measurements, credits and skills,
 * or a pet's details) for the dashboard's Edit CV tab; the form keeps everything else as saved.
 */
export function ProfileFields({ p, mode, published, uploadFolder, only }: { p: TalentProfile; mode: "admin" | "member"; published?: boolean; uploadFolder: string; only?: "cv" }) {
  const pet = isPet(p);
  const m = p.furtherMeasurements;
  const isAdmin = mode === "admin";
  const cvOnly = only === "cv";
  // Members upload into their own folder; the admin keeps reels together
  const clipFolder = isAdmin ? "profiles" : uploadFolder;
  return (
    <>
      {cvOnly ? null : <>
      <section className="admin-card form" aria-labelledby="s-basics">
        <h2 id="s-basics" className="admin-card__title">The basics</h2>
        <Text name="fullName" label={pet ? "Animal's name" : "Name"} value={p.fullName} half />
        {isAdmin ? (
          <Text name="profileUrl" label="Link name" value={p.profileUrl} half hint="rafikihub.com/profile/link-name. Changing it breaks links the member has already shared." />
        ) : (
          <div className="field field--half">
            <span className="field__label">Your link</span>
            <p className="admin-link">rafikihub.com/profile/{p.profileUrl}</p>
            <p className="hint">Share this with casting directors. Ask the RafikiHub team if it needs to change.</p>
          </div>
        )}
        {isAdmin || !pet ? (
          <Choice name="category" label="Category" value={p.category} options={isAdmin ? profileOptions.category : profileOptions.category.filter((c) => c !== "Pet")} hint={isAdmin && !pet ? "Choosing Pet? Save once and the pet details appear." : undefined} />
        ) : <input type="hidden" name="category" value="Pet" />}
        <Area name="bio" label={pet ? "About the animal" : "About you"} value={p.bio ?? ""} rows={5} hint={pet ? "Temperament, what they've done before, and anything a production should know." : undefined} />
        {isAdmin ? (
          <>
            <input type="hidden" name="_adminFields" value="1" />
            <div className="field field--check"><label><input type="checkbox" name="_published" defaultChecked={published} /> Published (anyone with the link can see it)</label></div>
            <div className="field field--check"><label><input type="checkbox" name="represented" defaultChecked={p.representedByRafikiHub} /> Represented by RafikiHub Talent Management</label></div>
            <div className="field field--check"><label><input type="checkbox" name="isEnhanced" defaultChecked={p.isEnhanced} /> Enhanced listing</label></div>
          </>
        ) : null}
      </section>

      <section className="admin-card form" aria-labelledby="s-media">
        <h2 id="s-media" className="admin-card__title">{pet ? "Photos and reel" : "Headshots and reels"}</h2>
        <ImageListField name="headshots" label={pet ? "Photos" : "Headshots"} defaultValue={p.media.headshots} folder={uploadFolder} hint="The first one is the main photo, used in search results and link previews." />
        <ClipListField name="reels" label={pet ? "Showreels" : "Showreels and video clips"} kind="video" defaultValue={reelsOf(p)} folder={clipFolder} />
        {pet ? null : <ClipListField name="voiceClips" label="Voice clips and voice-over reels" kind="audio" defaultValue={voiceClipsOf(p)} folder={clipFolder} />}
        {isAdmin && !pet ? <Area name="documents" label="Documents" value={documentsText(p)} rows={2} hint="Public: anyone viewing the profile can open them. One per line, as Name | https://link. Never add ID or passport scans." /> : null}
      </section>
      </>}

      {pet ? (
        <section className="admin-card form" aria-labelledby="s-pet">
          <h2 id="s-pet" className="admin-card__title">About the animal</h2>
          <Choice name="petType" label="Type of animal" value={p.pet?.type} options={petTypeOptions} />
          <Text name="petBreed" label="Breed" value={p.pet?.breed} half />
          <Choice name="petSize" label="Size" value={p.pet?.size} options={petSizeOptions} />
          <Text name="dateOfBirth" label="Date of birth" value={p.personalData.dateOfBirth} type="date" half hint="Only the age is shown." />
          <div className="field field--check"><label><input type="checkbox" name="petTrained" defaultChecked={p.pet?.trained} /> Trained</label></div>
          <Choice name="petTrainingLevel" label="Training level" value={p.pet?.trainingLevel} options={petTrainingOptions} />
          <Choice name="petPersonality" label="Personality" value={p.pet?.personality} options={petPersonalityOptions} />
          <fieldset className="field checks">
            <legend>Skills</legend>
            {petSkillOptions.map((s) => (
              <label key={s}><input type="checkbox" name="petSkills" value={s} defaultChecked={p.pet?.skills.includes(s)} /> {s}</label>
            ))}
          </fieldset>
          <TagsField name="cities" label="Cities they can work in" initial={p.cities} placeholder="e.g. Nairobi" />
          <Text name="country" label="Country" value={p.personalData.country} half />
        </section>
      ) : (
        <>
          <section className="admin-card form" aria-labelledby="s-personal">
            <h2 id="s-personal" className="admin-card__title">Personal details</h2>
            <Text name="ageMin" label="Playing age from" value={p.personalData.playingAge?.min} type="number" half />
            <Text name="ageMax" label="Playing age to" value={p.personalData.playingAge?.max} type="number" half />
            <Text name="heightFeet" label="Height (feet)" value={p.personalData.height?.feet} type="number" half />
            <Text name="heightInches" label="Height (inches)" value={p.personalData.height?.inches} type="number" half />
            <Text name="dateOfBirth" label="Date of birth" value={p.personalData.dateOfBirth} type="date" half hint="Only the age is shown on the profile." />
            <Text name="country" label="Country" value={p.personalData.country} half />
            <TagsField name="cities" label="Cities you work in" initial={p.cities} placeholder="e.g. Nairobi, Mombasa" />
            <TagsField name="nationalities" label="Nationalities" initial={p.nationalities} placeholder="e.g. Kenyan" />
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
            <TraitsField initial={p.appearanceTraits.map((t) => ({ trait: t.trait, location: t.location }))} traits={profileOptions.trait} />
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
            <h2 id="s-cv" className="admin-card__title">Credits, training and skills</h2>
            <CreditsField types={creditTypes} initial={p.credits.map((c) => ({ year: String(c.year), production: c.production, role: c.role, type: c.type, director: c.director ?? "" }))} />
            <TrainingField initial={p.training.map((t) => ({ institution: t.institution, course: t.course, year: t.year ? String(t.year) : "" }))} />
            <TagsField name="skills" label="Skills" initial={p.skills} placeholder="e.g. Stage combat, Swimming, Puppetry" />
            <TagsField name="languages" label="Languages" initial={p.languages} placeholder="e.g. Swahili, English" />
            <TagsField name="accents" label="Accents" initial={p.accents} placeholder="e.g. Kikuyu, British RP" />
          </section>
        </>
      )}

      {isAdmin && !cvOnly ? (
        <section className="admin-card form" aria-labelledby="s-contact">
          <h2 id="s-contact" className="admin-card__title">Contact details</h2>
          <Text name="email" label="Email" value={p.contactDetails.email} type="email" half />
          <Text name="phone" label="Phone" value={p.contactDetails.phone} half />
          <Text name="website" label="Website" value={p.contactDetails.website} type="url" half />
          <Text name="contactCountry" label="Country" value={p.contactDetails.country} half />
          <Text name="address" label="Address" value={p.contactDetails.address} />
        </section>
      ) : null}
    </>
  );
}
