import type { Theme } from '../../theme'
import type { SkillEntry, CreditRecord, TrainingRecord } from '../../data'
import { RowTable } from './shared'

// Small read-only CV-rendering helpers shared between the Edit CV tab's
// "Preview" pill (dashboard) and the public profile page (ProfilePage.tsx) —
// both need to render the same skills/credits/training shapes.

export function computeAge(dateOfBirth: string): number | null {
  if (!dateOfBirth) return null
  const dob = new Date(dateOfBirth)
  if (Number.isNaN(dob.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - dob.getFullYear()
  const monthDiff = now.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) age--
  return age
}

export function SkillsTable({ t, skills }: { t: Theme; skills: SkillEntry[] }) {
  return (
    <RowTable
      t={t}
      rows={skills}
      emptyMessage="No skills listed yet."
      columns={[
        { key: 'category', label: 'Skill Type' },
        { key: 'name', label: 'Skill Name' },
        { key: 'proficiency', label: 'Proficiency' },
      ]}
    />
  )
}

export function CreditsTable({ t, credits }: { t: Theme; credits: CreditRecord[] }) {
  return (
    <RowTable
      t={t}
      rows={credits}
      emptyMessage="No credits listed yet."
      columns={[
        { key: 'title', label: 'Name' },
        { key: 'productionYear', label: 'Year' },
        { key: 'type', label: 'Type' },
        { key: 'role', label: 'Role' },
        { key: 'productionCompany', label: 'Production Company' },
        { key: 'director', label: 'Director' },
      ]}
    />
  )
}

export function TrainingTable({ t, training }: { t: Theme; training: TrainingRecord[] }) {
  return (
    <RowTable
      t={t}
      rows={training}
      emptyMessage="No training listed yet."
      columns={[
        { key: 'course', label: 'Course' },
        { key: 'institution', label: 'Institution' },
        { key: 'startDate', label: 'Start Date' },
        { key: 'endDate', label: 'End Date' },
      ]}
    />
  )
}
