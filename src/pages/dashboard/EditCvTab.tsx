import { useState } from 'react'
import type { Theme } from '../../theme'
import type { CvProfile } from '../../data'
import { PillTabs } from './shared'
import EditCvGeneral from './EditCvGeneral'
import EditCvSkillsLinks from './EditCvSkillsLinks'
import EditCvCredits from './EditCvCredits'
import PreviewCv from './PreviewCv'

interface Props {
  t: Theme
  cv: CvProfile
  setCv: (cv: CvProfile) => void
}

type Pill = 'general' | 'skills' | 'credits' | 'preview'

// EDIT CV — the big performer form, dashboard/index.php's createTheCV form.
// A hidden tab on the real site (reached from HOME/elsewhere, not a top nav
// item) — split into General / Skills & Links / Credits / Preview pills to
// keep the huge field list manageable.
export default function EditCvTab({ t, cv, setCv }: Props) {
  const [pill, setPill] = useState<Pill>('general')

  return (
    <div>
      <PillTabs
        t={t}
        active={pill}
        onChange={setPill}
        tabs={[
          { id: 'general', label: 'General' },
          { id: 'skills', label: 'Skills & Links' },
          { id: 'credits', label: 'Credits' },
          { id: 'preview', label: 'Preview' },
        ]}
      />
      {pill === 'general' && <EditCvGeneral t={t} cv={cv} setCv={setCv} />}
      {pill === 'skills' && <EditCvSkillsLinks t={t} cv={cv} setCv={setCv} />}
      {pill === 'credits' && <EditCvCredits t={t} cv={cv} setCv={setCv} />}
      {pill === 'preview' && <PreviewCv t={t} cv={cv} />}
    </div>
  )
}
