import { useState } from 'react'
import type { Theme } from '../../theme'
import { skillCategories, type CvProfile, type SkillEntry } from '../../data'
import { SectionCard, Field, inputStyle, inputClass } from './shared'

interface Props {
  t: Theme
  cv: CvProfile
  setCv: (cv: CvProfile) => void
}

export default function EditCvSkillsLinks({ t, cv, setCv }: Props) {
  const [drafts, setDrafts] = useState<Record<string, { name: string; proficiency: string }>>(
    Object.fromEntries(skillCategories.map((c) => [c.name, { name: '', proficiency: c.proficiencyOptions[0] }])),
  )

  const set = <K extends keyof CvProfile>(key: K, value: CvProfile[K]) => setCv({ ...cv, [key]: value })

  const addSkill = (categoryName: string) => {
    const draft = drafts[categoryName]
    if (!draft?.name.trim()) return
    const entry: SkillEntry = { id: `sk-${Date.now()}`, category: categoryName, name: draft.name.trim(), proficiency: draft.proficiency }
    set('skills', [...cv.skills, entry])
    setDrafts({ ...drafts, [categoryName]: { ...draft, name: '' } })
  }

  const removeSkill = (id: string) => set('skills', cv.skills.filter((s) => s.id !== id))

  return (
    <div className="space-y-6">
      {skillCategories.map((category) => {
        const draft = drafts[category.name]
        const entries = cv.skills.filter((s) => s.category === category.name)
        return (
          <SectionCard key={category.name} t={t} title={category.name}>
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Skill Name</label>
                <input
                  className={inputClass}
                  style={inputStyle(t)}
                  value={draft.name}
                  onChange={(e) => setDrafts({ ...drafts, [category.name]: { ...draft, name: e.target.value } })}
                />
              </div>
              <div className="min-w-[160px]">
                <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: t.mutedFg, fontFamily: 'var(--font-sans)' }}>Proficiency</label>
                <select
                  className={inputClass}
                  style={inputStyle(t)}
                  value={draft.proficiency}
                  onChange={(e) => setDrafts({ ...drafts, [category.name]: { ...draft, proficiency: e.target.value } })}
                >
                  {category.proficiencyOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
              <button
                type="button"
                onClick={() => addSkill(category.name)}
                className="px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-wide flex-shrink-0"
                style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}
              >
                Add
              </button>
            </div>
            {entries.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {entries.map((s) => (
                  <span key={s.id} className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-2" style={{ background: t.g10, color: t.terra, fontFamily: 'var(--font-sans)' }}>
                    {s.name} &middot; {s.proficiency}
                    <button type="button" onClick={() => removeSkill(s.id)} aria-label={`Remove ${s.name}`} style={{ color: t.terra, lineHeight: 1 }}>×</button>
                  </span>
                ))}
              </div>
            )}
          </SectionCard>
        )
      })}

      <SectionCard t={t} title="Social Media Links">
        <div className="grid md:grid-cols-3 gap-5">
          <Field t={t} label="Facebook URL">
            <input className={inputClass} style={inputStyle(t)} value={cv.facebookUrl} onChange={(e) => set('facebookUrl', e.target.value)} />
          </Field>
          <Field t={t} label="Twitter URL">
            <input className={inputClass} style={inputStyle(t)} value={cv.twitterUrl} onChange={(e) => set('twitterUrl', e.target.value)} />
          </Field>
          <Field t={t} label="Instagram URL">
            <input className={inputClass} style={inputStyle(t)} value={cv.instagramUrl} onChange={(e) => set('instagramUrl', e.target.value)} />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}
