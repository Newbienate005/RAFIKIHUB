import { useState, type FormEvent } from 'react'
import type { Theme } from '../../theme'
import {
  fullCountryList, genderOptions, appearanceOptions, eyeColorOptions, hairColorOptions,
  hairLengthOptions, facialHairOptions, voiceQualityOptions, voiceCharacterOptions,
  lowVoiceOptions, mediumVoiceOptions, highVoiceOptions, heightFeetOptions, heightInchesOptions,
  distinguishingTraitOptions, traitLocationOptions, type CvProfile, type TrainingRecord,
} from '../../data'
import { SectionCard, Field, inputStyle, inputClass, PrimaryButton, TagChips, DocStatusBadge, FileInputField } from './shared'

interface Props {
  t: Theme
  cv: CvProfile
  setCv: (cv: CvProfile) => void
}

const playingAgeOptions = Array.from({ length: 90 }, (_, i) => String(i + 1))

const emptyTraitDraft = { trait: distinguishingTraitOptions[0], location: traitLocationOptions[0] }
const emptyTrainingDraft = { course: '', institution: '', startDate: '', endDate: '' }

export default function EditCvGeneral({ t, cv, setCv }: Props) {
  const [cityInput, setCityInput] = useState('')
  const [nationalityInput, setNationalityInput] = useState('')
  const [traitDraft, setTraitDraft] = useState(emptyTraitDraft)
  const [trainingDraft, setTrainingDraft] = useState(emptyTrainingDraft)
  const [saved, setSaved] = useState(false)

  const set = <K extends keyof CvProfile>(key: K, value: CvProfile[K]) => setCv({ ...cv, [key]: value })

  const addCity = () => {
    if (!cityInput.trim() || cv.cities.length >= 3) return
    set('cities', [...cv.cities, cityInput.trim()])
    setCityInput('')
  }
  const removeCity = (i: number) => set('cities', cv.cities.filter((_, idx) => idx !== i))

  const addNationality = () => {
    if (!nationalityInput.trim() || cv.nationalities.length >= 5) return
    set('nationalities', [...cv.nationalities, nationalityInput.trim()])
    setNationalityInput('')
  }
  const removeNationality = (i: number) => set('nationalities', cv.nationalities.filter((_, idx) => idx !== i))

  const addTrait = () => {
    set('distinguishingTraits', [...cv.distinguishingTraits, { ...traitDraft }])
  }
  const removeTrait = (i: number) => set('distinguishingTraits', cv.distinguishingTraits.filter((_, idx) => idx !== i))

  const addTraining = () => {
    if (!trainingDraft.course.trim()) return
    const record: TrainingRecord = { id: `tr-${Date.now()}`, ...trainingDraft }
    set('training', [...cv.training, record])
    setTrainingDraft(emptyTrainingDraft)
  }
  const removeTraining = (id: string) => set('training', cv.training.filter((tr) => tr.id !== id))

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2500)
  }

  return (
    <form onSubmit={handleSave} className="space-y-8">
      <SectionCard t={t} title="Personal Data">
        <div className="grid md:grid-cols-2 gap-5">
          <Field t={t} label="Name">
            <input className={inputClass} style={inputStyle(t)} value={cv.name} onChange={(e) => set('name', e.target.value)} />
          </Field>
          <Field t={t} label="Website">
            <input className={inputClass} style={inputStyle(t)} value={cv.website} onChange={(e) => set('website', e.target.value)} />
          </Field>
          <Field t={t} label="Country">
            <select className={inputClass} style={inputStyle(t)} value={cv.country} onChange={(e) => set('country', e.target.value)}>
              {fullCountryList.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field t={t} label="Phone Number">
            <input className={inputClass} style={inputStyle(t)} value={cv.phone} onChange={(e) => set('phone', e.target.value)} />
          </Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>ID / Passport Number</label>
              <DocStatusBadge t={t} status={cv.idPassportStatus} />
            </div>
            <input className={`${inputClass} mb-3`} style={inputStyle(t)} value={cv.idPassportNumber} onChange={(e) => set('idPassportNumber', e.target.value)} />
            <FileInputField t={t} fileName="" placeholder="Upload ID / Passport" onChange={() => set('idPassportStatus', 'Pending')} />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>KRA / Tax Number</label>
              <DocStatusBadge t={t} status={cv.kraTaxStatus} />
            </div>
            <input className={`${inputClass} mb-3`} style={inputStyle(t)} value={cv.kraTaxNumber} onChange={(e) => set('kraTaxNumber', e.target.value)} />
            <FileInputField t={t} fileName="" placeholder="Upload KRA / Tax Document" onChange={() => set('kraTaxStatus', 'Pending')} />
          </div>

          <Field t={t} label="Physical Address">
            <input className={inputClass} style={inputStyle(t)} value={cv.physicalAddress} onChange={(e) => set('physicalAddress', e.target.value)} />
          </Field>
          <Field t={t} label="Email">
            <input disabled className={`${inputClass} opacity-60 cursor-not-allowed`} style={inputStyle(t)} value={cv.email} readOnly />
          </Field>
          <Field t={t} label="My Profile Link">
            <input disabled className={`${inputClass} opacity-60 cursor-not-allowed`} style={inputStyle(t)} value={`rafikihub.com/profile/${cv.profileLinkSlug}`} readOnly />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field t={t} label="Playing Age From">
              <select className={inputClass} style={inputStyle(t)} value={cv.playingAgeFrom} onChange={(e) => set('playingAgeFrom', e.target.value)}>
                {playingAgeOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
            <Field t={t} label="Playing Age To">
              <select className={inputClass} style={inputStyle(t)} value={cv.playingAgeTo} onChange={(e) => set('playingAgeTo', e.target.value)}>
                {playingAgeOptions.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </Field>
          </div>

          <Field t={t} label="Date of Birth">
            <input type="date" className={inputClass} style={inputStyle(t)} value={cv.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
          </Field>
          <Field t={t} label="Gender">
            <select className={inputClass} style={inputStyle(t)} value={cv.gender} onChange={(e) => set('gender', e.target.value)}>
              {genderOptions.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </Field>
          <Field t={t} label="Music Genre">
            <input className={inputClass} style={inputStyle(t)} value={cv.musicGenre} onChange={(e) => set('musicGenre', e.target.value)} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field t={t} label="Height (ft)">
              <select className={inputClass} style={inputStyle(t)} value={cv.heightFeet} onChange={(e) => set('heightFeet', e.target.value)}>
                {heightFeetOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
            <Field t={t} label="Height (in)">
              <select className={inputClass} style={inputStyle(t)} value={cv.heightInches} onChange={(e) => set('heightInches', e.target.value)}>
                {heightInchesOptions.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </Field>
          </div>
        </div>
      </SectionCard>

      <SectionCard t={t} title="City & Country">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Field t={t} label="Cities" hint="Up to 3 cities.">
              <div className="flex gap-2">
                <input className={inputClass} style={inputStyle(t)} value={cityInput} onChange={(e) => setCityInput(e.target.value)} placeholder="e.g. Dakar" />
                <button type="button" onClick={addCity} className="px-4 rounded-lg text-xs font-semibold uppercase tracking-wide flex-shrink-0" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>Add</button>
              </div>
            </Field>
            <TagChips t={t} items={cv.cities} onRemove={removeCity} />
          </div>
          <div>
            <Field t={t} label="Nationalities" hint="Up to 5 nationalities.">
              <div className="flex gap-2">
                <input className={inputClass} style={inputStyle(t)} value={nationalityInput} onChange={(e) => setNationalityInput(e.target.value)} placeholder="e.g. Senegalese" />
                <button type="button" onClick={addNationality} className="px-4 rounded-lg text-xs font-semibold uppercase tracking-wide flex-shrink-0" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>Add</button>
              </div>
            </Field>
            <TagChips t={t} items={cv.nationalities} onRemove={removeNationality} />
          </div>
        </div>
      </SectionCard>

      <SectionCard t={t} title="Appearance">
        <div className="grid md:grid-cols-3 gap-5">
          <Field t={t} label="Appearance">
            <select className={inputClass} style={inputStyle(t)} value={cv.appearance} onChange={(e) => set('appearance', e.target.value)}>
              <option value="">—</option>
              {appearanceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="Eye Color">
            <select className={inputClass} style={inputStyle(t)} value={cv.eyeColor} onChange={(e) => set('eyeColor', e.target.value)}>
              <option value="">—</option>
              {eyeColorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="Hair Color">
            <select className={inputClass} style={inputStyle(t)} value={cv.hairColor} onChange={(e) => set('hairColor', e.target.value)}>
              <option value="">—</option>
              {hairColorOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="Hair Length">
            <select className={inputClass} style={inputStyle(t)} value={cv.hairLength} onChange={(e) => set('hairLength', e.target.value)}>
              <option value="">—</option>
              {hairLengthOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="Facial Hair">
            <select className={inputClass} style={inputStyle(t)} value={cv.facialHair} onChange={(e) => set('facialHair', e.target.value)}>
              <option value="">—</option>
              {facialHairOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard t={t} title="Voice Attributes">
        <div className="grid md:grid-cols-2 gap-5">
          <Field t={t} label="Voice Quality">
            <select className={inputClass} style={inputStyle(t)} value={cv.voiceQuality} onChange={(e) => set('voiceQuality', e.target.value)}>
              <option value="">—</option>
              {voiceQualityOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="Voice Character">
            <select className={inputClass} style={inputStyle(t)} value={cv.voiceCharacter} onChange={(e) => set('voiceCharacter', e.target.value)}>
              <option value="">—</option>
              {voiceCharacterOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard t={t} title="Vocal Range">
        <div className="grid md:grid-cols-3 gap-5">
          <Field t={t} label="Low Voice">
            <select className={inputClass} style={inputStyle(t)} value={cv.lowVoice} onChange={(e) => set('lowVoice', e.target.value)}>
              <option value="">—</option>
              {lowVoiceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="Medium Voice">
            <select className={inputClass} style={inputStyle(t)} value={cv.mediumVoice} onChange={(e) => set('mediumVoice', e.target.value)}>
              <option value="">—</option>
              {mediumVoiceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="High Voice">
            <select className={inputClass} style={inputStyle(t)} value={cv.highVoice} onChange={(e) => set('highVoice', e.target.value)}>
              <option value="">—</option>
              {highVoiceOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard t={t} title="Further Measurements">
        <label className="flex items-center gap-3 text-sm" style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}>
          <input type="checkbox" checked={cv.showFurtherMeasurements} onChange={(e) => set('showFurtherMeasurements', e.target.checked)} />
          Also add &amp; display this section
        </label>
        {cv.showFurtherMeasurements && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
            {([
              ['bustChest', 'Bust/Chest'], ['waist', 'Waist'], ['insideLeg', 'Inside Leg'], ['insideArm', 'Inside Arm'],
              ['collar', 'Collar'], ['hat', 'Hat'], ['weightKg', 'Weight (Kg)'], ['shoeSize', 'Shoe Size'],
              ['hips', 'Hips'], ['dressSize', 'Dress Size'],
            ] as [keyof CvProfile, string][]).map(([key, label]) => (
              <Field key={key} t={t} label={label}>
                <input className={inputClass} style={inputStyle(t)} value={cv[key] as string} onChange={(e) => set(key, e.target.value as CvProfile[typeof key])} />
              </Field>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard t={t} title="Distinguishing Traits">
        <label className="flex items-center gap-3 text-sm" style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}>
          <input type="checkbox" checked={cv.hasTwin} onChange={(e) => set('hasTwin', e.target.checked)} />
          Have a twin?
        </label>
        <div className="grid md:grid-cols-3 gap-3 items-end">
          <Field t={t} label="Appearance Trait">
            <select className={inputClass} style={inputStyle(t)} value={traitDraft.trait} onChange={(e) => setTraitDraft({ ...traitDraft, trait: e.target.value })}>
              {distinguishingTraitOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field t={t} label="Trait Location">
            <select className={inputClass} style={inputStyle(t)} value={traitDraft.location} onChange={(e) => setTraitDraft({ ...traitDraft, location: e.target.value })}>
              {traitLocationOptions.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <button type="button" onClick={addTrait} className="px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wide" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>Add Trait</button>
        </div>
        {cv.distinguishingTraits.length > 0 && (
          <div className="space-y-2">
            {cv.distinguishingTraits.map((tr, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm" style={{ background: t.bg2, border: `1px solid ${t.border}`, color: t.fgDim, fontFamily: 'var(--font-sans)' }}>
                <span>{tr.trait} &middot; {tr.location}</span>
                <button type="button" onClick={() => removeTrait(i)} className="text-xs font-semibold" style={{ color: '#D64545' }}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard t={t} title="Training">
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <Field t={t} label="Course Name">
            <input className={inputClass} style={inputStyle(t)} value={trainingDraft.course} onChange={(e) => setTrainingDraft({ ...trainingDraft, course: e.target.value })} />
          </Field>
          <Field t={t} label="Institution Name">
            <input className={inputClass} style={inputStyle(t)} value={trainingDraft.institution} onChange={(e) => setTrainingDraft({ ...trainingDraft, institution: e.target.value })} />
          </Field>
          <Field t={t} label="Date Started">
            <input type="month" className={inputClass} style={inputStyle(t)} value={trainingDraft.startDate} onChange={(e) => setTrainingDraft({ ...trainingDraft, startDate: e.target.value })} />
          </Field>
          <Field t={t} label="Date Ended">
            <input type="month" className={inputClass} style={inputStyle(t)} value={trainingDraft.endDate} onChange={(e) => setTrainingDraft({ ...trainingDraft, endDate: e.target.value })} />
          </Field>
        </div>
        <button type="button" onClick={addTraining} className="px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wide" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>+ Add Training</button>

        {cv.training.length > 0 && (
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${t.border}` }}>
            {cv.training.map((tr, i) => (
              <div key={tr.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-3" style={{ borderTop: i === 0 ? 'none' : `1px solid ${t.border}` }}>
                <div className="min-w-[140px]">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>Course</div>
                  <div className="text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{tr.course}</div>
                </div>
                <div className="min-w-[140px]">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>Institution</div>
                  <div className="text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{tr.institution || '—'}</div>
                </div>
                <div className="min-w-[100px]">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>Start Date</div>
                  <div className="text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{tr.startDate || '—'}</div>
                </div>
                <div className="min-w-[100px]">
                  <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle }}>End Date</div>
                  <div className="text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{tr.endDate || '—'}</div>
                </div>
                <button type="button" onClick={() => removeTraining(tr.id)} className="ml-auto text-xs font-semibold uppercase tracking-wide" style={{ color: '#D64545' }}>Remove</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2">
          <label className="block text-xs font-semibold uppercase tracking-wide" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Education Certificates</label>
          <DocStatusBadge t={t} status={cv.educationCertificateStatus} />
        </div>
        <FileInputField t={t} fileName="" placeholder="Upload Education Certificates" onChange={() => set('educationCertificateStatus', 'Pending')} />
      </SectionCard>

      <SectionCard t={t} title="About Me">
        <textarea rows={5} className={inputClass} style={inputStyle(t)} value={cv.aboutMe} onChange={(e) => set('aboutMe', e.target.value)} />
      </SectionCard>

      <div className="flex items-center gap-4">
        <PrimaryButton t={t} type="submit">Save Changes</PrimaryButton>
        {saved && <span className="text-sm font-medium" style={{ color: t.terra, fontFamily: 'var(--font-sans)' }}>Saved!</span>}
      </div>
    </form>
  )
}
