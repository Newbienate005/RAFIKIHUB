import type { Theme } from '../../theme'
import type { CvProfile } from '../../data'
import { SectionCard } from './shared'
import { computeAge, SkillsTable, CreditsTable } from './cvDisplay'

interface Props {
  t: Theme
  cv: CvProfile
}

// Edit CV "Preview" pill — a quick self-check summary of the key CV fields,
// as they'd appear on the public profile.
export default function PreviewCv({ t, cv }: Props) {
  const age = computeAge(cv.dateOfBirth)

  const facts: [string, string][] = [
    ['Country', cv.country || '—'],
    ['Age', age !== null ? String(age) : '—'],
    ['Playing Age', `${cv.playingAgeFrom || '—'} – ${cv.playingAgeTo || '—'}`],
    ['Height', `${cv.heightFeet || '—'} ${cv.heightInches || ''}`.trim()],
    ['Cities', cv.cities.join(', ') || '—'],
    ['Nationalities', cv.nationalities.join(', ') || '—'],
    ['Appearance', cv.appearance || '—'],
    ['Eye Color', cv.eyeColor || '—'],
    ['Hair Color', cv.hairColor || '—'],
    ['Hair Length', cv.hairLength || '—'],
    ['Voice Quality', cv.voiceQuality || '—'],
    ['Voice Character', cv.voiceCharacter || '—'],
  ]

  return (
    <div className="space-y-8">
      <SectionCard t={t} title={cv.name || 'Your Name'}>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {facts.map(([label, value]) => (
            <div key={label}>
              <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: t.subtle, fontFamily: 'var(--font-sans)' }}>{label}</div>
              <div className="text-sm" style={{ color: t.fg, fontFamily: 'var(--font-sans)' }}>{value}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard t={t} title="About Me">
        <p className="text-sm leading-relaxed" style={{ color: t.fgDim, fontFamily: 'var(--font-sans)' }}>{cv.aboutMe || 'Nothing written yet.'}</p>
      </SectionCard>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Skills</h4>
        <SkillsTable t={t} skills={cv.skills} />
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: t.gold, fontFamily: 'var(--font-sans)' }}>Credits</h4>
        <CreditsTable t={t} credits={cv.credits} />
      </div>
    </div>
  )
}
